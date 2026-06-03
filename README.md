# Bonecutters

Bonecutters is the public root website for `www.bonecutters.us`.

The site is intentionally small: a Vite/React client that builds to static files for S3 and CloudFront, with documentation kept close to each page and component so visitors can see how the work is organized.

## Current Status

- [x] Static client and launch content implemented locally
- [x] Documentation and PlantUML ownership pattern established
- [x] S3/CloudFront deployment workflow documented with local validation
- [ ] Bonecutters S3 bucket created
- [ ] CloudFront distribution created
- [ ] ACM certificate configured
- [ ] DNS pointed at CloudFront
- [ ] Public deployment live

No Bonecutters S3 bucket, CloudFront distribution, ACM certificate, or DNS cutover has been completed for this repository yet.

## Structure

```text
.
+-- client/                 Vite/React static website
|   +-- src/
|       +-- components/     Reusable UI components with local docs
|       +-- design/         Shared design foundations
|       +-- pages/          Page-owned UI with local docs
+-- docs/
|   +-- architecture/       Repo-level structure and diagram index
|   +-- deployment/         Public-safe S3 and CloudFront deployment docs
|   +-- design/             Frontend design and primitive rules
|   +-- operations/         Workflow and verification process
+-- tools/                  Repo-owned verification helpers
```

## Reader Path

- Repo workflow: `AGENTS.md`
- Feature process: `docs/operations/feature-development-workflow.md`
- Frontend design rules: `docs/design/frontend-design-rules.md`
- Public repository sanitization: `docs/operations/public-repository-sanitization.md`
- AWS deployment boundary: `docs/operations/aws-deployment-boundary.md`
- Deployment setup: `docs/deployment/README.md`
- Sandbox-safe verification: `docs/operations/sandbox-safe-verification.md`
- Verification gates: `docs/operations/scoped-verification-gates.md`
- Test/style linkstations: `docs/operations/test-style-linkstation-map.md`
- Project structure: `docs/architecture/project-structure.md`
- Client shell: `client/src/README.md`
- UI primitive wrappers: `client/src/components/ui/README.md`
- Home page: `client/src/pages/home/README.md`
- Site brand component: `client/src/components/site-brand/README.md`

## Local Development

Install client dependencies:

```text
npm run deps:client
```

Run the local development server:

```text
npm run dev
```

Build the static client:

```text
npm run build
```

## Verification

List available gates:

```text
npm run verify:list
```

Run the sandbox-friendly safe lane while iterating:

```text
npm run verify:safe
```

Run the modular client test lane directly:

```text
npm run verify:test
```

Check local deployment configuration without contacting AWS:

```text
npm run deploy:check
```

Ask the repo to recommend gates for the current dirty tree when human-approved Git access is appropriate:

```text
npm run verify:recommend:dirty
```

Run the normal client closeout lane:

```text
npm run verify:scoped dependency-layout,public-sanitization,client,docs
```

## Public Repository Boundary

This repository is public. Do not commit secrets, private AWS account details, live provider credentials, customer data, or machine-local private context. Deployment docs should describe structure and placeholders without exposing sensitive values.

Deployment should use Bonecutters-specific AWS resources and a Bonecutters-scoped deployment role. Do not reuse SimpleETL buckets, distributions, IAM roles, policies, or deployment scripts.

## Go-Live Checklist

The deployment checklist lives in `docs/deployment/README.md`. The final production step is pointing DNS for the public hostnames at the CloudFront distribution after the S3 origin, CloudFront configuration, TLS certificate, deployment validation, and first asset upload are complete.
