# Backend Architecture

## Overview

The backend is implemented with Drupal 10 and provides the API, persistence, evidence handling, and administration capability for the ADHA Conformance & Compliance Portal.

Drupal owns submitted conformance data and exposes the required endpoints to the React frontend.

## Delivered Capabilities

- Custom Drupal module for conformance register functionality.
- REST API for conformance submission creation.
- REST API for conformance submission retrieval.
- Evidence upload handling.
- MariaDB-backed persistence.
- Administrator view for submitted conformance records.

## Drupal Application

The backend uses Drupal 10 with PHP and Symfony components.

Primary responsibilities:

- Accept conformance submissions.
- Validate backend request handling.
- Persist conformance register data.
- Manage evidence metadata and storage.
- Provide administrative visibility through Drupal.

## API Surface

The backend exposes conformance endpoints consumed by the frontend and automated tests.

| Capability | Endpoint |
| --- | --- |
| List conformance submissions | `GET /api/conformance-submissions` |
| Create conformance submission | `POST /api/conformance-submissions` |
| View conformance submission | `GET /api/conformance-submissions/{id}` |
| Delete conformance submission | `DELETE /api/conformance-submissions/{id}` |
| Upload evidence | `POST /api/conformance-submissions/evidence` |
| Conformance administration | `/admin/adha-conformance` |

The administration page is available after Drupal installation and module enablement.

```txt
http://localhost:8080/admin/adha-conformance
```

Local administrator credentials:

```txt
Username: admin
Password: admin
```

## Data Model

The backend persists conformance information including:

- Submission identifier and reference number.
- Vendor/provider organisation details.
- Product or service details.
- Workflow status.
- Risk level.
- Submitted timestamp.
- Full submission payload.

## Evidence Handling

Evidence handling is managed by the backend so uploaded files and metadata remain associated with the submitted conformance record.

Backend responsibilities include:

- Receiving uploaded file payloads.
- Validating file size and extension.
- Storing file content through the Drupal-managed file system.
- Returning evidence metadata for the frontend submission payload.

## Database

MariaDB provides local relational persistence for Drupal and submitted conformance records.

The custom module creates and owns the `adha_conformance_submission` table. The table stores list-friendly fields such as reference number, organisation name, product name, workflow status, risk level, and submitted timestamp, plus the full submitted record payload as JSON so the current API shape remains clear without additional Drupal entity configuration.

Typical local database access:

```bash
docker compose exec mariadb mariadb -uroot -proot
```

Application-user access:

```bash
docker compose exec mariadb mariadb -uadha_conformance -padha_conformance adha_conformance
```

## Operational Commands

```bash
# Install backend dependencies.
docker compose run --rm php composer install

# Install Drupal locally.
docker compose exec php vendor/bin/drush site:install minimal \
  --site-name="ADHA Conformance Prototype" \
  --account-name=admin \
  --account-pass=admin \
  -y

# Enable the custom module.
docker compose exec php vendor/bin/drush pm:enable adha_conformance -y

# Apply module schema updates for existing local installs.
docker compose exec php vendor/bin/drush updatedb -y

# Rebuild Drupal cache.
docker compose exec php vendor/bin/drush cache:rebuild

# Check Drupal status.
docker compose exec php vendor/bin/drush status
```

## Integration Points

- React frontend submits conformance records through REST APIs.
- Playwright test journeys exercise the frontend submission experience.
- Drupal admin users review submitted conformance records through the admin page.
- MariaDB stores persisted conformance data in `adha_conformance_submission`.

## Production Considerations

- Reassess table-based persistence against Drupal entities if the register requires field-level permissions, editorial workflow, revisions, translations, Views reporting, or configuration-managed field changes.
- Add role-based access control, CSRF/token handling, and API authentication.
- Move evidence files to private storage with virus scanning, retention policies, and audit logging.
- Add Drupal kernel tests for routes, persistence, validation, permissions, and upload handling.
