import os
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base

# SQLite DB for simplicity and MVP phase, can be swapped for Postgres
DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./api_tracker.db")

engine = create_engine(
    DATABASE_URL,
    connect_args=(
        {"check_same_thread": False}
        if DATABASE_URL.startswith("sqlite")
        else {}
    ),
)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
