# CI/CD

## Overview

The repository includes a GitHub Actions workflow at `.github/workflows/ci.yml` for repeatable frontend, browser, and backend dependency validation.

## GitHub Actions workflow

The workflow runs on pushes to `main`, pull requests to `main`, and manual dispatch.

## Delivered Capability

- Frontend dependency installation with frozen lockfile enforcement.
- Frontend linting, unit testing, typechecking, and production build validation.
- Playwright browser smoke testing.
- Build and Playwright report artifact upload.
- Backend Composer metadata validation.
- Backend Composer dependency audit.

## Frontend Verification

Runs in the `frontend` workspace with Node.js 20.19.0 and Corepack-managed `pnpm@10.18.3`.

```bash
pnpm install --frozen-lockfile
pnpm lint
pnpm test:unit
pnpm typecheck
pnpm build
```

The job uploads the portal build from `frontend/apps/portal/dist`.

## Browser Verification

Runs after the frontend verification job on `ubuntu-22.04`.

```bash
pnpm install --frozen-lockfile
pnpm exec playwright install --with-deps chromium
pnpm test:e2e
```

The job uploads `frontend/apps/portal/playwright-report` when available.

## Backend Validation

Runs with PHP 8.3 and Composer v2.

```bash
composer validate --no-check-publish
composer audit
```

This confirms the Drupal project metadata and locked dependency set without requiring a database-backed Drupal install in CI.

## Local Parity Checks

Run these from the repository root before handing over a change.

```bash
pnpm --dir frontend install
pnpm --dir frontend lint
pnpm --dir frontend test:unit
pnpm --dir frontend typecheck
pnpm --dir frontend build
pnpm --dir frontend exec playwright install chromium
pnpm --dir frontend test:e2e
docker compose run --rm php composer validate --no-check-publish
docker compose run --rm php composer audit
```

For an end-to-end local stack check:

```bash
pnpm docker:build
pnpm docker:up
pnpm drupal:composer
pnpm drupal:install
curl -i http://localhost:8080/api/conformance-submissions
curl -i http://localhost:5173
```

## Production Gates To Add

- Composer install with caching and Drupal coding standards.
- Drupal cache rebuild, update hook checks and configuration import validation.
- PHP static analysis and Drupal kernel tests for routes, persistence, permissions and uploads.
- API contract tests between the React console and Drupal routes.
- Accessibility checks for public and authenticated admin journeys.
- Dependency, container image, secret and licence scanning.
- Deployment smoke tests for the register API, evidence upload endpoint and admin register.
