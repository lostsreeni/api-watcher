from typing import List
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import desc

import database
import models
import schemas
import auth

router = APIRouter(prefix="/api/system", tags=["System"])


@router.get("/logs", response_model=List[schemas.FetchLogResponse])
def get_system_logs(
    db: Session = Depends(database.get_db),
    current_user: models.User = Depends(auth.get_current_user),
):
    # Fetch logs for the current user's sources
    logs = (
        db.query(models.FetchLog)
        .join(models.Source)
        .filter(models.Source.owner_id == current_user.id)
        .order_by(desc(models.FetchLog.created_at))
        .limit(100)
        .all()
    )
    return logs
