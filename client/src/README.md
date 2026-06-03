# Client App Shell

This folder owns the browser entrypoint for the Bonecutters static website.

Local diagram: `app-shell.puml`.

Responsibilities:

- mount the React application through `main.tsx`
- keep `App.tsx` as the route shell while the site has a single public page
- import global styles through `styles.css`
- delegate page content to page-owned folders under `pages/`
- keep reusable UI in component-owned folders under `components/`

Inputs:

- `client/index.html`
- browser URL for the static site
- page and component modules

Outputs:

- a static website build in `client/dist`
- rendered public pages for S3 and CloudFront hosting

Contract rules:

- app-shell behavior should stay routing-focused
- page content belongs in `client/src/pages/<page-name>/`
- reusable UI belongs in `client/src/components/<component-name>/`
- global CSS should be limited to shared foundations and imports

Verification:

- `npm run verify:client`
- `npm run verify:docs`
