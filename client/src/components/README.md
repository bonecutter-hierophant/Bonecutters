# Components

This folder owns reusable UI components.

Before adding or revising a reusable component, read:

- `../../docs/design/frontend-design-rules.md` from the repo root
- `ui/README.md` for Web Awesome primitive wrapper guidance

Each component directory should include:

- a focused implementation file
- component-owned CSS when styling is needed
- a local `README.md`
- a local PlantUML diagram

Components should be reusable across pages without owning page-level layout.

When a component has behavior or public copy worth preserving, add module-local tests under `tests/` and link them through `tools/test-client.mjs`.

Primitive policy:

- prefer Web Awesome primitives wherever they cover the interaction or control cleanly
- prefer thin Bonecutters wrappers around repeated site concepts instead of re-styling raw HTML in every section
- keep custom CSS focused on layout, composition, brand treatment, and supported primitive adjustments
- document any custom CSS that recreates a control primitive
