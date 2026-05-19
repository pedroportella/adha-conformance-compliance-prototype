# Testing Strategy

## Overview

The test strategy provides repeatable checks for frontend behaviour, browser journeys, production build health, and backend dependency integrity.

## Current Coverage

- Vitest covers readiness logic in `frontend/packages/services/src/readiness.ts`.
- Component tests cover reusable UI package behaviour across the Health Design System-inspired component wrappers.
- Playwright verifies the portal loads and a submission can be captured into the register.
- The Vite build runs TypeScript checks for the portal and production bundle generation.
- GitHub Actions validates the frontend workspace, runs the Playwright smoke test and checks Drupal Composer metadata.

## Local Commands

Run from the repository root.

```bash
pnpm --dir frontend lint
pnpm --dir frontend test:unit
pnpm --dir frontend typecheck
pnpm --dir frontend build
pnpm --dir frontend test:e2e
docker compose run --rm php composer validate --no-check-publish
docker compose run --rm php composer audit
```

For checks against the Dockerised stack:

```bash
pnpm docker:up
pnpm drupal:composer
pnpm drupal:install
curl -i http://localhost:8080/api/conformance-submissions
pnpm --dir frontend test:e2e
```

## Production Hardening

- Drupal kernel tests for routes, validation, persistence and permissions.
- Evidence upload tests for allowed file types, size limits, private storage and cleanup.
- Accessibility automation for submission intake, assessor dashboard and Drupal admin journeys.
- API contract tests between the React console and Drupal.
- Security scanning, dependency review and container image checks in CI.
- Test data reset strategy for any environment that runs against a persistent Drupal database.
