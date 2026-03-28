from datetime import datetime
from typing import Optional
from pydantic import BaseModel, EmailStr, Field
from models import SourceType, SourceStatus


class UserCreate(BaseModel):
    email: EmailStr
    password: str


class UserResponse(BaseModel):
    id: int
    email: EmailStr

    class Config:
        from_attributes = True


class SnapshotResponse(BaseModel):
    id: int
    source_id: int
    hash: str
    created_at: datetime

    class Config:
        from_attributes = True


class FetchLogResponse(BaseModel):
    id: int
    source_id: int
    status: str
    error_message: Optional[str] = None
    created_at: datetime

    class Config:
        from_attributes = True


class Token(BaseModel):
    access_token: str
    token_type: str
    user: UserResponse


class SourceBase(BaseModel):
    name: str = Field(..., min_length=1, max_length=100)
    type: SourceType
    url: str  # String due to HttpUrl issues
    polling_frequency: int = Field(default=60, ge=1)  # 1 minute minimum


class SourceCreate(SourceBase):
    pass


class SourceUpdate(BaseModel):
    name: Optional[str] = Field(None, min_length=1, max_length=100)
    type: Optional[SourceType] = None
    url: Optional[str] = None
    polling_frequency: Optional[int] = Field(None, ge=1)
    status: Optional[SourceStatus] = None


class SourceResponse(SourceBase):
    id: int
    status: SourceStatus
    last_checked_at: Optional[datetime] = None
    last_change_detected_at: Optional[datetime] = None
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True
