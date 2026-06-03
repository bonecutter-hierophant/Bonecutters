import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

const siteBrandPath = fileURLToPath(new URL("../SiteBrand.tsx", import.meta.url));
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
}
