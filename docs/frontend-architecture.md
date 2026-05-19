# Frontend Architecture

## Overview

The frontend is a React workspace that provides the conformance operations console and submission workflow.

It is responsible for presenting register data, collecting submission inputs, tracking readiness controls, managing evidence metadata, and submitting records to the Drupal backend.

## Delivered Capabilities

- Conformance register and assessment summary.
- Vendor/provider submission capture.
- Product and integration scope capture.
- Readiness controls for accessibility, cyber security, analytics, and integration requirements.
- Evidence metadata submission.
- REST API integration.
- Seeded local data fallback.
- Unit and browser-test coverage.

## Technology Stack

- React 18.
- TypeScript.
- Vite.
- Zustand.
- Sass.
- Vitest.
- Playwright.
- Health Design System CSS.

## Workspace Structure

The frontend uses a pnpm workspace in the top-level `frontend` directory.

```txt
frontend/apps/portal        Runnable React application
frontend/packages/services  Domain types, seeded data, readiness helpers, API client
frontend/packages/ui-assets Brand and media constants
frontend/packages/ui-library React component wrappers and theme entrypoint
frontend/packages/ui-tokens Health Design System colour and variable references
frontend/packages/utils     Shared framework-neutral helpers
```

## Application Responsibilities

The frontend manages the interactive assessor experience.

Responsibilities include:

- Rendering the conformance register and submission workflow.
- Managing local form and readiness state.
- Displaying validation and backend availability feedback.
- Preparing submission payloads.
- Calling backend APIs.
- Supporting automated browser testing.

## Key Files

- `frontend/apps/portal/src/app/App.tsx`: main operations console.
- `frontend/packages/services/src/domain.ts`: domain types, seeded register data, and default submission.
- `frontend/packages/services/src/readiness.ts`: testable readiness helpers.
- `frontend/packages/services/src/ConformanceService.ts`: Drupal API client.
- `frontend/packages/ui-library/src/components`: reusable UI primitives used by the portal.
- `frontend/packages/ui-library/src/theme`: ADHA refinements on top of Health Design System CSS.
- `frontend/packages/ui-assets/src/index.ts`: brand constants and static asset references.
- `frontend/packages/ui-tokens/src`: Health Design System colour and variable tokens.
- `frontend/packages/utils/src/index.ts`: shared formatting and class-name helpers.
- `frontend/apps/portal/src/styles/main.scss`: responsive application styling.

## Component Contract

`frontend/packages/ui-library/src/components` uses a consistent component packaging pattern. Each component family has its own PascalCase folder with the React component, local SCSS, unit test, and barrel export:

- `*.tsx`: React wrapper that emits Health Design System markup and classes.
- `*.scss`: component-local styling hooks or ADHA refinements.
- `*.test.tsx`: smoke coverage for the public component API.
- `index.ts`: package-local export.

The `FormControls` folder groups the form-control family with internal `Button`, `Checkboxes`, `LabelMandatory`, `Radios`, `Select`, `Text`, and `TextArea` components. These controls expose typed React APIs for controlled values, option models, validation messaging, and navigation-safe buttons while still rendering Health Design System markup and classes.

The `Layout` folder owns the page shell with `Footer.tsx`, `Header.tsx`, `Layout.tsx`, and `Sidebar.tsx`. The `Template` folder owns page examples for `ContentPage`, `LandingPage`, `CampaignPage`, `ListingPage`, `FormPage`, and `SearchPage`.

## API Integration

The frontend communicates with the Drupal backend through REST APIs.

Primary integration target:

```txt
http://localhost:8080/api/conformance-submissions
```

Submitted records can be reviewed in Drupal after authentication at:

```txt
http://localhost:8080/admin/adha-conformance
```

Local administrator credentials:

```txt
Username: admin
Password: admin
```

## Runtime Shape

- `frontend/apps/*` contains runnable applications.
- `frontend/packages/services` contains API and domain logic.
- `frontend/packages/ui-assets` contains brand and media constants.
- `frontend/apps/portal` imports `@health.gov.au/health-design-system/build/css/hds-all.css`.
- `frontend/packages/ui-library` contains React wrappers that render Health Design System component markup and a `theme` entrypoint for ADHA-specific adjustments.
- `frontend/packages/ui-tokens` contains Health Design System colour and variable tokens.
- `frontend/packages/utils` contains shared framework-neutral helpers.
- `backend` contains the Drupal application and custom module.
- `docs` contains delivery handover notes.
- `docker` contains local Nginx and PHP-FPM configuration.
- Repository root scripts delegate to `pnpm --dir frontend` for convenience.

## Testing Alignment

The frontend is covered by:

- Vitest for shared logic and component-level validation.
- Playwright for browser workflow coverage.
- TypeScript and Vite build checks for production bundle confidence.

The Playwright suite validates delivered user journeys and supports review of generated conformance data through the Drupal administration page.
