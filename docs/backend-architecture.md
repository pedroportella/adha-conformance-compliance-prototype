# Backend Architecture

The backend is a Drupal 10 scaffold with a custom `adha_conformance` module.

## Module responsibilities

- Define REST routes for listing, viewing and creating conformance submissions.
- Validate required fields server-side.
- Store submissions in a custom database table for the prototype.
- Accept evidence file uploads with size and extension checks.
- Provide an authenticated Drupal admin register at `/admin/adha-conformance`.

## Key files

- `adha_conformance.routing.yml`: API and admin routes.
- `adha_conformance.services.yml`: repository service registration.
- `adha_conformance.install`: database schema.
- `src/Controller/ConformanceController.php`: request handling, validation, upload and admin rendering.
- `src/Service/ConformanceRepository.php`: persistence and summary shaping.

## Production considerations

For a production ADHA/GovCMS implementation, the storage model should be reassessed. Drupal entities are likely preferable if the register needs granular permissions, workflow moderation, revisions, Views reports, field UI, translations or editorial ownership. The custom table approach is useful for a compact prototype because it keeps the integration contract clear.
