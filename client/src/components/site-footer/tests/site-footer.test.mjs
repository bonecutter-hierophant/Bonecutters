import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

const siteFooterPath = fileURLToPath(new URL("../SiteFooter.tsx", import.meta.url));
const siteFooterCssPath = fileURLToPath(new URL("../site-footer.css", import.meta.url));

export function registerSiteFooterTests(test) {
  test("site footer renders the persistent public domain description", () => {
    const source = readFileSync(siteFooterPath, "utf8");

    assert.match(source, /<footer className="site-footer">/);
    assert.match(source, /Bonecutters\.us is the personal domain of Jediah Blankenship/);
    assert.match(source, /independent projects, and professional context/);
  });

  test("site footer avoids private contact and deployment details", () => {
    const source = readFileSync(siteFooterPath, "utf8");

    assert.doesNotMatch(source, /phone/i);
    assert.doesNotMatch(source, /AWS|S3|CloudFront/);
    assert.doesNotMatch(source, /secret|token|credential/i);
  });

  test("site footer aligns inner content to the shared site container", () => {
    const source = readFileSync(siteFooterPath, "utf8");
    const css = readFileSync(siteFooterCssPath, "utf8");

    assert.match(source, /className="site-footer__inner"/);
    assert.match(css, /\.site-footer__inner\s*\{[^}]*max-width:\s*var\(--site-max-width\)/s);
    assert.match(css, /\.site-footer__inner\s*\{[^}]*margin-inline:\s*auto/s);
    assert.match(css, /\.site-footer__inner\s*\{[^}]*padding:\s*1\.5rem var\(--space-page\) 2rem/s);
    assert.doesNotMatch(css, /\.site-footer p\s*\{[^}]*max-width/s);
  });
}
