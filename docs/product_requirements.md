# Product Requirements Document (PRD)

## Product Goal
Build an open-source tool that tracks API specs, docs, or SDK sources, stores snapshots over time, detects changes, classifies breaking vs non-breaking updates, shows changelogs in a clean dashboard, and sends alerts.

## Target User (First User)
- **Primary:** Platform Engineers and Backend Teams who need to monitor upstream API changes or track their own API evolution.
- **Secondary:** Indie devs and startups who rely on external APIs and need to be alerted when breaking changes occur.

## MVP Scope (Phase 0)

### Supported Source Types (v1)
- OpenAPI specifications (JSON or YAML format).
- Simple documentation page URLs (HTML/text content).

### Change Classification
Changes between snapshots should be classified into the following categories:
- **Added:** New endpoints, fields, or text added.
- **Modified:** Existing fields or text changed (non-breaking).
- **Removed:** Endpoints, fields, or text removed.
- **Breaking:** Changes that would break existing clients (e.g., removing a required field, changing a field type, removing an endpoint).

### Alert Channels (MVP)
- Email
- Slack (via Webhook or App)

### Core Workflows
1. **Workspace:** A single workspace for managing tracked sources.
2. **Add Source:** Users can add a new tracked source by providing a URL.
3. **Snapshot Fetching:**
   - Manual triggers to fetch the latest snapshot.
   - Scheduled automatic fetching (e.g., daily, hourly).
4. **Comparison & Classification:** The system compares the newly fetched snapshot against the previous version and classifies the differences (added, modified, removed, breaking).
5. **Dashboard:** A clean UI displaying source history, snapshots, and detailed changelogs.
6. **Deployment:** Dockerized self-hosted installation for easy deployment.
