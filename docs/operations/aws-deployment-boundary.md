# AWS Deployment Boundary

Date: 2026-06-03

Bonecutters should be deployed as its own isolated static-site workload inside the owner's AWS account. A separate AWS account is not required for V1, but Bonecutters resources must be clearly separated from SimpleETL by IAM role, resource names, tags, deployment scripts, and documentation.

## Boundary Goals

- No AWS credentials, access keys, tokens, or secrets are committed to the repository.
- Bonecutters does not reuse SimpleETL buckets, CloudFront distributions, IAM roles, policies, deployment scripts, or hosted resource names.
- Human access uses the owner's normal AWS sign-in path and assumes a Bonecutters-scoped role or permission set.
- Automation uses temporary credentials from the Bonecutters deployment role.
- S3 remains private behind CloudFront when feasible.
- The SimpleETL subdomain and deployment boundary remain untouched.

## Recommended V1 Shape

- S3 bucket: one private bucket for the built `client/dist` assets.
- CloudFront distribution: one distribution for `www.bonecutters.us`.
- Root domain: redirect `bonecutters.us` to `www.bonecutters.us` through CloudFront.
- Access control: use CloudFront Origin Access Control for the S3 origin, with S3 Block Public Access kept enabled where feasible.
- IAM: create a Bonecutters-specific deployment role or IAM Identity Center permission set before any deployment.
- Tags: apply a consistent project tag such as `Project=Bonecutters` to AWS resources.

## Current Deployment State

As of this document state, V1 is live. The Bonecutters website AWS account contains a project-specific private S3 origin bucket, issued ACM certificate, CloudFront Origin Access Control, CloudFront distribution, and deployed static build. The canonical `www` host is served through CloudFront, and the root domain forwards to the canonical host.

- [x] Local deployment documentation exists.
- [x] Local deployment configuration validation exists.
- [x] Bonecutters AWS resources are provisioned for V1 hosting.
- [x] Bonecutters static assets are deployed to the private origin bucket.
- [x] Public DNS and forwarding route visitors to the CloudFront-backed site.

## IAM Guidance

Prefer temporary credentials through IAM roles or IAM Identity Center. Do not create long-lived access keys for this repository unless a future workflow is explicitly approved and documented.

Use separate access lanes instead of one broad operator credential:

- Provisioning lane: human-approved setup access for IAM, S3, CloudFront, ACM, and DNS work.
- Routine deployment lane: human-approved deploy access for static asset upload and CloudFront invalidation only.
- Optional read-only inspection lane: local AWS Console, AWS Toolkit, or CLI inspection without mutation.

Local AWS profile names belong on the operator machine only. Committed docs should use placeholders such as `<bonecutters-provisioning-profile>`, `<bonecutters-deploy-profile>`, and `<bonecutters-readonly-profile>` when an example needs to name a credential lane.

The routine deployment role should be scoped to Bonecutters resources only:

- read/write deployment assets in the Bonecutters S3 bucket
- create invalidations for the Bonecutters CloudFront distribution
- read deployment state only if a future infrastructure tool needs it
- avoid permissions for SimpleETL resources

The provisioning role or permission set may need broader setup permissions while resources are being created, but it should still be used only for Bonecutters infrastructure and should not mutate SimpleETL resources.

The read-only inspection lane should not be able to create, update, delete, upload, invalidate, or change DNS.

## Deployment Rules

- Do not add live account IDs, access keys, or secret values to docs, scripts, `.env` files, or examples.
- Do not add live bucket names, CloudFront distribution IDs, hosted zone IDs, ARNs, account aliases, or local AWS profile names to committed docs.
- Use placeholders for account-specific and machine-local values in documentation.
- Keep deployment scripts project-local and named for Bonecutters.
- Treat every AWS, DNS, S3, CloudFront, IAM, and deployment command as human-approved.
- Run `npm run verify:scoped dependency-layout,public-sanitization,deployment-config,client,docs` before publishing deployment-related changes.
- Review generated files before push; push means public.

## AWS References

- IAM security best practices: https://docs.aws.amazon.com/IAM/latest/UserGuide/best-practices.html
- IAM roles: https://docs.aws.amazon.com/IAM/latest/UserGuide/id_roles.html
- IAM Identity Center credentials: https://docs.aws.amazon.com/singlesignon/latest/userguide/howtogetcredentials.html
- S3 access control best practices: https://docs.aws.amazon.com/AmazonS3/latest/userguide/access-control-best-practices.html
- CloudFront Origin Access Control for S3 origins: https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/private-content-restricting-access-to-s3.html
