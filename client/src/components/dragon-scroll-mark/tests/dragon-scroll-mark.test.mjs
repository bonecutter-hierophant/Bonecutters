import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

const componentPath = fileURLToPath(new URL("../DragonScrollMark.tsx", import.meta.url));
const geometryPath = fileURLToPath(new URL("../dragonCurve.ts", import.meta.url));
const cssPath = fileURLToPath(new URL("../dragon-scroll-mark.css", import.meta.url));

export function registerDragonScrollMarkTests(test) {
  test("dragon scroll mark caps curve generation at a modest order", () => {
    const source = readFileSync(geometryPath, "utf8");

    assert.match(source, /MAX_DRAGON_ORDER = 10/);
    assert.match(source, /throw new Error/);
    assert.match(source, /generateDragonSegments/);
    assert.match(source, /Math\.log2\(totalSegments\)/);
    assert.match(source, /visibleDragonOrder/);
    assert.match(source, /Math\.pow\(2, visibleDragonOrder\(totalSegments, progress\)\)/);
  });

  test("dragon scroll mark renders decorative SVG line segments", () => {
    const source = readFileSync(componentPath, "utf8");

    assert.match(source, /aria-hidden="true"/);
    assert.match(source, /finishSectionId = "name"/);
    assert.match(source, /<svg/);
    assert.match(source, /<line/);
    assert.match(source, /document\.getElementById\(finishSectionId\)/);
    assert.match(source, /window\.matchMedia\(desktopQuery\)/);
    assert.match(source, /window\.matchMedia\(reducedMotionQuery\)/);
    assert.match(source, /setIsDesktop\(desktop\.matches\)/);
    assert.match(source, /setPrefersReducedMotion\(reducedMotion\.matches\)/);
    assert.match(source, /if \(!isDesktop \|\| prefersReducedMotion\)/);
    assert.match(source, /if \(!isDesktop\)/);
    assert.match(source, /const markProgress = prefersReducedMotion \? 1 : progress/);
    assert.match(source, /prefersReducedMotion \? segments\.length : visibleSegmentCount/);
    assert.match(source, /window\.requestAnimationFrame/);
    assert.match(source, /prefersReducedMotion \? MAX_DRAGON_ORDER : visibleDragonOrder/);
    assert.match(source, /14 \/ Math\.pow\(2, \(visibleOrder - 1\) \/ 1\.25\)/);
    assert.match(source, /const revealRotationProgress = \(revealedSegments - 2\) \/ \(segments\.length - 2\)/);
    assert.match(source, /const rotationProgress = \(markProgress \+ revealRotationProgress\) \/ 2/);
    assert.match(source, /const rotation = 135 \+ rotationProgress \* 180/);
    assert.match(source, /translate\(\$\{targetX\} \$\{targetY\}\) rotate/);
    assert.match(source, /const frameSize = 250 \+ markProgress \* 170/);
    assert.match(source, /const viewBoxOrigin = -frameSize \/ 2/);
    assert.match(source, /viewBox=\{`\$\{viewBoxOrigin\} \$\{viewBoxOrigin\} \$\{frameSize\} \$\{frameSize\}`\}/);
    assert.doesNotMatch(source, /markProgress > 0\.78/);
    assert.doesNotMatch(source, /dragon-scroll-mark--unclipped/);
    assert.match(source, /const targetY = 56 - markProgress \* 71/);
    assert.match(source, /dragon-scroll-mark--static/);
    assert.match(source, /height:\s*`\$\{frameSize\}px`/);
    assert.match(source, /width:\s*`\$\{frameSize\}px`/);
    assert.match(source, /opacity=\{index < revealedSegments \? 1 : 0\}/);
    assert.doesNotMatch(source, /canvas|p5/i);
  });

  test("dragon scroll mark is clipped, desktop-only, and reduced-motion aware", () => {
    const css = readFileSync(cssPath, "utf8");

    assert.match(css, /\.dragon-scroll-mark\s*\{[^}]*display:\s*none/s);
    assert.match(css, /@media \(min-width:\s*1060px\)/);
    assert.match(css, /overflow:\s*hidden/);
    assert.doesNotMatch(css, /overflow:\s*visible/);
    assert.doesNotMatch(css, /dragon-scroll-mark--unclipped/);
    assert.match(css, /inset-block-start:\s*calc\(min\(58vh,\s*34rem\) - 130px\)/);
    assert.match(css, /inset-inline-end:\s*max\(0\.75rem,\s*calc\(\(100vw - var\(--site-max-width\)\) \/ 2 \+ var\(--space-page\) - 75px\)\)/);
    assert.match(css, /transition:\s*opacity 120ms linear/);
    assert.match(css, /stroke-width:\s*1\.5/);
    assert.match(css, /vector-effect:\s*non-scaling-stroke/);
    assert.match(css, /prefers-reduced-motion:\s*reduce/);
    assert.match(css, /\.dragon-scroll-mark--static\s*\{[^}]*opacity:\s*0\.32/s);
    assert.match(css, /@media \(prefers-reduced-motion:\s*reduce\) and \(min-width:\s*1060px\)/);
    assert.doesNotMatch(css, /transform:\s*rotate\(0deg\) scale\(1\) !important/);
  });
}
