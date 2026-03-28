import os
import sys

# To allow importing modules from apps/api
sys.path.append(os.path.join(os.path.dirname(__file__), "..", "api"))

import hashlib  # noqa: E402
from datetime import datetime  # noqa: E402

import requests  # noqa: E402
from celery import Celery  # noqa: E402
from database import SessionLocal  # noqa: E402
from models import FetchLog, Snapshot, Source, SourceStatus, SourceType  # noqa: E402
from normalizer import normalize_docs, normalize_openapi  # noqa: E402

redis_url = os.getenv("REDIS_URL", "redis://localhost:6379/0")

app = Celery("worker", broker=redis_url, backend=redis_url)


@app.task(bind=True, max_retries=3, default_retry_delay=60)
def fetch_source(self, source_id: int):
    db = SessionLocal()
    try:
        source = db.query(Source).filter(Source.id == source_id).first()
        if not source:
            return "Source not found"

        source.status = SourceStatus.syncing
        db.commit()

        try:
            response = requests.get(source.url, timeout=30)
            response.raise_for_status()
            raw_content = response.text

            if source.type == SourceType.openapi:
                parsed_content = normalize_openapi(raw_content)
            elif source.type == SourceType.docs:
                parsed_content = normalize_docs(raw_content)
            else:
                parsed_content = "{}"

            # Hash the parsed content
            content_hash = hashlib.sha256(parsed_content.encode("utf-8")).hexdigest()

            # Check if previous snapshot has the same hash
            latest_snapshot = (
                db.query(Snapshot)
                .filter(Snapshot.source_id == source_id)
                .order_by(Snapshot.created_at.desc())
                .first()
            )

            if latest_snapshot and latest_snapshot.hash == content_hash:
                # No change
                log = FetchLog(
                    source_id=source_id,
                    status="success",
                    error_message="No changes detected",
                )
            else:
                # Changes detected
                snapshot = Snapshot(
                    source_id=source_id,
                    hash=content_hash,
                    raw_content=raw_content,
                    parsed_content=parsed_content,
                )
                db.add(snapshot)

                log = FetchLog(source_id=source_id, status="success")
                source.last_change_detected_at = datetime.utcnow()

            source.last_checked_at = datetime.utcnow()
            source.status = SourceStatus.active
            db.add(log)
            db.commit()

            return "Fetch success"

        except Exception as e:
            db.rollback()
            log = FetchLog(source_id=source_id, status="error", error_message=str(e))
            source.status = SourceStatus.error
            source.last_checked_at = datetime.utcnow()
            db.add(log)
            db.commit()

            # Retry
            raise self.retry(exc=e)

    finally:
        db.close()
