# Site Brand

This component owns the reusable Bonecutters brand lockup.

Local diagram: `site-brand.puml`.

Responsibilities:

- render a consistent home link
- keep the brand mark and text together
- avoid embedding page-specific layout behavior

Inputs:

- static site root URL

Outputs:

- accessible home link labeled for screen readers

Contract rules:

- the component should not own navigation state
- the component should not depend on page-specific copy
- styling belongs in `site-brand.css`

Verification:

- `npm run verify:client`
- `npm run verify:docs`
