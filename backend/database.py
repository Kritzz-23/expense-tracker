import os
import time
from urllib.parse import urlparse

from sqlmodel import SQLModel, create_engine
from sqlalchemy.exc import OperationalError

# Read DATABASE_URL from environment (Render injects this for Postgres)
DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///finance.db")

# SQLAlchemy requires postgresql:// instead of postgres:// 
if DATABASE_URL.startswith("postgres://"):
    DATABASE_URL = DATABASE_URL.replace("postgres://", "postgresql://", 1)

# SQLite needs check_same_thread=False
connect_args = {"check_same_thread": False} if DATABASE_URL.startswith("sqlite") else {}

engine = create_engine(DATABASE_URL, echo=False, connect_args=connect_args, pool_pre_ping=True)

def _database_host_label() -> str:
    parsed_url = urlparse(DATABASE_URL)
    return parsed_url.hostname or "local sqlite database"


def create_db(max_attempts: int = 5, retry_delay: int = 5):
    for attempt in range(1, max_attempts + 1):
        try:
            SQLModel.metadata.create_all(engine)
            return
        except OperationalError:
            if attempt == max_attempts:
                raise
            print(
                f"Database host {_database_host_label()} is not ready yet. "
                f"Retrying startup in {retry_delay}s ({attempt}/{max_attempts})..."
            )
            time.sleep(retry_delay)
