# Project Structure

Bonecutters is a public Vite/React static website intended to build into static files for S3 and CloudFront hosting at `www.bonecutters.us`.

```text
.
+-- client/                 Vite/React static website
|   +-- src/
|       +-- components/     Reusable UI components with local docs
|       +-- pages/          Page-owned UI with local docs
|       +-- design/         Shared design foundations
+-- docs/
|   +-- architecture/       Repo-level architecture docs and diagrams
|   +-- design/             Frontend design and primitive rules
|   +-- operations/         Workflow and verification docs
+-- tools/                  Repo-owned verification helpers
```

The client is intentionally small. New directories should be added only when they clarify ownership for pages, reusable components, deployment, or verification.

Frontend implementation starts from `docs/design/frontend-design-rules.md`: use Web Awesome primitives first, keep CSS minimal and owner-local, and include local README/PlantUML files for pages and reusable components.

AWS deployment planning starts from `docs/operations/aws-deployment-boundary.md`: Bonecutters should use project-specific AWS resources and must not reuse SimpleETL deployment resources.
