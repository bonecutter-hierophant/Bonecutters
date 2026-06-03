# Site Brand

This component owns the reusable Bonecutters brand lockup.

Local diagram: `site-brand.puml`.

Responsibilities:

- render a consistent home link
- render the approved Bonecutters SVG logo as a decorative mark
- keep the logo and text together
- avoid embedding page-specific layout behavior

Inputs:

- static site root URL
- `/bonecutters-logo.svg` public asset

Outputs:

- accessible home link labeled for screen readers
- module-local tests under `tests/` linked through `npm run verify:test`

Contract rules:

- the component should not own navigation state
- the component should not depend on page-specific copy
- styling belongs in `site-brand.css`
- the logo image is decorative because the link already has an accessible label

Verification:

- `npm run verify:test`
- `npm run verify:safe`
