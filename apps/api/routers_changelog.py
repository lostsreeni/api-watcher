from typing import List

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

import auth
import database
import models
import schemas

router = APIRouter(prefix="/api/sources/{source_id}", tags=["Changelogs"])


@router.get("/changelogs", response_model=List[schemas.ChangelogResponse])
def get_changelogs(
    source_id: int,
    db: Session = Depends(database.get_db),
    current_user: models.User = Depends(auth.get_current_user),
):
    source = (
        db.query(models.Source)
        .filter(models.Source.id == source_id, models.Source.owner_id == current_user.id)
        .first()
    )
    if not source:
        raise HTTPException(status_code=404, detail="Source not found")

    changelogs = (
        db.query(models.Changelog)
        .filter(models.Changelog.source_id == source_id)
        .order_by(models.Changelog.created_at.desc())
        .all()
    )
    return changelogs


changelog_router = APIRouter(prefix="/api/changelogs", tags=["Changelogs"])


@changelog_router.get("/{changelog_id}", response_model=schemas.ChangelogResponse)
def get_changelog(
    changelog_id: int,
    db: Session = Depends(database.get_db),
    current_user: models.User = Depends(auth.get_current_user),
):
    changelog = (
        db.query(models.Changelog)
        .join(models.Source)
        .filter(
            models.Changelog.id == changelog_id,
            models.Source.owner_id == current_user.id,
        )
        .first()
    )
    if not changelog:
        raise HTTPException(status_code=404, detail="Changelog not found")

    return changelog
