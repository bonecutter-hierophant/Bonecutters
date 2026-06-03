# Deployment

This folder owns public-safe deployment documentation for the Bonecutters static website.

Local diagram: `s3-cloudfront-hosting.puml`.

## V1 Hosting Shape

Bonecutters builds `client/dist` and hosts it through a private S3 origin behind CloudFront.

Public hosts:

- `www.bonecutters.us`: canonical site host
- `bonecutters.us`: root host redirected to `www.bonecutters.us`

AWS resource values stay out of the repository. Use placeholders in docs and local environment variables for real deployment values.

## Required AWS Boundary

- Use a Bonecutters-specific private S3 bucket.
- Keep S3 Block Public Access enabled where feasible.
- Use the S3 REST origin with CloudFront Origin Access Control.
- Do not use an S3 website endpoint for the OAC-backed origin.
- Use a Bonecutters-specific CloudFront distribution.
- Use an ACM viewer certificate in `us-east-1` that covers both public hostnames.
- Keep provisioning access separate from routine deployment access.
- Do not reuse SimpleETL buckets, distributions, roles, policies, scripts, or state.

## Routing And Errors

V1 is a single-route static page with same-page anchor navigation. It does not use browser-router fallback.

CloudFront should not map every `403` or `404` to `/index.html` for V1. Missing objects should remain missing until a later proposal adds routed pages, a `404.html`, or SPA fallback behavior.

## Cache And Invalidation

Use separate cache behavior for entry documents and hashed assets:

- `index.html`: short cache or no-cache
- hashed files under `assets/`: long cache with immutable semantics
- public root assets such as the logo: moderate cache and explicit invalidation when changed

Invalidate `/`, `/index.html`, and changed non-hashed root assets after deployment.

Remote deletion should be disabled by default. If deletion is needed, use a separate explicit command or flag.

## Local Configuration

The repo includes a dry-run validator that does not contact AWS:

```text
npm run deploy:check
```

Use strict mode only when preparing a deployment with local environment variables already set:

```text
npm run deploy:validate
```

The validator prints variable names and validation results, not secret values or live AWS identifiers.

Required local variables:

```text
BONECUTTERS_S3_BUCKET
BONECUTTERS_CLOUDFRONT_DISTRIBUTION_ID
BONECUTTERS_AWS_REGION
BONECUTTERS_ACM_REGION
BONECUTTERS_CANONICAL_HOST
BONECUTTERS_ROOT_HOST
```

Do not commit `.env` files, AWS CLI output, deployment logs, invalidation logs, generated IaC state, account aliases, or local AWS profile names.

## Human Approval Boundary

These operations remain human-approved:

- AWS console work
- AWS CLI commands
- IAM, S3, CloudFront, ACM, DNS, and deployment commands
- Git status, staging, commit, push, branch, and PR operations

Local docs, tests, public sanitization, TypeScript checks, and deployment config validation can run without AWS access.
