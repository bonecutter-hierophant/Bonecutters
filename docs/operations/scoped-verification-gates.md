# Scoped Verification Gates

Date: 2026-06-02

Bonecutters uses repo-owned verification gates so public changes can be reviewed from local commands.

For sandbox-safe verification policy, read `docs/operations/sandbox-safe-verification.md`.

## Gates

- `dependency-layout`: checks package metadata and accidental self-links.
- `public-sanitization`: scans tracked and untracked text files for common secrets, local user paths, and public-repo hygiene risks.
- `test`: runs the modular client test linkstation.
- `deployment-config`: tests the dry-run deployment configuration validator without contacting AWS.
- `aws:lane` is not a verification gate; it is a human-approved local helper for checking configured AWS lanes.
- `client:typecheck`: runs the React/TypeScript compiler without invoking Vite.
- `client`: runs the Vite/React TypeScript build.
- `docs`: scans workspace text files for trailing whitespace without requiring Git.

## Common Commands

```text
npm run verify:list
npm run verify:test
npm run verify:safe
npm run verify:scoped dependency-layout,public-sanitization,client,docs
npm run verify:scoped preset:review
```

Git-based recommendation is available as a human-approved checkpoint:

```text
npm run verify:recommend:dirty
```

## Defaults

- Documentation-only changes: `npm run verify:scoped dependency-layout,public-sanitization,docs`
- Deployment documentation or tooling changes: `npm run verify:scoped dependency-layout,public-sanitization,deployment-config,docs`
- Routine client UI changes while iterating: `npm run verify:safe`
- Client UI closeout before commit: `npm run verify:scoped dependency-layout,public-sanitization,client,docs`
- Tooling or package changes: `npm run verify:scoped dependency-layout,public-sanitization,client,docs`

`verify:safe` avoids the Vite/esbuild production build so it is suitable for frequent sandboxed checks. Use the full client closeout lane before commit or deployment.

If the recommendation runner maps a touched path to broader gates than expected, record why a narrower set is acceptable before closeout.
