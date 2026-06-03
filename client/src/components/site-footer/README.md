# Site Footer

This component owns the persistent public site footer.

Local diagram: `site-footer.puml`.

Responsibilities:

- render the public `footer` landmark
- describe the Bonecutters domain in safe public language
- keep footer copy reusable across future public pages

Inputs:

- PRD-approved public domain description

Outputs:

- persistent footer content
- module-local tests under `tests/` linked through `npm run verify:test`

Contract rules:

- do not include phone numbers, private origin details, secrets, or deployment details
- keep footer styling component-owned in `site-footer.css`
- add navigation here only when the full PRD content pass creates stable footer links

Verification:

- `npm run verify:test`
- `npm run verify:safe`
