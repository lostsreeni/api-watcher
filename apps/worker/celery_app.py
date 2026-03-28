import os
import sys

# To allow importing modules from apps/api
sys.path.append(os.path.join(os.path.dirname(__file__), "..", "api"))

import hashlib  # noqa: E402
import json  # noqa: E402
from datetime import datetime  # noqa: E402

import requests  # noqa: E402
from celery import Celery  # noqa: E402
from database import SessionLocal  # noqa: E402
from models import (  # noqa: E402
    FetchLog,
    Snapshot,
    Source,
    SourceStatus,
    SourceType,
    Changelog,
)
from normalizer import normalize_docs, normalize_openapi  # noqa: E402
from diff_engine import generate_diff, generate_changelog_summary  # noqa: E402

redis_url = os.getenv("REDIS_URL", "redis://localhost:6379/0")

app = Celery("worker", broker=redis_url, backend=redis_url)


def send_alerts(source: Source, changelog: Changelog):
    if source.alert_email:
        print(
            f"MOCK EMAIL: Sending alert to {source.alert_email} for source '{source.name}'. "
            f"Severity: {changelog.severity}. Summary: {changelog.changelog_summary}"
        )

    if source.alert_slack_webhook:
        try:
            payload = {
                "text": f"*{source.name}* update detected!\n"
                f"*Severity*: {changelog.severity}\n"
                f"*Summary*:\n{changelog.changelog_summary}"
            }
            requests.post(source.alert_slack_webhook, json=payload, timeout=10)
        except Exception as e:
            print(f"Failed to send Slack alert: {e}")


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
                db.commit()  # Commit to get snapshot ID
                db.refresh(snapshot)

                if latest_snapshot:
                    changes = generate_diff(
                        source.type.value,
                        latest_snapshot.parsed_content,
                        snapshot.parsed_content,
                    )
                    if changes:
                        severity = "modified"
                        # Determine overall severity
                        for c in changes:
                            c_sev = c.get("severity", "modified")
                            if c_sev == "breaking":
                                severity = "breaking"
                                break
                            elif c_sev == "added" and severity != "breaking":
                                severity = "added"
                            elif c_sev == "modified" and severity not in [
                                "breaking",
                                "added",
                            ]:
                                severity = "modified"
                            elif c_sev == "informational" and severity not in [
                                "breaking",
                                "added",
                                "modified",
                            ]:
                                severity = "informational"

                        summary = generate_changelog_summary(changes)

                        changelog = Changelog(
                            source_id=source_id,
                            old_snapshot_id=latest_snapshot.id,
                            new_snapshot_id=snapshot.id,
                            changes=json.dumps(changes),
                            severity=severity,
                            changelog_summary=summary,
                        )
                        db.add(changelog)
                        send_alerts(source, changelog)
                else:
                    # First snapshot
                    changelog = Changelog(
                        source_id=source_id,
                        old_snapshot_id=None,
                        new_snapshot_id=snapshot.id,
                        changes=json.dumps(
                            [
                                {
                                    "type": "initial_fetch",
                                    "details": "Initial source fetch",
                                    "severity": "informational",
                                }
                            ]
                        ),
                        severity="informational",
                        changelog_summary="Initial fetch of the source.",
                    )
                    db.add(changelog)

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
