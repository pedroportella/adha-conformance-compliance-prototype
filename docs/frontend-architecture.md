# Frontend Architecture

The frontend is a pnpm workspace in the top-level `frontend` directory. Its internal architecture follows the same app/package split used by the rbdm prototype: runnable apps live under `apps`, shared capability lives under `packages`.

## Responsibilities

- Present the conformance register and assessment metrics.
- Capture vendor/provider submission metadata.
- Track readiness controls for accessibility, cyber security, analytics and integration.
- Submit evidence metadata to the Drupal API.
- Fall back to seeded prototype data when the Drupal runtime is not available.

## Key files

- `frontend/apps/portal/src/app/App.tsx`: main operational console.
- `frontend/packages/services/src/domain.ts`: domain types, seeded register data and default submission.
- `frontend/packages/services/src/readiness.ts`: small testable readiness helpers.
- `frontend/packages/services/src/ConformanceService.ts`: Drupal API client.
- `frontend/packages/ui-library/src/components`: reusable UI primitives used by the portal.
- `frontend/packages/ui-library/src/theme`: small ADHA refinements on top of Health Design System.
- `frontend/packages/ui-assets/src/index.ts`: prototype brand constants and future static assets.
- `frontend/packages/ui-tokens/src`: Health Design System colour and variable tokens.
- `frontend/packages/utils/src/index.ts`: shared formatting and class-name helpers.
- `frontend/apps/portal/src/styles/main.scss`: responsive ADHA-oriented application styling.

## Component contract

`frontend/packages/ui-library/src/components` follows the rbdm component packaging pattern. Each component family has its own PascalCase folder with the React component, local SCSS, unit test and barrel export:

- `*.tsx`: React wrapper that emits Health Design System markup and classes.
- `*.scss`: component-local styling hooks or ADHA refinements.
- `*.test.tsx`: smoke coverage for the public component API.
- `index.ts`: package-local export.

The `FormControls` folder groups the form-control family with internal `Button`, `Checkboxes`, `LabelMandatory`, `Radios`, `Select`, `Text` and `TextArea` components. These controls expose rbdm-style smart APIs for controlled values, option models, validation messaging and route-aware buttons while still rendering Health Design System markup/classes.

The `Layout` folder owns the page shell with `Footer.tsx`, `Header.tsx`, `Layout.tsx` and `Sidebar.tsx`. The `Template` folder owns page examples for `ContentPage`, `LandingPage`, `CampaignPage`, `ListingPage`, `FormPage` and `SearchPage`.

## Runtime shape

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

The frontend is deliberately operational rather than marketing-led: dense enough for assessment work, but still readable for non-technical stakeholders.
