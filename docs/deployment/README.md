# Deployment

This folder owns public-safe deployment documentation for the Bonecutters static website.

Local diagram: `s3-cloudfront-hosting.puml`.

## Current State

The site is not online yet.

Completed locally:

- [x] Launch-ready static client content
- [x] S3 and CloudFront hosting proposal
- [x] Public-safe deployment documentation
- [x] Local deployment configuration validator
- [x] Verification gate for deployment config shape
- [x] Bonecutters private S3 origin bucket created
- [x] ACM DNS validation completed
- [x] Issued ACM viewer certificate
- [x] CloudFront Origin Access Control created
- [x] CloudFront distribution created
- [x] Root-domain redirect behavior configured through CloudFront
- [x] First upload of `client/dist`

Not completed yet:

- [ ] DNS pointing `www.bonecutters.us` or `bonecutters.us` at CloudFront

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

## Local AWS Access Preparation

Keep real local AWS profile names and live AWS identifiers out of the repository. Use placeholders in docs and keep the actual values in the AWS CLI, AWS Toolkit, AWS Console, or local untracked environment only.

Prepare three credential lanes where feasible:

- `<bonecutters-provisioning-profile>`: setup access for IAM, S3, CloudFront, ACM, and DNS work.
- `<bonecutters-deploy-profile>`: narrower deploy access for S3 asset upload and CloudFront invalidation.
- `<bonecutters-readonly-profile>`: optional inspection access for AWS Toolkit, Console, or CLI reads.

Use IAM Identity Center, role assumption, or another temporary-credential flow where feasible. Avoid long-lived access keys for this project unless a later workflow explicitly approves and documents the exception.

Before any AWS resource creation, verify the active identity locally with the intended profile and confirm it is not using a SimpleETL role, bucket, distribution, script, or state path.

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

## Go-Live Checklist

Use this checklist when moving from local readiness to a real hosted site. AWS and DNS steps remain human-approved.

- [ ] Confirm the working tree is clean enough for deployment-facing work.
- [ ] Run `npm run verify:scoped dependency-layout,public-sanitization,deployment-config,client,docs`.
- [ ] Create or choose a Bonecutters-scoped provisioning access path.
- [ ] Create or choose a separate Bonecutters-scoped routine deployment role or permission set.
- [ ] Optionally create or choose a Bonecutters-scoped read-only inspection path.
- [ ] Confirm local AWS access uses Bonecutters lanes and not SimpleETL lanes.
- [x] Create a Bonecutters-specific private S3 bucket for `client/dist` assets.
- [x] Keep S3 Block Public Access enabled where feasible.
- [x] Request an ACM viewer certificate in `us-east-1` covering `www.bonecutters.us` and `bonecutters.us`.
- [x] Add ACM DNS validation records wherever `bonecutters.us` DNS is hosted.
- [x] Wait for ACM certificate status to become issued.
- [x] Create a Bonecutters-specific CloudFront distribution with the S3 REST origin.
- [x] Configure CloudFront Origin Access Control for the S3 origin.
- [x] Add the S3 bucket policy that allows only the Bonecutters CloudFront distribution to read objects.
- [x] Attach the public hostnames and ACM certificate to CloudFront.
- [x] Configure root-domain redirect behavior from `bonecutters.us` to `www.bonecutters.us`.
- [ ] Set local deployment variables and run `npm run deploy:validate`.
- [x] Build the site with `npm run build`.
- [x] Upload `client/dist` assets to the Bonecutters S3 bucket using the approved deployment path.
- [x] Apply cache-control behavior for `index.html`, hashed assets, and root public assets.
- [x] Create a CloudFront invalidation for `/`, `/index.html`, and changed non-hashed root assets after the distribution is deployed.
- [x] Test the CloudFront distribution URL directly.
- [x] Test `403` and `404` behavior so missing assets are not silently treated as successful page loads.
- [ ] Point DNS for `www.bonecutters.us` and `bonecutters.us` at CloudFront to make the site live.
