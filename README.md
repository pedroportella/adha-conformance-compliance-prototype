# ADHA Conformance & Compliance Portal

## Overview

This repository contains a full-stack conformance and compliance portal for Australian Digital Health Agency-style vendor and provider submissions.

The application supports conformance submission intake, evidence capture, assessment triage, backend persistence, Drupal administration visibility, automated testing, and CI validation.

The solution is implemented as a decoupled React frontend and Drupal backend, with Docker providing a consistent local runtime for the frontend, Nginx, PHP-FPM, and MariaDB services.

## Delivered Capabilities

### Frontend

- React 18 application built with Vite and TypeScript.
- Conformance operations console for assessors and delivery stakeholders.
- Submission capture for vendor/provider details, product details, integration scope, evidence, readiness controls, and workflow state.
- Readiness tracking for accessibility, cyber security, analytics, and integration requirements.
- REST API integration with the Drupal backend.
- Seeded fallback data when the backend is unavailable.
- Vitest and Playwright-ready validation coverage.

### Backend

- Drupal 10 application using PHP and Symfony components.
- Custom `adha_conformance` module.
- REST endpoints for conformance submission creation, retrieval, and evidence upload.
- MariaDB-backed persistence for submitted register data.
- Drupal administration page for reviewing submitted conformance records.
- Composer-managed backend dependencies and Drush-based local installation.

### Test Automation

- Vitest coverage for shared readiness logic and reusable UI components.
- Playwright smoke coverage for the portal journey.
- TypeScript, linting, production build, Composer validation, and Composer audit checks.

### CI/CD

- GitHub Actions workflow for repeatable validation.
- Frontend lint, unit test, typecheck, build, and browser smoke-test jobs.
- Backend Composer metadata validation and dependency audit.

## Technology Summary

- Frontend: React 18, Vite, TypeScript, Sass, Zustand.
- Backend: Drupal 10, PHP 8.3, Symfony components, Composer, Drush.
- Database: MariaDB.
- Runtime: Docker, Docker Compose, Nginx, PHP-FPM.
- Testing: Vitest and Playwright.
- CI/CD: GitHub Actions.

## Runtime Requirements

- Docker Desktop, Docker, and Docker Compose for the complete local stack.
- Node.js 20.19+ for CI parity. The repo includes `.nvmrc` set to Node 22.12.0.
- pnpm 10.18.3, managed through Corepack and the `packageManager` fields.
- Playwright Chromium dependencies for local browser tests.
- Composer is optional on the host when using Docker; the PHP container runs Composer for backend commands.

## Repository Structure

```txt
frontend/   React application, shared packages, frontend tests, Playwright configuration
backend/    Drupal application, custom module, Composer dependencies
docker/     Local infrastructure configuration for Nginx and PHP-FPM
docs/       Architecture, backend, frontend, testing, design-system, and CI/CD handover notes
```

## Quick Start With Docker

Run from the repository root.

```bash
corepack enable
corepack prepare pnpm@10.18.3 --activate

# Build images and start the backend, database, Nginx, and frontend containers.
pnpm docker:build
pnpm docker:up

# Install Drupal/PHP dependencies inside the PHP container.
pnpm drupal:composer

# Install Drupal, enable the custom ADHA module, and rebuild caches.
pnpm drupal:install
```

The stack starts both application surfaces:

- Frontend: `http://localhost:5173`
- Drupal backend: `http://localhost:8080`

Useful Docker commands:

```bash
pnpm docker:logs
pnpm docker:down
pnpm docker:reset
```

## Local Access

| Area | URL | Notes |
| --- | --- | --- |
| Frontend | `http://localhost:5173` | React conformance operations console |
| Drupal backend | `http://localhost:8080` | Nginx/PHP-FPM Drupal runtime |
| Drupal API | `http://localhost:8080/api/conformance-submissions` | Conformance register endpoint |
| Evidence API | `http://localhost:8080/api/conformance-submissions/evidence` | Evidence upload endpoint |
| Drupal admin | `http://localhost:8080/user/login` | Login with `admin` / `admin` after local install |
| Admin register | `http://localhost:8080/admin/adha-conformance` | Authenticated Drupal admin register |
| MariaDB | `localhost:3307` | Local database exposed from Docker |

Submitted conformance records can be reviewed in Drupal at:

```txt
http://localhost:8080/admin/adha-conformance
```

Local Drupal administrator credentials:

```txt
Username: admin
Password: admin
```

## Frontend-Only Development

Use this path when iterating on the React workspace without the Drupal stack.

```bash
corepack enable
corepack prepare pnpm@10.18.3 --activate
pnpm --dir frontend install
pnpm --dir frontend dev
```

The frontend falls back to seeded local data when the backend is unavailable.

Useful frontend checks:

```bash
pnpm --dir frontend lint
pnpm --dir frontend test:unit
pnpm --dir frontend typecheck
pnpm --dir frontend build
pnpm --dir frontend exec playwright install chromium
pnpm --dir frontend test:e2e
```

## Full Local Verification

Run these commands from the repository root for a clean local verification.

```bash
# Reset containers, networks, and the local database volume.
pnpm docker:reset

# Build local Docker images and start the complete stack.
pnpm docker:build
pnpm docker:up

# Confirm container status.
docker compose ps

# Install backend dependencies and Drupal.
pnpm drupal:composer
pnpm drupal:install

# Confirm MariaDB connectivity from the PHP container.
docker compose exec php php -r '
new PDO("mysql:host=mariadb;dbname=adha_conformance", "adha_conformance", "adha_conformance");
echo "DB OK\n";
'

# Check the conformance API.
curl -i http://localhost:8080/api/conformance-submissions

# Confirm the frontend responds.
curl -i http://localhost:5173

# Install frontend dependencies for local quality checks.
pnpm --dir frontend install
pnpm --dir frontend exec playwright install chromium

# Run frontend validation.
pnpm --dir frontend lint
pnpm --dir frontend test:unit
pnpm --dir frontend typecheck
pnpm --dir frontend build
pnpm --dir frontend test:e2e
```

## Daily Development Commands

Run from the repository root.

```bash
# Start the local stack in the background.
pnpm docker:up

# Confirm container status.
docker compose ps

# View service logs.
pnpm docker:logs

# Rebuild Drupal cache.
docker compose exec php vendor/bin/drush updatedb -y
docker compose exec php vendor/bin/drush cache:rebuild

# Check the conformance API.
curl -i http://localhost:8080/api/conformance-submissions

# Run frontend checks.
pnpm --dir frontend lint
pnpm --dir frontend test:unit
pnpm --dir frontend typecheck
pnpm --dir frontend build
pnpm --dir frontend test:e2e
```

## Configuration

The frontend reads one public environment variable:

| Variable | Default | Description |
| --- | --- | --- |
| `VITE_API_BASE_URL` | `/api` | API base URL used by the frontend service client. Docker sets this to `http://localhost:8080/api`. |

Docker database settings are configured in `docker-compose.yml`:

| Variable | Value |
| --- | --- |
| `DRUPAL_DB_HOST` | `mariadb` |
| `DRUPAL_DB_NAME` | `adha_conformance` |
| `DRUPAL_DB_USER` | `adha_conformance` |
| `DRUPAL_DB_PASSWORD` | `adha_conformance` |

## CI / GitHub Actions

`.github/workflows/ci.yml` runs on pushes to `main`, pull requests to `main`, and manual dispatch.

The frontend verification job uses Node.js 20.19.0 and Corepack-managed `pnpm@10.18.3`, then runs:

- `pnpm install --frozen-lockfile`
- `pnpm lint`
- `pnpm test:unit`
- `pnpm typecheck`
- `pnpm build`

The Playwright job installs Chromium dependencies, runs `pnpm test:e2e`, and uploads the Playwright report artifact.

The backend validation job installs PHP 8.3 and Composer, then runs:

- `composer validate --no-check-publish`
- `composer audit`

## Documentation

- `docs/architecture-overview.md`: system structure and production evolution.
- `docs/backend-architecture.md`: Drupal module, routes, storage, and operational commands.
- `docs/frontend-architecture.md`: React workspace, services, UI packages, and runtime structure.
- `docs/testing-strategy.md`: local and CI testing coverage.
- `docs/ci-cd.md`: pipeline design and production gate recommendations.
- `docs/health-design-system.md`: Health Design System usage notes.
