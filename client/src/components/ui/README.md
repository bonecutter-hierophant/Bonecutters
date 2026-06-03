# UI Primitive Wrappers

This folder is reserved for thin Bonecutters wrappers around repeated Web Awesome primitive patterns.

Local diagram: `ui-primitives.puml`.

Responsibilities:

- keep repeated primitive usage consistent
- wrap Web Awesome controls only when a site-level pattern repeats
- avoid page-specific layout or copy

Inputs:

- Web Awesome React primitives from `@awesome.me/webawesome/dist/react`
- repo-level rules in `docs/design/frontend-design-rules.md`

Outputs:

- optional thin wrapper components for repeated buttons, cards, badges, callouts, and other controls

Contract rules:

- use Web Awesome directly on a page until repetition justifies a wrapper
- wrappers should stay thin and preserve primitive behavior
- custom CSS that recreates a primitive must be explained in the owner README
- page layout belongs in page folders, not in primitive wrappers

Verification:

- `npm run verify:client`
- `npm run verify:docs`
