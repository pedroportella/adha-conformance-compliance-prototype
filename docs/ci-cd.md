# CI/CD

Recommended checks for this prototype:

```bash
pnpm --dir frontend install
pnpm --dir frontend lint
pnpm --dir frontend test:unit
pnpm --dir frontend build
pnpm --dir frontend test:e2e
```

Recommended production gates:

- Composer install and Drupal coding standards.
- Drupal cache rebuild and update hook checks.
- PHP static analysis and Drupal kernel tests.
- Frontend lint, unit tests, build and Playwright smoke tests.
- Accessibility checks for public and admin journeys.
- Dependency, container and secret scanning.
- Deployment smoke tests for the register API and admin route.
