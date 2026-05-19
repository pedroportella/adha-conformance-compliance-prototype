# Architecture Overview

## Overview

The ADHA Conformance & Compliance Portal uses a decoupled architecture with a React frontend, Drupal backend, MariaDB database, Docker-based local runtime, and automated validation through unit and browser tests.

The architecture supports independent frontend and backend development while keeping integration points clear, testable, and suitable for GovCMS-oriented delivery planning.

## Delivered Capabilities

- Frontend conformance operations console.
- Backend conformance register API.
- Evidence upload capability.
- Database-backed persistence.
- Drupal administration visibility for submitted conformance records.
- Automated frontend, browser, Composer validation, and Composer audit coverage.
- GitHub Actions CI validation.

## Frontend Layer

The frontend is responsible for the assessor-facing application experience.

- React 18 application built with Vite and TypeScript.
- Conformance register, workflow state, and readiness metrics.
- Submission capture for vendor/provider and product details.
- Evidence metadata capture for accessibility, cyber security, analytics, and integration requirements.
- REST API communication with the backend.
- Seeded local data when the backend is unavailable.

## Backend Layer

The backend is responsible for data ownership, persistence, evidence handling, and administrative visibility.

- Drupal 10 application.
- PHP and Symfony component foundations.
- Custom `adha_conformance` module.
- REST endpoints for submission creation, retrieval, and evidence upload.
- Drupal admin page for submitted conformance records.

Submitted records can be reviewed by an authenticated Drupal administrator at:

```txt
http://localhost:8080/admin/adha-conformance
```

Local administrator credentials:

```txt
Username: admin
Password: admin
```

## Data Layer

MariaDB stores the conformance data managed by Drupal. The custom module owns the `adha_conformance_submission` table for submitted records.

The backend persists:

- Submission reference and identifier.
- Vendor/provider organisation details.
- Product or service details.
- Workflow status and risk level.
- Submitted timestamp.
- Full submission payload as JSON.

## Runtime Layer

Docker Compose provides the local runtime.

- Nginx routes HTTP traffic to Drupal.
- PHP-FPM executes the Drupal application.
- MariaDB provides the local database.
- The frontend service runs the React development server.

## Testing Layer

Automated testing validates the primary application behaviour and dependency health.

- Vitest validates shared frontend logic and reusable UI components.
- Playwright validates browser-based portal journeys.
- Composer validation confirms backend metadata.
- Composer audit checks locked backend dependencies.
- CI executes repeatable quality gates.

## Integration Boundaries

| Boundary | Responsibility |
| --- | --- |
| Frontend to Backend | REST API submission, retrieval, and evidence upload |
| Backend to Database | Drupal-managed persistence |
| Browser Tests to Frontend | User journey validation |
| Drupal Admin to Backend Data | Administrative review of submitted conformance records |

## Design Principles

- Clear separation between the user experience and backend persistence.
- API-driven integration between frontend and backend.
- Backend ownership of stored conformance data.
- Automated tests aligned to delivered user journeys.
- Documentation focused on handover, operation, and delivered capability.

## Production Evolution

- Reassess the custom table storage model against Drupal content entities or custom entities if the register requires granular permissions, workflow moderation, revisions, Views reporting, translations, or editorial ownership.
- Add authentication, CSRF/token strategy, and role-specific access control.
- Add private file storage, virus scanning, retention rules, and audit trails for evidence handling.
- Add analytics event instrumentation and reporting dashboards.
- Add Drupal kernel tests, coding standards, configuration import checks, and deployment smoke tests.
