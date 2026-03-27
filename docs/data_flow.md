# Data Flow Definition

## High-Level Architecture
This document details the movement of data through the API Tracker MVP.

### Components
1. **API / Web UI:** A frontend to manage sources and view changes.
2. **Scheduler / Worker:** A background process (e.g., Celery, Node-cron) responsible for fetching snapshots at scheduled intervals or on demand.
3. **Storage / Database:** A database (e.g., PostgreSQL) to store tracked sources, snapshot history, and change logs.
4. **Change Detection Engine:** A service that compares two snapshots and outputs the differences categorized by type (added, modified, removed, breaking).
5. **Notification Engine:** A service that listens for changes (specifically breaking ones) and sends alerts to configured channels (Email, Slack).

### Data Flow

#### 1. Adding a Source
- **Input:** User submits a URL via the UI (e.g., `https://api.example.com/openapi.json`).
- **Processing:** The API validates the URL and stores the source configuration (URL, frequency, format) in the Database.
- **Output:** The new source is added to the Dashboard and scheduled for its first fetch.

#### 2. Fetching a Snapshot (Scheduled or Manual)
- **Input:** The Scheduler triggers a job for a specific source, or a user clicks "Fetch Now" in the UI.
- **Processing:**
  - The Worker makes an HTTP GET request to the source URL.
  - The response body is parsed based on its format (JSON/YAML for OpenAPI, HTML for Docs).
  - The raw snapshot data is stored in the Database with a timestamp.
- **Output:** A new snapshot record in the database.

#### 3. Change Detection & Classification
- **Input:** The newly fetched snapshot and the immediate previous snapshot for the same source.
- **Processing:**
  - The Change Detection Engine compares the two snapshots.
  - For OpenAPI, it parses the spec and identifies added/modified/removed endpoints, parameters, and responses. It applies rules to determine breaking changes (e.g., a required parameter was added to an existing endpoint).
  - For Simple Docs, it performs a diff on the extracted text.
  - The resulting list of changes is categorized (Added, Modified, Removed, Breaking).
- **Output:** A changelog record is created in the Database, linked to the two snapshots.

#### 4. Displaying the Dashboard
- **Input:** User visits the Dashboard.
- **Processing:** The API queries the Database for the latest status of all tracked sources, their snapshot history, and recent changelogs.
- **Output:** The UI renders the source history, highlighting any breaking changes or recent updates.

#### 5. Alerting
- **Input:** The Change Detection Engine identifies a new changelog that contains changes (especially breaking changes).
- **Processing:**
  - The Notification Engine checks the alert configuration for the workspace/source.
  - If Slack is configured, it constructs a payload and sends it to the configured webhook URL.
  - If Email is configured, it constructs an email template and sends it via an SMTP server.
- **Output:** The user receives a notification about the changes.
