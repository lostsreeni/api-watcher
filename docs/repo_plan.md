# Initial Repository Plan

## Overview
This document outlines the planned structure of the open-source API tracker repository.

## Repository Structure

The MVP for the API Tracker will be organized as a monorepo containing the following key components:

```text
api-tracker/
├── .github/                  # GitHub Actions for CI/CD, Issues, PR templates
├── backend/                  # API server, scheduler, and change detection logic
│   ├── src/                  # Application source code
│   ├── tests/                # Unit and integration tests
│   ├── requirements.txt      # Python dependencies (or equivalent for chosen stack)
│   └── Dockerfile            # Dockerfile for the backend service
├── frontend/                 # Web UI (React, Vue, or similar)
│   ├── public/               # Static assets
│   ├── src/                  # React/Vue components, pages, styles
│   ├── package.json          # Node dependencies
│   └── Dockerfile            # Dockerfile for the frontend service
├── docs/                     # Project documentation (PRD, Feature Scope, Data Flow)
├── docker-compose.yml        # Orchestrates the backend, frontend, database, and background workers
├── .env.example              # Example environment variables required for running the application
├── LICENSE                   # Open-source license (e.g., MIT, Apache 2.0)
└── README.md                 # Main entry point with setup and contribution instructions
```

## Tech Stack (Proposed MVP)

For Phase 0-2 (MVP), the focus is on a solid foundation and rapid development.

- **Backend:** Python (FastAPI or Django) or Node.js (Express/NestJS) for handling API requests, scheduling, and change detection logic. Python is strong for parsing and data comparison.
- **Frontend:** React or Vue.js for a clean, responsive dashboard. Tailwind CSS for rapid styling.
- **Database:** PostgreSQL for storing tracked sources, snapshots, and changelogs.
- **Scheduler/Worker:** Celery (Python) or Bull (Node.js) backed by Redis for managing background jobs (fetching snapshots).
- **Deployment:** Docker & Docker Compose for easy self-hosting.

## Modularization Strategy

To support future phases (Phase 3+), the architecture will be designed with modularity in mind:

- **Pluggable Source Fetchers:** Interfaces for adding support for new source types (e.g., GraphQL schemas, gRPC protobufs) beyond the MVP's OpenAPI and simple docs.
- **Change Detection Strategies:** Separate modules for parsing and comparing different formats. This allows for more sophisticated diffing algorithms to be added later.
- **Notification Providers:** An abstract notification interface with concrete implementations for Email, Slack, and future channels (e.g., MS Teams, Webhooks).
- **Authentication/Authorization:** While omitted from the MVP (single workspace), the API will be structured to easily introduce middleware for user authentication and multi-tenant support in Phase 3-5.
