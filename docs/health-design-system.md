# Health Design System

## Decision

The frontend uses `@health.gov.au/health-design-system` as the design-system dependency for ADHA-facing React surfaces.

- `frontend/apps/portal` imports `@health.gov.au/health-design-system/build/css/hds-all.css`.
- `frontend/packages/ui-library` owns React components that emit Health Design System markup and class names.
- `frontend/packages/ui-tokens` exposes Health Design System colour and variable references for package-level styling.
- Apps should compose screens from `ui-library` and `ui-assets`; they should not hand-roll form controls, tables, layout regions or design-system markup.

## Component Coverage

The `ui-library` package includes React wrappers for the Health Design System component families used by the prototype and available for future screens. The component folders are PascalCase and cover accordion, accordion group, back to top, callout, card, facet, figure, file, filter, image, band, link, listing, lists, field, field groups, book navigation, breadcrumb, in-page navigation, main navigation, pager, side navigation, tabs, page alerts, footer, header, hero, sub-header, quick exit, inline reference, references, release status, search, search result, separator, step indicator, subtitle, footnotes, metadata, table, tags, toolbar, tooltip and video.

`FormControls` owns button, checkboxes, mandatory label, radios, select, text input and text area components. These controls keep Health Design System markup while providing a smarter React API for validation messages, controlled values, option objects and navigation-safe buttons.

`Layout` owns the shared shell. `Template` provides React examples for content, landing, campaign, listing, form and search pages.

## References

- Health Design System GitHub installation: https://github.com/healthgovau/health-design-system#installation
- Health Design System website: https://designsystem.health.gov.au/
- Health Design System colours and variables: https://designsystem.health.gov.au/docs/colours-and-variables
