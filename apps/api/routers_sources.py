import os
import sys
from typing import List

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

# Add worker to sys.path to import celery app
sys.path.append(os.path.join(os.path.dirname(__file__), "..", "worker"))
from celery_app import fetch_source  # noqa: E402

import auth  # noqa: E402
import database  # noqa: E402
import models  # noqa: E402
import schemas  # noqa: E402

router = APIRouter(prefix="/api/sources", tags=["Sources"])


@router.get("/", response_model=List[schemas.SourceResponse])
def get_sources(
    db: Session = Depends(database.get_db),
    current_user: models.User = Depends(auth.get_current_user),
):
    sources = (
        db.query(models.Source).filter(models.Source.owner_id == current_user.id).all()
    )
    return sources


@router.post(
    "/",
    response_model=schemas.SourceResponse,
    status_code=status.HTTP_201_CREATED,
)
def create_source(
    source: schemas.SourceCreate,
    db: Session = Depends(database.get_db),
    current_user: models.User = Depends(auth.get_current_user),
):
    # Basic URL validation (since we use str in schema)
    if not source.url.startswith("http://") and not source.url.startswith("https://"):
        raise HTTPException(
            status_code=400, detail="URL must start with http:// or https://"
        )

    db_source = models.Source(**source.dict(), owner_id=current_user.id)
    db.add(db_source)
    db.commit()
    db.refresh(db_source)
    return db_source


@router.get("/{source_id}", response_model=schemas.SourceResponse)
def get_source(
    source_id: int,
    db: Session = Depends(database.get_db),
    current_user: models.User = Depends(auth.get_current_user),
):
    source = (
        db.query(models.Source)
        .filter(
            models.Source.id == source_id,
            models.Source.owner_id == current_user.id,
        )
        .first()
    )
    if source is None:
        raise HTTPException(status_code=404, detail="Source not found")
    return source


@router.put("/{source_id}", response_model=schemas.SourceResponse)
def update_source(
    source_id: int,
    source_update: schemas.SourceUpdate,
    db: Session = Depends(database.get_db),
    current_user: models.User = Depends(auth.get_current_user),
):
    db_source = (
        db.query(models.Source)
        .filter(
            models.Source.id == source_id,
            models.Source.owner_id == current_user.id,
        )
        .first()
    )
    if db_source is None:
        raise HTTPException(status_code=404, detail="Source not found")

    update_data = source_update.dict(exclude_unset=True)
    if "url" in update_data and not (
        update_data["url"].startswith("http://")
        or update_data["url"].startswith("https://")
    ):
        raise HTTPException(
            status_code=400, detail="URL must start with http:// or https://"
        )

    for key, value in update_data.items():
        setattr(db_source, key, value)

    db.commit()
    db.refresh(db_source)
    return db_source


@router.delete("/{source_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_source(
    source_id: int,
    db: Session = Depends(database.get_db),
    current_user: models.User = Depends(auth.get_current_user),
):
    db_source = (
        db.query(models.Source)
        .filter(
            models.Source.id == source_id,
            models.Source.owner_id == current_user.id,
        )
        .first()
    )
    if db_source is None:
        raise HTTPException(status_code=404, detail="Source not found")

    db.delete(db_source)
    db.commit()
    return None


@router.post("/{source_id}/fetch", status_code=status.HTTP_202_ACCEPTED)
def fetch_source_manual(
    source_id: int,
    db: Session = Depends(database.get_db),
    current_user: models.User = Depends(auth.get_current_user),
):
    db_source = (
        db.query(models.Source)
        .filter(
            models.Source.id == source_id,
            models.Source.owner_id == current_user.id,
        )
        .first()
    )
    if db_source is None:
        raise HTTPException(status_code=404, detail="Source not found")

    fetch_source.delay(source_id)
    return {"message": "Fetch job enqueued"}
