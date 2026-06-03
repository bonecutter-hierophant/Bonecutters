import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

const homePagePath = fileURLToPath(new URL("../HomePage.tsx", import.meta.url));
const homePageCssPath = fileURLToPath(new URL("../home-page.css", import.meta.url));

export function registerHomePageTests(test) {
  test("home page delegates persistent chrome to shared components", () => {
    const source = readFileSync(homePagePath, "utf8");

    assert.match(source, /import \{ SiteHeader \}/);
    assert.match(source, /import \{ SiteFooter \}/);
    assert.match(source, /import \{ DragonScrollMark \}/);
    assert.match(source, /<SiteHeader \/>/);
    assert.match(source, /<DragonScrollMark finishSectionId="name" \/>/);
    assert.match(source, /<SiteFooter \/>/);
    assert.doesNotMatch(source, /<nav className="home-page__nav"/);
    assert.doesNotMatch(source, /<footer className="home-page__footer"/);
  });

  test("home page renders the launch identity and about copy", () => {
    const source = readFileSync(homePagePath, "utf8");

    assert.match(source, /Jediah Blankenship/);
    assert.match(source, /Technology leader, software builder, and practical systems thinker/);
    assert.match(source, /I've spent the last 15 years/);
    assert.match(source, /Bonecutters is my long-running personal domain/);
    assert.match(source, /I tend to be most useful when a problem has a lot of moving parts/);
  });

  test("home page renders launch work, writing, name, and contact sections", () => {
    const source = readFileSync(homePagePath, "utf8");

    assert.match(source, /id="work"/);
    assert.match(source, /SimpleETL/);
    assert.match(source, /CatapultCMS/);
    assert.match(source, /Idea Fab Labs/);
    assert.match(source, /Tron, Tokens, and the Grid/);
    assert.match(source, /id="name"/);
    assert.match(source, /jediah@bonecutters\.us/);
  });

  test("home page keeps public launch constraints", () => {
    const source = readFileSync(homePagePath, "utf8");

    assert.doesNotMatch(source, /Chico State/i);
    assert.doesNotMatch(source, /phone/i);
    assert.doesNotMatch(source, /AWS|S3|CloudFront/);
    assert.doesNotMatch(source, /docs\.google|drive\.google/);
  });

  test("home page caps content containers while keeping section bands full bleed", () => {
    const css = readFileSync(homePageCssPath, "utf8");

    assert.doesNotMatch(css, /\.home-page\s*\{[^}]*max-width/s);
    assert.match(css, /\.home-page__copy\s*\{[^}]*max-width:\s*var\(--site-max-width\)/s);
    assert.match(css, /\.home-page__section-copy\s*\{[^}]*max-width:\s*var\(--site-max-width\)/s);
    assert.match(css, /margin-inline:\s*auto/);
  });

  test("home page lets the selected work band pass over decorative scroll art", () => {
    const css = readFileSync(homePageCssPath, "utf8");

    assert.match(css, /\.home-page__section\s*\{[^}]*position:\s*relative/s);
    assert.match(css, /\.home-page__section--work\s*\{[^}]*z-index:\s*2/s);
  });
}
