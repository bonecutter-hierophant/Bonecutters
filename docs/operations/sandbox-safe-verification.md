# Sandbox-Safe Verification

Date: 2026-06-03

Bonecutters should preserve the SimpleETL habit of using deterministic verification gates that run safely inside the local agent sandbox. Git commands and AWS access stay human-approved by default. Routine code, docs, type, and local sanitization checks should not need human oversight.

## Safe Lane

Use this command for frequent local checks while building structure and content:

```text
npm run verify:safe
```

The safe lane runs:

- `dependency-layout`
- `public-sanitization`
- `test`
- `deployment-config`
- `client:typecheck`
- `docs`

These gates avoid registry access, deployment access, Git subprocess requirements, and Vite/esbuild production bundling.

Use `verify:safe` as the default unattended verification lane.

## Full Closeout Lane

Use this before a baseline commit, PR, push, or deployment-facing change:

```text
npm run verify:scoped dependency-layout,public-sanitization,client,docs
```

The full lane includes the Vite production build. In managed sandboxes, that build may require one explicit approval because Vite/esbuild spawns a local binary. Do not use that approval as a substitute for the safe lane during normal iteration.

The full lane does not deploy and should not require AWS access.

## Human-Approved Lanes

Keep human approval for:

- Git commands, including status, diff, branch, commit, merge, push, and PR operations
- Git-based recommendation helpers such as `npm run verify:recommend:dirty`
- AWS, DNS, S3, CloudFront, IAM, or deployment commands
- dependency installation or registry access
- GUI/browser launches

These actions can still be useful, but they should be treated as intentional checkpoints rather than routine unattended verification.

## Tooling Rule

Repo-owned verification tools should prefer filesystem and Node APIs over shelling out when practical. This keeps checks portable and reduces approval noise.

Avoid adding a verification gate that requires escalation unless:

- it needs Git metadata
- it deploys or talks to an external provider
- it needs live credentials
- it launches a GUI/browser
- it runs a production bundler or binary that the sandbox blocks
- the feature proposal explicitly accepts the approval requirement

When a gate must require approval, document why and keep a smaller safe gate available for routine development.
