# Scroll Animation Experiment Proposal

Date: 2026-06-03

## Scope

Prototype a decorative scroll-linked animation in the desktop right-side visual lane of the home page.

The first candidate is a dragon-curve SVG mark, but the proposal intentionally leaves room to replace it with another lightweight vector animation if the curve does not work visually.

The experiment may change:

- add a removable decorative component for the scroll animation
- render a lightweight SVG object inside a clipped desktop-only frame
- reveal or transform vector elements as users scroll
- scale, rotate, or translate the visual within a fixed frame
- keep the effect hidden or static for mobile and reduced-motion users
- keep the component removable if the visual feels distracting

## Public-Repository Safety

This is a local frontend visual experiment only. Do not add:

- analytics or user tracking
- external runtime dependencies without a follow-up decision
- private source links
- deployment details
- credentials or provider configuration

## Dependencies

- Existing React client
- Existing home page section layout
- Native SVG or similarly lightweight vector rendering
- Existing sandbox-safe verification lane

P5.js is intentionally out of scope for the first prototype. The first candidate animation is small enough to generate directly and render as SVG.

## Implementation Direction

1. Keep the experiment behind a single removable component boundary.
2. Place the visual inside a clipped frame of about `250px` square.
3. Use the desktop right-side visual lane and hide the effect on mobile viewports.
4. Respect `prefers-reduced-motion` by showing a static decorative state.
5. Start with a dragon-curve candidate that begins as a simple chevron/downward cue.
6. Reveal additional vector detail as users scroll.
7. Rotate slowly from the top to the bottom of the page, aiming for casual movement rather than a spinning effect.
8. Add component-local README, PlantUML, CSS, and tests if the experiment survives the first visual pass.
9. Compose the component into the home page without changing public copy.

## Verification Gates

Frequent sandbox-safe check:

```text
npm run verify:safe
```

Closeout check before committing an accepted animation:

```text
npm run verify:scoped dependency-layout,public-sanitization,client,docs
```

## Out Of Scope

- Photos or raster imagery
- Mobile animation
- Scroll spy navigation
- AWS or deployment work
- Committing the experiment before it earns its place visually

## Closeout Checklist

- [ ] Candidate animation is selected.
- [ ] Visual frame is clipped and does not exceed the reserved desktop lane.
- [ ] Initial state reads clearly at the top of the page.
- [ ] Scroll behavior is slow and intentional.
- [ ] Reduced-motion behavior is static.
- [ ] Component can be removed cleanly if abandoned.
- [ ] Component docs and PlantUML exist if accepted.
- [ ] Module-local tests cover rendering contracts if accepted.
- [ ] Safe verification passes.
