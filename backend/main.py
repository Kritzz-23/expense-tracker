from fastapi import FastAPI, Depends, HTTPException, status, UploadFile, File
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from fastapi.middleware.cors import CORSMiddleware
from sqlmodel import Session, select
from database import engine, create_db
from models import Expense, User
from passlib.context import CryptContext
import jwt
from datetime import datetime, timedelta
from chains import categorize_expense
import pandas as pd
from collections import defaultdict
from pydantic import BaseModel

# --- AUTH CONFIG ---
SECRET_KEY = "super-secret-expense-tracker-key" 
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60 * 24 * 7 

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="login")

def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password[:72], hashed_password)

def get_password_hash(password):
    return pwd_context.hash(password[:72])

def create_access_token(data: dict, expires_delta: timedelta = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=15)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

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

# --- APP SETUP ---
app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
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

# --- AUTH ENDPOINTS ---
class UserCreate(BaseModel):
    username: str
    password: str

@app.post("/signup")
def signup(user: UserCreate):
    with Session(engine) as session:
        existing_user = session.exec(select(User).where(User.username == user.username)).first()
        if existing_user:
            raise HTTPException(status_code=400, detail="Username already registered")
        
        hashed_pw = get_password_hash(user.password)
        db_user = User(username=user.username, hashed_password=hashed_pw)
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
            data={"sub": user.username}, expires_delta=access_token_expires
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
        user_id=current_user.id
    )

    with Session(engine) as session:
        session.add(expense)
        session.commit()
        session.refresh(expense)

    return expense

@app.get("/history/")
def get_history(current_user: User = Depends(get_current_user)):
    with Session(engine) as session:
        expenses = session.exec(select(Expense).where(Expense.user_id == current_user.id)).all()
    return expenses

@app.get("/summary/")
def get_summary(current_user: User = Depends(get_current_user)):
    with Session(engine) as session:
        expenses = session.exec(select(Expense).where(Expense.user_id == current_user.id)).all()

    summary = defaultdict(float)
    for e in expenses:
        summary[e.category] += e.amount
    return summary

@app.post("/upload-csv/")
async def upload_csv(file: UploadFile = File(...), current_user: User = Depends(get_current_user)):
    df = pd.read_csv(file.file)

    with Session(engine) as session:
        for _, row in df.iterrows():
            category = categorize_expense(str(row["description"]))

            expense = Expense(
                description=row["description"],
                amount=float(row["amount"]),
                category=category,
                date=datetime.utcnow(),
                user_id=current_user.id
            )
            session.add(expense)
        session.commit()

    return {"message": "CSV uploaded successfully"}