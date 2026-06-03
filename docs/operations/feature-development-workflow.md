# Feature Development Workflow

Date: 2026-06-02

Bonecutters uses the SimpleETL feature workflow, reduced for a public static website. The goal is to keep planning, implementation, documentation, verification, and Git history easy for outside readers to follow.

## Reader Path

Before implementation:

- Read the root `README.md`.
- Read the relevant local README and PlantUML files beside the code being changed.
- Read `docs/operations/public-repository-sanitization.md` before first commit, PR, or push.
- Read `docs/operations/aws-deployment-boundary.md` before deployment, AWS, DNS, S3, CloudFront, or IAM work.
- Read `docs/operations/sandbox-safe-verification.md` before changing verification tooling or adding new gates.
- Read `docs/operations/test-style-linkstation-map.md` before adding, moving, or reviewing tests or styles.
- Read `docs/operations/scoped-verification-gates.md` before naming verification.
- For cross-cutting structure changes, update `docs/architecture/project-structure.md` and `docs/architecture/uml-index.puml`.

## Proposal Rule

Small copy, CSS, and single-component polish work can proceed directly when the owner docs stay accurate.

Create a proposal in `docs/proposals/` before implementation when work changes:

- site structure or routing
- reusable component contracts
- deployment shape
- analytics, forms, or provider integrations
- public data collection or privacy behavior
- repository workflow or verification tooling

The proposal should include scope, public-repo safety notes, dependencies, implementation steps, verification gates, out-of-scope items, and a closeout checklist.

## Implementation Rules

- Keep implementation inside the approved scope.
- Keep reusable components in `client/src/components/<component-name>/`.
- Keep page-owned files in `client/src/pages/<page-name>/`.
- Keep component and page docs beside the owning files.
- Update README and PlantUML files in the same change as code that changes responsibilities.
- Add or update tests in module-local `tests/` folders and link them through the stable public test command.
- Avoid unrelated refactors and formatting churn.
- Do not add secrets, private AWS account identifiers, tokens, or live credentials to source control.
- Run the public sanitization gate before committing public-facing work.

## Closeout

Before calling work complete:

- Run the scoped verification gates selected for the touched files.
- Run `npm run verify:scoped dependency-layout,public-sanitization,client,docs` before the first public commit or whenever public-facing files change.
- Confirm durable local README and PlantUML docs describe the final behavior.
- Update the root README when project structure, verification, deployment, or feature status changes.
- Remove completed proposal files after review when durable docs exist.
- Keep the working tree limited to intentional changes before committing.
