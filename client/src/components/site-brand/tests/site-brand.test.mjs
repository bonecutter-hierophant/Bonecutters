import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

const siteBrandPath = fileURLToPath(new URL("../SiteBrand.tsx", import.meta.url));
const siteBrandCssPath = fileURLToPath(new URL("../site-brand.css", import.meta.url));
const logoPath = fileURLToPath(new URL("../../../../public/bonecutters-logo.svg", import.meta.url));

export function registerSiteBrandTests(test) {
  test("site brand renders the approved logo asset as a decorative mark", () => {
    const source = readFileSync(siteBrandPath, "utf8");
    const logo = readFileSync(logoPath, "utf8");

    assert.match(source, /src="\/bonecutters-logo\.svg"/);
    assert.match(source, /alt=""/);
    assert.match(source, /aria-hidden="true"/);
    assert.match(logo, /<svg\b/);
    assert.match(logo, /id="Bonecutters"/);
  });

  test("site brand keeps the accessible home link contract", () => {
    const source = readFileSync(siteBrandPath, "utf8");

    assert.match(source, /href="\/"/);
    assert.match(source, /aria-label="Bonecutters home"/);
    assert.match(source, /Bonecutters/);
  });

  test("site brand scales the wide logo within header breakpoints", () => {
    const css = readFileSync(siteBrandCssPath, "utf8");

    assert.match(css, /height:\s*clamp\(4\.75rem,\s*10vw,\s*8\.5rem\)/);
    assert.match(css, /width:\s*auto/);
  });
}
