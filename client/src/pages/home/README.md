# Home Page

This page owns the public landing experience for `www.bonecutters.us`.

Local diagram: `home-page.puml`.

Responsibilities:

- provide the launch-ready public homepage
- introduce Jediah Blankenship and the Bonecutters domain
- render About, Selected Work, Writing, About the Name, and Contact sections
- expose LinkedIn, SimpleETL, and email links
- expose CatapultCMS, Idea Fab Labs, and writing links
- keep the site professional and public-repository safe
- delegate branded navigation to `SiteHeader`
- delegate persistent footer copy to `SiteFooter`

Inputs:

- reusable `SiteHeader`
- reusable `SiteFooter`
- Web Awesome button primitives
- LinkedIn URL
- SimpleETL URL
- CatapultCMS URL
- Idea Fab Labs URL
- LinkedIn article URL
- contact mailto URL

Outputs:

- static first-page experience for S3 and CloudFront hosting
- module-local tests under `tests/` linked through `npm run verify:test`

Contract rules:

- this page should stay publicly safe and avoid private operational details
- reusable header, footer, and branding belong to `client/src/components/site-header/`, `client/src/components/site-footer/`, and `client/src/components/site-brand/`
- page layout and copy belong in this folder
- no private source document URLs, phone numbers, secrets, or deployment details belong in this page

Verification:

- `npm run verify:test`
- `npm run verify:client`
- `npm run verify:docs`
