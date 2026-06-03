# S3 And CloudFront Hosting Proposal

Date: 2026-06-03

## Scope

Define the V1 hosting path for the Bonecutters static website at `www.bonecutters.us`.

The feature changes should cover:

- Bonecutters-specific AWS resource boundaries
- private S3 origin for built static assets
- CloudFront distribution for the public website
- root-domain redirect behavior for `bonecutters.us`
- project-scoped deployment role or IAM Identity Center permission set
- project-local deployment scripts and docs
- verification and human-approval boundaries for AWS and Git operations

## Proposed Hosting Shape

- Build output: `client/dist`
- Origin: one Bonecutters-specific private S3 bucket for static assets
- Public edge: one Bonecutters-specific CloudFront distribution
- Canonical host: `www.bonecutters.us`
- Root host: attach `bonecutters.us` to CloudFront and redirect it to `www.bonecutters.us`
- Origin access: CloudFront Origin Access Control for the S3 origin
- S3 public access: keep S3 Block Public Access enabled where feasible
- S3 origin type: use the S3 REST origin, not the S3 static website endpoint
- TLS: CloudFront alternate domain names use an ACM certificate in `us-east-1`
- IAM: Bonecutters-scoped role or permission set, separate from SimpleETL
- Tags: apply a consistent project tag such as `Project=Bonecutters`

## Routing And Error Behavior

V1 is a single-route static page with same-page anchor navigation. It does not need browser-router fallback for direct loads such as `/about`.

Because the private S3 origin can surface missing objects as `403` or `404`, CloudFront error behavior still needs to be intentional:

- do not map all `403` or `404` responses to `/index.html` for V1
- keep error response cache TTL short while routing is simple
- add an explicit `404.html` page or SPA fallback only in a later routing proposal
- revisit custom error responses before adding React Router or any path-based client routing

## Cache Policy

Deployment scripts and setup docs should use distinct cache behavior:

- `index.html`: short cache or no-cache so deploys become visible quickly
- hashed files under `assets/`: long cache with immutable semantics
- public root assets such as the logo: moderate cache plus invalidation when changed
- CloudFront invalidation: invalidate `/`, `/index.html`, and any changed non-hashed root assets
- remote deletion: disabled by default and available only behind an explicit deploy flag or separate command

## OAC Bucket Policy Shape

The S3 bucket should remain private with Block Public Access enabled. The bucket policy should allow CloudFront to read objects through the CloudFront service principal, constrained to the Bonecutters distribution source ARN when the distribution exists.

Do not use the S3 website endpoint as the origin for the OAC-backed distribution.

## Public-Repository Safety

This repository is public. Do not commit:

- AWS account IDs
- access keys, secret keys, tokens, session credentials, or private keys
- live bucket names
- CloudFront distribution IDs
- Route 53 hosted zone IDs
- private DNS provider details
- generated AWS state containing account-specific values
- generated IaC plans, state files, deployment logs, invalidation logs, or copied AWS CLI responses
- local AWS profile names or account aliases
- SimpleETL resource names, role names, policies, scripts, or identifiers

Docs and scripts may use placeholders such as:

```text
<bonecutters-static-bucket>
<bonecutters-cloudfront-distribution-id>
<bonecutters-deploy-role-arn>
<route53-hosted-zone-id>
```

## Separation From SimpleETL

Bonecutters must not reuse or mutate SimpleETL resources.

Required separation:

- separate S3 bucket
- separate CloudFront distribution
- separate IAM role or permission set
- separate deployment script names
- separate tags
- separate documentation
- no shared deployment state unless a future proposal explicitly approves a shared infrastructure tool

## Deployment Script Direction

Add project-local scripts only after the AWS resources and approval boundary are agreed.

Likely V1 commands:

- build the client with `npm run build`
- sync `client/dist` to the Bonecutters S3 bucket
- apply the cache-control policy described above
- create a CloudFront invalidation for `/`, `/index.html`, and changed non-hashed root assets

Scripts should require explicit environment variables or command arguments for account-specific values. They should fail closed when required values are missing and should not infer SimpleETL defaults. Sync deletion should be disabled by default.

## IAM Direction

Keep provisioning access separate from routine deployment access.

Provisioning access may create or change S3, CloudFront, ACM, DNS, IAM, and policy resources, but remains human-approved and should not be automated in V1 without a later proposal.

Routine deployment access should be limited to:

- listing and reading the Bonecutters static asset bucket only as needed for validation
- writing objects to the Bonecutters static asset bucket
- deleting objects only when an explicit delete-enabled deploy path is approved
- reading the Bonecutters CloudFront distribution only as needed for validation
- creating invalidations for the Bonecutters CloudFront distribution

No deployment role should have permissions for SimpleETL resources.

## Human Approval Boundary

Keep these operations human-approved:

- AWS console work
- AWS CLI commands
- IAM, S3, CloudFront, ACM, DNS, and deployment commands
- Git status, staging, commit, push, branch, and PR operations

Keep these operations sandbox-safe where possible:

- local tests
- TypeScript checks
- static build verification when the Vite/esbuild approval boundary is already satisfied
- public-repository sanitization
- docs checks

## Dependencies

- Existing Vite/React static build
- Existing `npm run verify:scoped dependency-layout,public-sanitization,client,docs` closeout lane
- Owner AWS access path
- Bonecutters-specific IAM role or IAM Identity Center permission set
- ACM certificate in `us-east-1` covering `www.bonecutters.us` and `bonecutters.us`
- DNS control for `bonecutters.us`

## Implementation Steps

1. Decide whether infrastructure is documented as console-first, CLI-first, or IaC-first for V1.
2. Create or document the Bonecutters-scoped AWS access path.
3. Provision a private S3 bucket for `client/dist` assets.
4. Configure CloudFront with the S3 origin and Origin Access Control.
5. Add the OAC bucket policy that allows only the Bonecutters CloudFront distribution to read objects.
6. Attach the public hostnames and `us-east-1` TLS certificate.
7. Configure the root-domain CloudFront redirect from `bonecutters.us` to `www.bonecutters.us`.
8. Confirm V1 error behavior does not unintentionally mask missing assets as successful page loads.
9. Add project-local deployment documentation with placeholders only.
10. Add deployment scripts only after the resource values and approval flow are clear.
11. Add or update architecture diagrams for the final hosted boundary.
12. Run verification before committing any deployment-facing docs or scripts.

## Verification Gates

Frequent local check:

```text
npm run verify:safe
```

Closeout check before commit or deployment-facing review:

```text
npm run verify:scoped dependency-layout,public-sanitization,client,docs
```

When deployment scripts are added, include a dry-run or configuration-validation path that does not contact AWS.

## AWS Reference Notes

Current AWS guidance supports this shape:

- S3 Block Public Access helps prevent public access through bucket policies and ACLs.
- AWS recommends CloudFront with Origin Access Control when serving a private S3-backed static site.
- CloudFront Origin Access Control is recommended for S3 bucket origins.
- CloudFront alternate domain names require a trusted certificate whose names cover the requested hostnames.
- ACM certificates used with CloudFront viewer certificates must be in `us-east-1`.

## Out Of Scope

- Backend APIs
- Contact forms
- Analytics
- New AWS account creation
- Reusing or changing SimpleETL infrastructure
- Committing live AWS identifiers or secrets
- Automatic deployment from GitHub Actions

## Open Questions

- Should V1 use console-first setup notes, AWS CLI scripts, or a small IaC template?
- Is DNS managed in Route 53 or another provider?
- Should the root-domain redirect use a CloudFront Function, CloudFront behavior, or another CloudFront-native redirect mechanism?
- Should the first deployment implementation include delete-enabled sync, or leave remote deletion as a later explicit command?
- Should V1 add a simple `404.html`, or defer that until the first routed page is added?

## Closeout Checklist

- [ ] Hosting approach is selected.
- [ ] Bonecutters IAM boundary is documented.
- [ ] Root-domain redirect mechanism is selected.
- [ ] Cache-control and invalidation behavior are documented.
- [ ] V1 routing and `403` or `404` behavior are documented.
- [ ] OAC bucket policy shape is documented with placeholders only.
- [ ] S3 and CloudFront setup docs use placeholders only.
- [ ] Deployment scripts, if added, fail closed without required Bonecutters values.
- [ ] Architecture diagrams match the final resource shape.
- [ ] Public sanitization gate passes.
- [ ] Full scoped verification passes.
