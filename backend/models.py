from sqlmodel import SQLModel, Field
from typing import Optional
from datetime import datetime

class Expense(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    description: str
    amount: float
    category: str
    date: datetime = Field(default_factory=datetime.utcnow)