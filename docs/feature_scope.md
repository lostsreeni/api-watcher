# Feature Scope

## Overview
This document outlines the scope of the minimum viable product (MVP) for Phase 0–2 of the open-source API tracker.

## MVP Scope (v1)

### Workspace Management
- Single workspace per instance.
- No user authentication or multi-tenant support for the MVP.

### Tracked Sources
- Users can add tracked sources by providing a URL.
- Supported Source Types:
    - **OpenAPI:** JSON or YAML files.
    - **Simple Docs:** Web pages (HTML text content).

### Snapshot Management
- **Fetching Mechanisms:**
    - Manual trigger (button click in the UI).
    - Scheduled fetching (e.g., cron jobs for daily/hourly checks).
- Store historical snapshots over time.

### Change Detection & Classification
- Compare the new snapshot against the previous version.
- **Classification Categories:**
    - **Added:** New functionality or fields.
    - **Modified:** Changes to existing functionality (non-breaking).
    - **Removed:** Removed endpoints or fields.
    - **Breaking:** Changes that alter existing behavior in a way that breaks clients (e.g., removing a required field or changing a response structure).

### Dashboard & UI
- A clean, simple dashboard to view:
    - List of tracked sources.
    - History of snapshots for each source.
    - Detailed changelogs showing added, modified, removed, and breaking changes.

### Alerts & Notifications
- Notify users when changes are detected, specifically breaking changes.
- **Alert Channels:**
    - Email notifications.
    - Slack notifications (via webhook).

### Deployment & Infrastructure
- Docker self-hosted installation to allow users to easily spin up the application on their own infrastructure.
- Uses lightweight components suitable for a standalone deployment.
