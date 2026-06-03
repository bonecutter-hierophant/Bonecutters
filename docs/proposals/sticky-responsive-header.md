# Sticky Responsive Header Proposal

Date: 2026-06-03

## Scope

Update the persistent `SiteHeader` behavior so the header remains available while users move through the one-page site.

The feature changes should cover:

- fixed or sticky top header behavior
- smaller header logo treatment after scrolling or anchor navigation
- desktop navigation that keeps the current section links
- mobile hamburger menu with the same section links and anchor behavior
- accessible menu controls, focus states, and keyboard-operable links
- module-local tests and owner-local docs for the changed header contract

## Public-Repository Safety

This is a frontend interaction change only. Do not add:

- analytics or user tracking
- backend services
- private source links
- deployment details
- credentials or provider configuration

## Dependencies

- Existing `SiteHeader` and `SiteBrand` components
- Existing same-page section anchors: `about`, `work`, `writing`, `name`, and `contact`
- Existing Web Awesome dependency for primitive controls where practical
- Existing sandbox-safe verification lane

## Implementation Direction

1. Keep section backgrounds full bleed and preserve the shared 1440px content container.
2. Make the header stick to the top with a stable z-index and non-overlapping page offset.
3. Shrink the visible logo when the page is scrolled or when users navigate to lower sections.
4. Add a mobile hamburger control that opens and closes the same navigation links used on desktop.
5. Close the mobile menu after a nav link is selected.
6. Keep nav links as normal anchors so browser scroll behavior remains simple.
7. Update local `SiteHeader` README, PUML, CSS, and tests.

## Verification Gates

Frequent sandbox-safe check:

```text
npm run verify:safe
```

Closeout check before commit or deployment-facing review:

```text
npm run verify:scoped dependency-layout,public-sanitization,client,docs
```

## Out Of Scope

- Route-based active navigation
- Analytics
- Scroll spy behavior
- New routed pages
- AWS or deployment work

## Closeout Checklist

- [ ] Header remains available while scrolling.
- [ ] Logo shrinks after scroll or anchor navigation.
- [ ] Desktop nav keeps the current section links.
- [ ] Mobile hamburger exposes the same links.
- [ ] Mobile menu closes after selecting a link.
- [ ] Header docs and PlantUML describe the new behavior.
- [ ] Module-local header tests cover the interaction contract.
- [ ] Safe verification passes.
