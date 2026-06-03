# Bonecutters Agent Instructions

This repository follows the same feature-development discipline as SimpleETL, scaled down for a public static website.

Before changing code:

- Read the root `README.md`.
- Read `docs/design/frontend-design-rules.md` before frontend implementation.
- Read `docs/operations/public-repository-sanitization.md` before first commit, PR, or push.
- Read `docs/operations/aws-deployment-boundary.md` before AWS, DNS, S3, CloudFront, or deployment-script work.
- Read `docs/operations/sandbox-safe-verification.md` before adding or changing verification tooling.
- Read `docs/operations/test-style-linkstation-map.md` before adding, moving, or reviewing tests or styles.
- Read the relevant local `README.md` and PlantUML file beside the page or component being changed.
- Use `docs/operations/feature-development-workflow.md` for non-trivial feature work.
- Keep public-repository hygiene in mind: do not commit secrets, private operational details, customer data, provider credentials, or machine-local paths beyond documented developer workflow examples.
- Keep placeholder public copy boring, accurate, and easy to replace before the first commit.

For implementation:

- Prefer the existing Vite/React static-site structure.
- Use Web Awesome primitives first for controls, and keep custom CSS focused on layout, composition, brand treatment, and supported primitive adjustments.
- Keep docs close to the code that owns the behavior.
- Add or update a local README and PlantUML diagram for every page and component directory whose responsibilities change.
- If custom CSS recreates a control primitive, document why the Web Awesome primitive or supported API was not sufficient.
- Keep AWS, DNS, S3, and CloudFront deployment details documented without embedding live secrets or account-private values.
- Keep Bonecutters AWS resources separate from SimpleETL resources; do not reuse SimpleETL IAM roles, buckets, distributions, or deployment scripts.

Verification:

- Use `npm run verify:safe` for frequent sandbox-safe checks while iterating.
- Add tests in module-local `tests/` folders, then link them through the stable public test command.
- Use `npm run verify:scoped <gates>` for deterministic local verification.
- For client work, the normal closeout gate is `npm run verify:scoped dependency-layout,public-sanitization,client,docs`.
- Git commands, including `npm run verify:recommend:dirty`, commit, push, branch, and status checks, should remain human-approved.
- AWS access, deployment, DNS, S3, CloudFront, and IAM work should remain human-approved.
