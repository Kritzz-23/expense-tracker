import os
from sqlmodel import SQLModel, create_engine

# Read DATABASE_URL from environment (Render injects this for Postgres)
DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///finance.db")

# SQLAlchemy requires postgresql:// instead of postgres:// 
if DATABASE_URL.startswith("postgres://"):
    DATABASE_URL = DATABASE_URL.replace("postgres://", "postgresql://", 1)

# SQLite needs check_same_thread=False
connect_args = {"check_same_thread": False} if DATABASE_URL.startswith("sqlite") else {}

engine = create_engine(DATABASE_URL, echo=False, connect_args=connect_args)

def create_db():
    SQLModel.metadata.create_all(engine)