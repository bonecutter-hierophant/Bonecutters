# Dragon Scroll Mark

This experimental component owns a decorative desktop-only scroll mark for the home page.

Local diagram: `dragon-scroll-mark.puml`.

Responsibilities:

- generate a capped dragon-curve SVG from deterministic points
- render the curve as individual line segments inside a clipped frame
- reveal segments as users scroll
- scale, rotate, and translate the curve within the fixed frame
- expand the clipping frame and SVG viewBox as the completed curve needs more room
- start zoomed into the curve origin and finish near the page section about the name
- start rotated so the first visible segment reads as a downward cue
- stay absent below `1060px` viewports
- respect reduced-motion preferences with a static state
- avoid installing scroll listeners when hidden or when reduced motion is requested

Inputs:

- browser scroll position
- `finishSectionId`, defaulting to `name`
- generated dragon curve geometry

Outputs:

- decorative `aria-hidden` SVG mark

Contract rules:

- do not add external animation dependencies for this experiment
- do not expose public copy or interactive controls
- keep the frame clipped and bounded
- do not use visible overflow for the fixed decorative frame
- keep the animation hidden below `1060px`
- pass the page-owned finish section id from the page that composes the component
- keep strokes thin with non-scaling vector strokes
- keep the component easy to remove if the experiment is abandoned

Verification:

- `npm run verify:test`
- `npm run verify:safe`
