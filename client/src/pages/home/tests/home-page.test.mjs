import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

const homePagePath = fileURLToPath(new URL("../HomePage.tsx", import.meta.url));

export function registerHomePageTests(test) {
  test("home page delegates persistent chrome to shared components", () => {
    const source = readFileSync(homePagePath, "utf8");

    assert.match(source, /import \{ SiteHeader \}/);
    assert.match(source, /import \{ SiteFooter \}/);
    assert.match(source, /<SiteHeader \/>/);
    assert.match(source, /<SiteFooter \/>/);
    assert.doesNotMatch(source, /<nav className="home-page__nav"/);
    assert.doesNotMatch(source, /<footer className="home-page__footer"/);
  });

  test("home page keeps the safe fallback identity copy", () => {
    const source = readFileSync(homePagePath, "utf8");

    assert.match(source, /Jediah Blankenship/);
    assert.match(source, /Technology leader, software builder, and practical systems thinker/);
    assert.match(source, /Bonecutters is my long-running personal domain/);
  });
}
