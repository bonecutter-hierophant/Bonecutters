# Design Foundations

This folder owns shared design foundations for the Bonecutters static website.

Local diagram: `site-design-system.puml`.

Repo-level design rules: `docs/design/frontend-design-rules.md`.

Responsibilities:

- define global color, typography, spacing, and shadow tokens
- keep base design primitives available to page and component CSS
- avoid page-specific layout rules

Inputs:

- root site identity and public website tone
- page and component styling needs

Outputs:

- `foundations.css` imported by `client/src/styles.css`

Contract rules:

- default to Web Awesome primitives for controls before creating custom control DOM
- page-specific styling belongs beside the page
- component-specific styling belongs beside the component
- tokens should support a restrained, readable public site without relying on a one-note palette

Verification:

- `npm run verify:client`
- `npm run verify:docs`
