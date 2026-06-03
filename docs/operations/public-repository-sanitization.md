# Public Repository Sanitization

Date: 2026-06-03

Bonecutters is public. Treat every committed file as something a recruiter, hiring manager, future collaborator, or search engine might inspect.

## Commit Boundary

Do not commit:

- secrets, tokens, private keys, OAuth credentials, or API keys
- private AWS account identifiers, IAM credentials, live bucket names, or billing details
- live S3 bucket names, CloudFront distribution IDs, Route 53 hosted zone IDs, ARNs, local AWS profile names, or account aliases
- generated IaC plans, state files, copied AWS CLI responses, deployment logs, or invalidation logs
- customer data, private project context, HR/application-specific material, or role-specific resumes
- phone numbers unless explicitly approved for public display
- machine-local paths such as user profile directories
- private Bonecutters origin details excluded by the PRD
- generated scratch output, logs, local caches, `node_modules`, or build output

## Required Checks

Before a first public commit, PR, or push:

```text
npm run verify:safe
npm run verify:scoped dependency-layout,public-sanitization,client,docs
```

Use `npm run verify:recommend:dirty` only as a human-approved Git checkpoint.

The `public-sanitization` gate scans tracked and untracked repo files, excluding ignored generated folders, for common credential patterns and machine-local absolute paths. It is a backstop, not a substitute for human review.

## Human Review

Before publishing, review the diff for:

- embarrassing placeholder copy
- private personal context
- misleading employment, company, or product maturity claims
- comments or docs that reveal internal-only process details
- generated files that should be ignored instead

When in doubt, keep the first public version boring, accurate, and easy to replace.
