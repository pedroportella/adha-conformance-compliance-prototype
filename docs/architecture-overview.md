# Architecture Overview

The prototype separates the conformance experience into two layers.

The React frontend provides a focused operating console for Agency assessors and delivery stakeholders. It surfaces the conformance register, risk posture, evidence intake, readiness controls and workflow state.

The Drupal backend provides the GovCMS-oriented system boundary: route definitions, validation, persistence, evidence upload handling and authenticated admin visibility. In production, this could move further into Drupal-native content entities, workflows, Views dashboards, media entities, roles and configuration management.

## Main flows

1. A vendor or provider organisation prepares a conformance submission.
2. Evidence is attached for accessibility, cyber security, analytics and integration readiness.
3. The React console posts the submission to Drupal.
4. Drupal validates required fields, stores the payload and exposes the register through REST.
5. Agency staff review submissions through the React console or the Drupal admin register.

## Production evolution

- Replace prototype JSON storage with Drupal custom entities or content entities if Views, revisions, permissions and workflow moderation are required.
- Add authentication, CSRF/token strategy and role-specific access control.
- Add virus scanning, retention rules and private file storage for evidence.
- Add GA/GTM event instrumentation and reporting dashboards.
- Add Drupal kernel tests, coding standards and security scanning.
