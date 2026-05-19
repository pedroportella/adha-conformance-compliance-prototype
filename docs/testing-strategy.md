# Testing Strategy

The prototype includes focused frontend checks.

- Vitest covers readiness logic in `frontend/packages/services/src/readiness.ts`.
- Playwright verifies the dashboard loads and a submission can be captured into the register.
- The Vite build gives TypeScript and production bundle confidence.

Production hardening should add:

- Drupal kernel tests for routes, validation, persistence and permissions.
- Upload tests for allowed file types, size limits and storage behaviour.
- Accessibility automation for key journeys.
- API contract tests between the React console and Drupal.
- Security scanning and dependency checks in CI.
