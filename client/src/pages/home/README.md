# Home Page

This page owns the public landing experience for `www.bonecutters.us`.

Local diagram: `home-page.puml`.

Responsibilities:

- provide a safe fallback public homepage before the full PRD content pass
- introduce Jediah Blankenship and the Bonecutters domain
- expose LinkedIn, SimpleETL, and email links
- keep the site professional if the first commit is inspected
- delegate branded navigation to `SiteHeader`
- delegate persistent footer copy to `SiteFooter`

Inputs:

- reusable `SiteHeader`
- reusable `SiteFooter`
- Web Awesome button primitives
- LinkedIn URL
- SimpleETL URL
- contact mailto URL

Outputs:

- static first-page experience for S3 and CloudFront hosting
- module-local tests under `tests/` linked through `npm run verify:test`

Contract rules:

- this page should stay publicly safe and avoid private operational details
- reusable header, footer, and branding belong to `client/src/components/site-header/`, `client/src/components/site-footer/`, and `client/src/components/site-brand/`
- page layout and copy belong in this folder
- full PRD sections should replace this fallback in a later content implementation pass

Verification:

- `npm run verify:test`
- `npm run verify:client`
- `npm run verify:docs`
