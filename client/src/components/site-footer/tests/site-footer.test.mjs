import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

const siteFooterPath = fileURLToPath(new URL("../SiteFooter.tsx", import.meta.url));

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
}
