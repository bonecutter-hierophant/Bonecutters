import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

const siteHeaderPath = fileURLToPath(new URL("../SiteHeader.tsx", import.meta.url));

export function registerSiteHeaderTests(test) {
  test("site header composes the site brand and primary nav", () => {
    const source = readFileSync(siteHeaderPath, "utf8");

    assert.match(source, /<header className="site-header">/);
    assert.match(source, /aria-label="Primary"/);
    assert.match(source, /<SiteBrand \/>/);
  });

  test("site header exposes the approved contact link", () => {
    const source = readFileSync(siteHeaderPath, "utf8");

    assert.match(source, /#contact/);
    assert.doesNotMatch(source, /hello@bonecutters\.us/);
  });

  test("site header exposes the launch section navigation", () => {
    const source = readFileSync(siteHeaderPath, "utf8");

    assert.match(source, /#about/);
    assert.match(source, /#work/);
    assert.match(source, /#writing/);
    assert.match(source, /#name/);
    assert.match(source, /The Name/);
  });
}
