import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

const siteHeaderPath = fileURLToPath(new URL("../SiteHeader.tsx", import.meta.url));
const siteHeaderCssPath = fileURLToPath(new URL("../site-header.css", import.meta.url));

export function registerSiteHeaderTests(test) {
  test("site header composes the site brand and primary nav", () => {
    const source = readFileSync(siteHeaderPath, "utf8");

    assert.match(source, /<header/);
    assert.match(source, /className=\{`site-header/);
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

  test("site header aligns nav content to the shared site container", () => {
    const css = readFileSync(siteHeaderCssPath, "utf8");

    assert.match(css, /\.site-header__nav\s*\{[^}]*max-width:\s*var\(--site-max-width\)/s);
    assert.match(css, /\.site-header__nav\s*\{[^}]*margin-inline:\s*auto/s);
    assert.match(css, /\.site-header__nav\s*\{[^}]*padding-inline:\s*var\(--space-page\)/s);
  });

  test("site header supports stable sticky scroll state and shrinking brand treatment", () => {
    const source = readFileSync(siteHeaderPath, "utf8");
    const css = readFileSync(siteHeaderCssPath, "utf8");

    assert.match(source, /useState\(false\)/);
    assert.match(source, /isPastHeaderThreshold/);
    assert.match(source, /scrollY > 16 \? true : scrollY < 4 \? false : current/);
    assert.match(source, /setIsCompact\(isPastHeaderThreshold\)/);
    assert.match(source, /setIsScrolled\(isPastHeaderThreshold\)/);
    assert.match(source, /site-header--compact/);
    assert.match(source, /site-header--scrolled/);
    assert.match(css, /position:\s*sticky/);
    assert.match(css, /min-height:\s*var\(--site-header-expanded-height\)/);
    assert.match(css, /pointer-events:\s*none/);
    assert.match(css, /top:\s*0/);
    assert.match(css, /\.site-header__nav\s*\{[^}]*pointer-events:\s*auto/s);
    assert.match(css, /padding-block:\s*0\.625rem/);
    assert.match(css, /\.site-header__nav::before/);
    assert.match(css, /\.site-header--scrolled \.site-header__nav::before/);
  });

  test("site header exposes a mobile hamburger menu that reuses nav links", () => {
    const source = readFileSync(siteHeaderPath, "utf8");
    const css = readFileSync(siteHeaderCssPath, "utf8");

    assert.match(source, /aria-controls="site-header-menu"/);
    assert.match(source, /aria-expanded=\{isMenuOpen\}/);
    assert.match(source, /aria-label="Toggle navigation menu"/);
    assert.match(source, /data-open=\{isMenuOpen\}/);
    assert.match(source, /onClick=\{\(\) => setIsMenuOpen\(false\)\}/);
    assert.match(css, /\.site-header__menu-button/);
    assert.match(css, /\.site-header__links\[data-open="true"\]/);
  });
}
