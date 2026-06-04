# Tools

This folder owns repo-local verification and operational helper scripts.

Local diagram: `tools.puml`.

## Responsibilities

- run deterministic verification gates
- keep client tests linked through a stable public command
- validate deployment configuration shape without contacting AWS
- provide a public-safe AWS lane helper that reads real local values from ignored `.local/` files

## AWS Lane Helper

Use the helper to confirm which local AWS lane is configured before running human-approved hosted work:

```text
npm run aws:lane -- list
npm run aws:lane -- readonly check
npm run aws:lane -- deploy check
npm run deploy:aws
```

The helper reads `.local/aws-project.json`, which is ignored by Git. Do not commit that file, live AWS profile names, account IDs, bucket names, distribution IDs, or ARNs.

`npm run deploy:aws` uses the configured deploy lane to build, upload, and invalidate the live static site. It remains human-approved because it mutates AWS resources.

By default the deployment command does not delete remote assets. Use `npm run deploy:aws -- --delete-assets` only when intentionally removing replaced hashed assets from the private origin bucket.

Environment-printing helper commands redact values by default. Use `--show-values` only in a local terminal when you intentionally need real shell assignments.

## Contract Rules

- verification commands should stay deterministic and local unless clearly documented otherwise
- AWS helper commands remain human-approved
- helper output should avoid printing account IDs and ARNs during normal identity checks
- helper output should avoid printing live bucket names, distribution IDs, and local profile names unless explicitly requested
- real deployment values belong in ignored local files or operator-managed AWS configuration
