# Health Design System

## Overview

The frontend uses `@health.gov.au/health-design-system` as the design-system dependency for ADHA-facing React surfaces.

The implementation keeps Health Design System markup and class names centralised in reusable React wrappers so application screens can remain focused on workflow and data handling.

## Delivered Capability

- `frontend/apps/portal` imports `@health.gov.au/health-design-system/build/css/hds-all.css`.
- `frontend/packages/ui-library` owns React components that emit Health Design System markup and class names.
- `frontend/packages/ui-tokens` exposes Health Design System colour and variable references for package-level styling.
- Applications compose screens from `ui-library` and `ui-assets` rather than hand-rolling form controls, tables, layout regions, or design-system markup.

## Component Coverage

The `ui-library` package includes React wrappers for the Health Design System component families used by the portal and available for future screens. The component folders are PascalCase and cover accordion, accordion group, back to top, callout, card, facet, figure, file, filter, image, band, link, listing, lists, field, field groups, book navigation, breadcrumb, in-page navigation, main navigation, pager, side navigation, tabs, page alerts, footer, header, hero, sub-header, quick exit, inline reference, references, release status, search, search result, separator, step indicator, subtitle, footnotes, metadata, table, tags, toolbar, tooltip, and video.

`FormControls` owns button, checkboxes, mandatory label, radios, select, text input, and text area components. These controls keep Health Design System markup while providing typed React APIs for validation messages, controlled values, option objects, and navigation-safe buttons.

`Layout` owns the shared shell. `Template` provides React examples for content, landing, campaign, listing, form, and search pages.

## Operational Guidance

- Add reusable component behaviour in `frontend/packages/ui-library`.
- Add application-specific composition in `frontend/apps/portal`.
- Keep Health Design System CSS imports at application entrypoints.
- Keep ADHA-specific styling overrides scoped to the theme or application styles.
- Add smoke tests for new public component APIs.

## References

- Health Design System GitHub installation: https://github.com/healthgovau/health-design-system#installation
- Health Design System website: https://designsystem.health.gov.au/
- Health Design System colours and variables: https://designsystem.health.gov.au/docs/colours-and-variables
