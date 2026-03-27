# API Tracker

An open-source tool that tracks API specs, docs, or SDK sources, stores snapshots over time, detects changes, classifies breaking vs non-breaking updates, shows changelogs in a clean dashboard, and sends alerts.

## Phase 0: Product Definition and Scope

The MVP (v1) focuses on providing a single workspace to track OpenAPI specifications and simple documentation pages, detect changes, classify them (added, modified, removed, breaking), display a changelog dashboard, and send email or Slack alerts.

### Documentation

- [Product Requirements Document (PRD)](docs/product_requirements.md)
- [Feature Scope](docs/feature_scope.md)
- [Data Flow Definition](docs/data_flow.md)
- [Initial Repository Plan](docs/repo_plan.md)

## Deployment

The MVP is designed for a Dockerized self-hosted installation. More details to follow in subsequent phases.

## Repository Structure

The project uses a monorepo structure:
```text
api-change-tracker/
  apps/
    web/         # Next.js frontend
    api/         # FastAPI backend
    worker/      # Celery jobs
  packages/
    shared/      # shared schemas/types/docs if needed
  infra/
    docker/
  docs/
  .github/
```

## Local Development

To run the project locally, ensure you have Docker and Docker Compose installed.

1. Create a `.env` file from the example:
   ```bash
   cp .env.example .env
   ```

2. Start the services using Docker Compose:
   ```bash
   docker-compose up --build
   ```

This single setup flow spins up the FastAPI backend, Celery worker, Redis, and Next.js frontend. The frontend is accessible at `http://localhost:3000` and the API at `http://localhost:8000`.

## CI & Pre-commit Hooks

This repository uses [pre-commit](https://pre-commit.com/) to maintain code quality.
To install the hooks, run:
```bash
pip install pre-commit
pre-commit install
```
