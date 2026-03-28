import datetime
from sqlalchemy import Column, Integer, String, DateTime, Enum, ForeignKey
from sqlalchemy.orm import relationship
from database import Base
import enum


class SourceType(str, enum.Enum):
    openapi = "openapi"
    docs = "docs"
    sdk = "sdk"


class SourceStatus(str, enum.Enum):
    active = "active"
    paused = "paused"
    error = "error"
    syncing = "syncing"


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)

    sources = relationship(
        "Source",
        back_populates="owner",
        cascade="all, delete-orphan",
    )


class Source(Base):
    __tablename__ = "sources"

    id = Column(Integer, primary_key=True, index=True)
    owner_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    name = Column(String, nullable=False)
    type = Column(Enum(SourceType), nullable=False)
    url = Column(String, nullable=False)
    polling_frequency = Column(Integer, default=60)  # minutes
    status = Column(Enum(SourceStatus), default=SourceStatus.active)

    last_checked_at = Column(DateTime(timezone=True), nullable=True)
    last_change_detected_at = Column(DateTime(timezone=True), nullable=True)

    created_at = Column(DateTime(timezone=True), default=datetime.datetime.utcnow)
    updated_at = Column(
        DateTime(timezone=True),
        default=datetime.datetime.utcnow,
        onupdate=datetime.datetime.utcnow,
    )

    owner = relationship("User", back_populates="sources")
    snapshots = relationship(
        "Snapshot", back_populates="source", cascade="all, delete-orphan"
    )
    fetch_logs = relationship(
        "FetchLog", back_populates="source", cascade="all, delete-orphan"
    )


class Snapshot(Base):
    __tablename__ = "snapshots"

    id = Column(Integer, primary_key=True, index=True)
    source_id = Column(Integer, ForeignKey("sources.id"), nullable=False)

    hash = Column(String, index=True, nullable=False)  # To avoid duplicate storage
    raw_content = Column(
        String, nullable=False
    )  # The raw fetched content (JSON/YAML/HTML)
    parsed_content = Column(String, nullable=False)  # Normalized content (JSON string)

    created_at = Column(DateTime(timezone=True), default=datetime.datetime.utcnow)

    source = relationship("Source", back_populates="snapshots")


class FetchLog(Base):
    __tablename__ = "fetch_logs"

    id = Column(Integer, primary_key=True, index=True)
    source_id = Column(Integer, ForeignKey("sources.id"), nullable=False)

    status = Column(String, nullable=False)  # "success", "error"
    error_message = Column(String, nullable=True)

    created_at = Column(DateTime(timezone=True), default=datetime.datetime.utcnow)

    source = relationship("Source", back_populates="fetch_logs")
