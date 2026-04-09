from datetime import datetime
from typing import List, Optional

from sqlmodel import Field, Relationship, SQLModel

class User(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    username: str = Field(unique=True, index=True)
    hashed_password: str

    expenses: List["Expense"] = Relationship(back_populates="user")
    budget: Optional["Budget"] = Relationship(back_populates="user")

class Expense(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    description: str
    amount: float
    category: str
    date: datetime = Field(default_factory=datetime.utcnow)
    
    user_id: int = Field(foreign_key="user.id")
    user: Optional[User] = Relationship(back_populates="expenses")


class Budget(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    monthly_limit: float

    user_id: int = Field(foreign_key="user.id", unique=True)
    user: Optional[User] = Relationship(back_populates="budget")
