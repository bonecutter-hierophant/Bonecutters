# Site Header

This component owns the reusable public site header and branded navigation.

Local diagram: `site-header.puml`.

Responsibilities:

- render the public `header` landmark
- keep the primary navigation semantic and keyboard accessible
- compose the reusable `SiteBrand`
- expose the approved fallback contact link

Inputs:

- `SiteBrand`
- public contact mailto URL

Outputs:

- branded top navigation for public pages
- module-local tests under `tests/` linked through `npm run verify:test`

Contract rules:

- page-specific layout and copy should stay with the page owner
- navigation controls should use Web Awesome primitives when the interaction grows beyond plain text links
- this component should not own page section navigation until the full PRD content pass adds those sections

Verification:

- `npm run verify:test`
- `npm run verify:safe`
