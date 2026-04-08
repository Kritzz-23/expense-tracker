from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from sqlmodel import Session, select
from database import engine, create_db
from models import Expense
from chains import categorize_expense
import pandas as pd
from datetime import datetime
from collections import defaultdict

app = FastAPI()

# Allow the React frontend (running on port 5173) to communicate with the backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
def on_startup():
    create_db()

# ✅ Add Expense
@app.post("/add-expense/")
def add_expense(description: str, amount: float):
    category = categorize_expense(description)

    expense = Expense(
        description=description,
        amount=amount,
        category=category
    )

    with Session(engine) as session:
        session.add(expense)
        session.commit()
        session.refresh(expense)

    return expense


# ✅ Get All History
@app.get("/history/")
def get_history():
    with Session(engine) as session:
        expenses = session.exec(select(Expense)).all()
    return expenses


# ✅ Monthly Summary (for charts)
@app.get("/summary/")
def get_summary():
    with Session(engine) as session:
        expenses = session.exec(select(Expense)).all()

    summary = defaultdict(float)

    for e in expenses:
        summary[e.category] += e.amount

    return summary


# ✅ CSV Upload
@app.post("/upload-csv/")
async def upload_csv(file: UploadFile = File(...)):
    df = pd.read_csv(file.file)

    with Session(engine) as session:
        for _, row in df.iterrows():
            category = categorize_expense(str(row["description"]))

            expense = Expense(
                description=row["description"],
                amount=float(row["amount"]),
                category=category,
                date=datetime.utcnow()
            )

            session.add(expense)

        session.commit()

    return {"message": "CSV uploaded successfully"}