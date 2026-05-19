# ADHA Conformance & Compliance Portal Prototype

React + Drupal 10/GovCMS-oriented prototype for the Australian Digital Health Agency Senior Drupal Developer role.

## What it demonstrates

- Vendor/provider conformance submission intake for regulated digital health integrations.
- Evidence upload model for accessibility, cyber security, analytics and integration artefacts.
- Workflow triage across submitted, assessment, action-required and approval-ready states.
- Drupal custom module pattern with routes, services, schema install hooks, file handling and admin visibility.
- React + TypeScript operational console built with Vite, Vitest and Playwright.
- GovCMS delivery thinking: WCAG 2.1 AA, configuration discipline, analytics readiness, documentation and supportability.

## Prototype domain

The prototype is intentionally aligned to ADHA's Conformance Compliance context. It models how software vendors or provider organisations could submit evidence for My Health Record, electronic prescribing, Healthcare Identifiers or secure messaging integrations, while Agency staff monitor risk, missing evidence and assessment readiness.

## Architecture

- `frontend`: pnpm workspace with React apps and reusable frontend packages.
- `backend`: Drupal 10 scaffold with custom `adha_conformance` module.
- `docs`: Architecture, backend, frontend, testing and CI/CD handover notes.
- `docker`: Nginx and PHP-FPM runtime configuration.

Inside `frontend`:

- `apps/portal`: React 18, TypeScript, Vite, Sass, Vitest and Playwright.
- `packages/services`: conformance domain types, API client, seeded data and readiness logic.
- `packages/ui-assets`: ADHA prototype brand constants and future static assets.
- `packages/ui-library`: reusable React wrappers for Health Design System component markup and a theme entrypoint.
- `packages/ui-tokens`: Health Design System colour and variable token layer.
- `packages/utils`: shared formatting and class-name helpers.

## Local access

| Area | URL | Notes |
| --- | --- | --- |
| Frontend | `http://localhost:5173` | React conformance operations console |
| Drupal API | `http://localhost:8080/api/conformance-submissions` | Conformance register endpoint |
| Evidence API | `http://localhost:8080/api/conformance-submissions/evidence` | Prototype evidence upload endpoint |
| Drupal admin | `http://localhost:8080/user/login` | Login with `admin` / `admin` after local install |
| Admin register | `http://localhost:8080/admin/adha-conformance` | Authenticated Drupal admin register |
| MariaDB | `localhost:3307` | Local database exposed from Docker |

## Local frontend development

```bash
corepack enable
corepack prepare pnpm@10.18.3 --activate
pnpm install
pnpm --dir frontend dev
```

Useful checks:

```bash
pnpm --dir frontend lint
pnpm --dir frontend test:unit
pnpm --dir frontend build
pnpm --dir frontend test:e2e
```

## Drupal setup

Run from the repository root after Docker Desktop is available.

```bash
docker compose up -d mariadb php nginx frontend
docker compose run --rm php composer install
docker compose exec php vendor/bin/drush site:install minimal \
  --site-name="ADHA Conformance Prototype" \
  --account-name=admin \
  --account-pass=admin \
  -y
docker compose exec php vendor/bin/drush pm:enable adha_conformance -y
docker compose exec php vendor/bin/drush updatedb -y
docker compose exec php vendor/bin/drush cache:rebuild
```

## Interview pitch

"I prepared an ADHA-aligned Drupal and React prototype focused on conformance and compliance operations. Drupal acts as the GovCMS-style system of record for submissions, evidence files and admin visibility. The React console gives assessors a fast operational view across risk, workflow state, accessibility, cyber, analytics and integration readiness. The implementation demonstrates custom Drupal routes, services, schema, file handling, REST integration, WCAG-aware UI, automated tests and delivery documentation."
