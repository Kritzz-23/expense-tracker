import logging
import os
from datetime import date, datetime, time, timedelta
from typing import Optional

import jwt
import pandas as pd
from fastapi import Depends, FastAPI, File, HTTPException, Query, UploadFile, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from passlib.context import CryptContext
from pydantic import BaseModel
from sqlmodel import Session, select

from chains import answer_finance_chat, categorize_expense, generate_insight_summary
from database import create_db, engine
from finance_service import (
    build_analytics,
    build_budget_status,
    build_chat_context,
    build_insight_metrics,
    category_totals,
    detect_recurring_expenses,
    recurring_description_set,
    serialize_expense,
)
from models import Budget, Expense, User

# --- AUTH CONFIG ---
SECRET_KEY = os.getenv("SECRET_KEY", "super-secret-expense-tracker-key")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60 * 24 * 7

logger = logging.getLogger("uvicorn.error")
if SECRET_KEY == "super-secret-expense-tracker-key":
    logger.warning("SECRET_KEY is using the insecure default. Set SECRET_KEY in production.")

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="login")


def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password[:72], hashed_password)


def get_password_hash(password):
    return pwd_context.hash(password[:72])


def create_access_token(data: dict, expires_delta: timedelta = None):
    to_encode = data.copy()
    expire = datetime.utcnow() + (expires_delta or timedelta(minutes=15))
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)


def get_current_user(token: str = Depends(oauth2_scheme)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username: str = payload.get("sub")
        if username is None:
            raise credentials_exception
    except jwt.PyJWTError:
        raise credentials_exception

    with Session(engine) as session:
        user = session.exec(select(User).where(User.username == username)).first()
        if user is None:
            raise credentials_exception
        return user


def _parse_date_boundary(value: Optional[str], *, end_of_day: bool) -> Optional[datetime]:
    if not value:
        return None

    value = value.strip()
    try:
        if "T" in value:
            return datetime.fromisoformat(value)
        parsed_date = date.fromisoformat(value)
        return datetime.combine(parsed_date, time.max if end_of_day else time.min)
    except ValueError as exc:
        raise HTTPException(status_code=400, detail=f"Invalid date value: {value}") from exc


def _filtered_expense_query(
    current_user: User,
    *,
    category: Optional[str] = None,
    search: Optional[str] = None,
    date_from: Optional[str] = None,
    date_to: Optional[str] = None,
):
    statement = select(Expense).where(Expense.user_id == current_user.id)

    normalized_category = (category or "").strip().lower()
    if normalized_category and normalized_category != "all":
        statement = statement.where(Expense.category == normalized_category)

    normalized_search = (search or "").strip()
    if normalized_search:
        statement = statement.where(Expense.description.ilike(f"%{normalized_search}%"))

    parsed_start = _parse_date_boundary(date_from, end_of_day=False)
    if parsed_start:
        statement = statement.where(Expense.date >= parsed_start)

    parsed_end = _parse_date_boundary(date_to, end_of_day=True)
    if parsed_end:
        statement = statement.where(Expense.date <= parsed_end)

    return statement.order_by(Expense.date.desc())


def _get_user_budget(session: Session, user_id: int) -> Optional[Budget]:
    return session.exec(select(Budget).where(Budget.user_id == user_id)).first()


# --- APP SETUP ---
app = FastAPI()

cors_origins = [origin.strip() for origin in os.getenv("CORS_ORIGINS", "*").split(",") if origin.strip()]

app.add_middleware(
    CORSMiddleware,
    allow_origins=cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def read_root():
    return {"message": "Expense Tracker Api is running..."}


@app.on_event("startup")
def on_startup():
    create_db()


# --- REQUEST MODELS ---
class UserCreate(BaseModel):
    username: str
    password: str


class BudgetCreate(BaseModel):
    monthly_limit: float


class ChatRequest(BaseModel):
    message: str


# --- AUTH ENDPOINTS ---
@app.post("/signup")
def signup(user: UserCreate):
    with Session(engine) as session:
        existing_user = session.exec(select(User).where(User.username == user.username)).first()
        if existing_user:
            raise HTTPException(status_code=400, detail="Username already registered")

        db_user = User(username=user.username, hashed_password=get_password_hash(user.password))
        session.add(db_user)
        session.commit()
        return {"message": "User created successfully"}


@app.post("/login")
def login(form_data: OAuth2PasswordRequestForm = Depends()):
    with Session(engine) as session:
        user = session.exec(select(User).where(User.username == form_data.username)).first()
        if not user or not verify_password(form_data.password, user.hashed_password):
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Incorrect username or password",
                headers={"WWW-Authenticate": "Bearer"},
            )

        access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
        access_token = create_access_token(
            data={"sub": user.username},
            expires_delta=access_token_expires,
        )
        return {"access_token": access_token, "token_type": "bearer"}


# --- EXPENSE ENDPOINTS ---
@app.post("/add-expense/")
def add_expense(description: str, amount: float, current_user: User = Depends(get_current_user)):
    category = categorize_expense(description)

    expense = Expense(
        description=description,
        amount=amount,
        category=category,
        user_id=current_user.id,
    )

    with Session(engine) as session:
        session.add(expense)
        session.commit()
        session.refresh(expense)

        recurring_set = recurring_description_set(
            session.exec(select(Expense).where(Expense.user_id == current_user.id)).all()
        )
        return serialize_expense(expense, recurring_set)


@app.get("/history/")
def get_history(
    category: Optional[str] = None,
    search: Optional[str] = None,
    date_from: Optional[str] = None,
    date_to: Optional[str] = None,
    current_user: User = Depends(get_current_user),
):
    with Session(engine) as session:
        all_expenses = session.exec(select(Expense).where(Expense.user_id == current_user.id)).all()
        recurring_set = recurring_description_set(all_expenses)
        expenses = session.exec(
            _filtered_expense_query(
                current_user,
                category=category,
                search=search,
                date_from=date_from,
                date_to=date_to,
            )
        ).all()
        return [serialize_expense(expense, recurring_set) for expense in expenses]


@app.get("/summary/")
def get_summary(
    category: Optional[str] = None,
    date_from: Optional[str] = None,
    date_to: Optional[str] = None,
    current_user: User = Depends(get_current_user),
):
    with Session(engine) as session:
        expenses = session.exec(
            _filtered_expense_query(
                current_user,
                category=category,
                date_from=date_from,
                date_to=date_to,
            )
        ).all()
    return category_totals(expenses)


@app.post("/upload-csv/")
async def upload_csv(file: UploadFile = File(...), current_user: User = Depends(get_current_user)):
    try:
        df = pd.read_csv(file.file)
    except Exception as exc:
        raise HTTPException(status_code=400, detail="Could not parse the uploaded CSV file.") from exc

    required_columns = {"description", "amount"}
    if not required_columns.issubset(set(df.columns)):
        raise HTTPException(
            status_code=400,
            detail="CSV must contain 'description' and 'amount' columns.",
        )

    with Session(engine) as session:
        for _, row in df.iterrows():
            try:
                amount = float(row["amount"])
            except (ValueError, TypeError) as exc:
                raise HTTPException(
                    status_code=400,
                    detail=f"Invalid amount value: {row['amount']!r}",
                ) from exc

            category = categorize_expense(str(row["description"]))
            expense = Expense(
                description=str(row["description"]),
                amount=amount,
                category=category,
                date=datetime.utcnow(),
                user_id=current_user.id,
            )
            session.add(expense)
        session.commit()

    return {"message": "CSV uploaded successfully"}


# --- BUDGET ENDPOINTS ---
@app.post("/budget")
def upsert_budget(payload: BudgetCreate, current_user: User = Depends(get_current_user)):
    if payload.monthly_limit <= 0:
        raise HTTPException(status_code=400, detail="Monthly limit must be greater than zero")

    with Session(engine) as session:
        budget = _get_user_budget(session, current_user.id)
        if budget:
            budget.monthly_limit = payload.monthly_limit
        else:
            budget = Budget(user_id=current_user.id, monthly_limit=payload.monthly_limit)
            session.add(budget)

        session.commit()
        session.refresh(budget)

        expenses = session.exec(select(Expense).where(Expense.user_id == current_user.id)).all()
        return build_budget_status(expenses, monthly_limit=budget.monthly_limit)


@app.get("/budget")
def get_budget(current_user: User = Depends(get_current_user)):
    with Session(engine) as session:
        budget = _get_user_budget(session, current_user.id)
        expenses = session.exec(select(Expense).where(Expense.user_id == current_user.id)).all()
        return build_budget_status(expenses, monthly_limit=budget.monthly_limit if budget else None)


# --- ANALYTICS ENDPOINTS ---
@app.get("/analytics")
def get_analytics(
    range_name: str = Query("weekly", alias="range"),
    category: Optional[str] = None,
    date_from: Optional[str] = None,
    date_to: Optional[str] = None,
    current_user: User = Depends(get_current_user),
):
    selected_range = range_name if range_name in {"weekly", "monthly", "manual"} else "weekly"
    
    manual_start = None
    manual_end = None
    if selected_range == "manual" and date_from and date_to:
        manual_start = _parse_date_boundary(date_from, end_of_day=False)
        manual_end = _parse_date_boundary(date_to, end_of_day=True)
        # fallback if somehow invalid
        if not manual_start or not manual_end:
            selected_range = "weekly"
    
    with Session(engine) as session:
        expenses = session.exec(
            _filtered_expense_query(
                current_user,
                category=category,
                date_from=date_from if selected_range == "manual" else None,
                date_to=date_to if selected_range == "manual" else None,
            )
        ).all()
        
    return build_analytics(
        expenses, 
        range_name=selected_range, 
        manual_start=manual_start, 
        manual_end=manual_end
    )


@app.get("/insights")
def get_insights(current_user: User = Depends(get_current_user)):
    with Session(engine) as session:
        expenses = session.exec(select(Expense).where(Expense.user_id == current_user.id)).all()

    metrics = build_insight_metrics(expenses)
    summary = generate_insight_summary(metrics)
    return {
        "summary": summary,
        "top_category": metrics["top_category"],
        "increase_percent": f"{metrics['weekly_change_percent']:.2f}%",
        "prediction": f"INR {metrics['prediction_amount']:.2f}",
        "weekly_total": metrics["weekly_total"],
        "monthly_total": metrics["monthly_total"],
        "top_category_amount": metrics["top_category_amount"],
    }


@app.get("/recurring")
def get_recurring(current_user: User = Depends(get_current_user)):
    with Session(engine) as session:
        expenses = session.exec(select(Expense).where(Expense.user_id == current_user.id)).all()
    return detect_recurring_expenses(expenses)


# --- CHAT ENDPOINT ---
@app.post("/chat")
def chat_with_assistant(payload: ChatRequest, current_user: User = Depends(get_current_user)):
    with Session(engine) as session:
        expenses = session.exec(select(Expense).where(Expense.user_id == current_user.id)).all()
        budget = _get_user_budget(session, current_user.id)

    context = build_chat_context(
        expenses,
        monthly_limit=budget.monthly_limit if budget else None,
    )
    answer = answer_finance_chat(payload.message, context)
    return {"answer": answer}
