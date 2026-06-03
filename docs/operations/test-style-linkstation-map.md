# Test And Style Linkstation Map

Date: 2026-06-03

Bonecutters uses stable public verification and stylesheet entrypoints that delegate to module-local owner files. This keeps the repo small while letting tests and styles grow organically beside the page or component they cover.

## Test Linkstation

`tools/test-client.mjs` delegates to:

| Owner file | Coverage | Public command |
|---|---|---|
| `client/src/components/site-footer/tests/site-footer.test.mjs` | Public footer text and excluded private/deployment details | `npm run verify:test` |
| `client/src/components/site-header/tests/site-header.test.mjs` | Public header semantics, brand composition, and approved contact link | `npm run verify:test` |
| `client/src/pages/home/tests/home-page.test.mjs` | Home page fallback copy and header delegation | `npm run verify:test` |

Coverage preservation rule: add or update tests in the nearest module-local `tests/` folder. Update this map in the same change when a new test owner is linked into a public test command.

## Style Linkstation

`client/src/styles.css` delegates to:

| Owner file | Role |
|---|---|
| `client/src/design/foundations.css` | global variables, base element rules, and site foundations |
| `client/src/pages/home/home-page.css` | Home page fallback layout and typography |
| `client/src/components/site-brand/site-brand.css` | reusable Bonecutters brand link styles |
| `client/src/components/site-header/site-header.css` | reusable public header and navigation layout |
| `client/src/components/site-footer/site-footer.css` | reusable public footer layout |

Style preservation rule: keep `client/src/styles.css` as an import-only linkstation unless adding true global foundations. New page/component styles should live beside the owning page or component and be imported through the linkstation.
