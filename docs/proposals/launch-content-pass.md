# Launch Content Pass Proposal

Date: 2026-06-03

## Scope

Build the first launch-ready version of the Bonecutters home page using owner-provided launch copy and the approved Bonecutters logo asset.

The feature changes:

- home page section structure and navigation anchors
- persistent header navigation labels
- persistent brand presentation using the logo asset
- footer copy aligned to the launch page
- module-local tests for the changed page and components
- local README and PlantUML docs for changed page and component responsibilities

## Public-Repository Safety

This repository is public, so the proposal intentionally does not include private document URLs, private file URLs, account identifiers, phone numbers, deployment credentials, or unpublished operational details.

Launch content must avoid:

- private Bonecutters origin details excluded by the owner
- claims that imply an employer relationship not intended for the public site
- secrets, credentials, AWS account identifiers, or private bucket and distribution names
- phone numbers or other private contact data unless explicitly approved
- embarrassing placeholder copy

## Dependencies

- Owner-provided launch copy
- Owner-provided Bonecutters logo SVG
- Existing Vite, React, Web Awesome, and static-site project structure
- Existing sandbox-safe verification tooling

## Implementation Steps

1. Add the logo asset to a stable client asset location.
2. Update `SiteBrand` to render the logo while keeping an accessible home link.
3. Update `SiteHeader` with single-page navigation anchors: About, Work, Writing, The Name, and Contact.
4. Expand `HomePage` into the launch sections described by the approved copy.
5. Update `SiteFooter` copy if needed for launch alignment.
6. Update local README and PlantUML files beside each changed page or component.
7. Add or update module-local tests for the page and changed persistent components.
8. Run public sanitization and scoped verification before any commit or push.

## Verification Gates

Frequent sandbox-safe check:

```text
npm run verify:safe
```

Closeout check before commit or deployment-facing review:

```text
npm run verify:scoped dependency-layout,public-sanitization,client,docs
```

Git status, commit, push, branch, and AWS operations remain human-approved.

## Out Of Scope

- Backend services
- CMS, database, authentication, or contact form
- Analytics
- AWS, DNS, S3, CloudFront, IAM, or deployment automation changes
- New public claims beyond the owner-approved launch copy

## Closeout Checklist

- [ ] Launch copy is represented in the public site without private source links.
- [ ] Logo asset is present and used by the brand header.
- [ ] Header, home page, and footer docs describe the final behavior.
- [ ] PlantUML diagrams match the changed component and page structure.
- [ ] Module-local tests cover the changed content and persistent components.
- [ ] Public sanitization gate passes.
- [ ] Scoped verification gate passes or any required approval boundary is documented.
