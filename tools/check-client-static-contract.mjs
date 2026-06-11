#!/usr/bin/env node
import { existsSync, readFileSync, statSync } from "node:fs";
import { extname, join } from "node:path";
import { fileURLToPath } from "node:url";

const repoRoot = fileURLToPath(new URL("..", import.meta.url));
const clientRoot = join(repoRoot, "client");
const indexPath = join(clientRoot, "index.html");
const publicRoot = join(clientRoot, "public");
const failures = [];

const indexHtml = readText("client/index.html", indexPath);

if (indexHtml !== null) {
  checkIndexShell(indexHtml);
  checkLinkedPublicAssets(indexHtml);
  checkFavicon(indexHtml);
}

if (failures.length > 0) {
  console.error("Client static contract check failed:");
  failures.forEach((failure) => console.error(`- ${failure}`));
  process.exitCode = 1;
}

function checkIndexShell(content) {
  requireMatch("client/index.html", content, /<html\s+lang="en"/, "declares the English document language");
  requireMatch("client/index.html", content, /<meta\s+name="viewport"\s+content="width=device-width,\s*initial-scale=1\.0"/, "keeps the responsive viewport meta tag");
  requireMatch("client/index.html", content, /<div\s+id="root"><\/div>/, "keeps the React root element");
  requireMatch("client/index.html", content, /<script\s+type="module"\s+src="\/src\/main\.tsx"><\/script>/, "loads the Vite React entry module");
  requireMatch("client/index.html", content, /<link\s+rel="canonical"\s+href="https:\/\/www\.bonecutters\.us\/"/, "keeps the canonical public URL");
}

function checkLinkedPublicAssets(content) {
  const publicAssetPattern = /\b(?:href|src|content)="(\/[^"#?]+\.(?:png|svg|ico|webp|jpg|jpeg))"/gi;
  const matches = [...content.matchAll(publicAssetPattern)];

  if (matches.length === 0) {
    failures.push("client/index.html does not reference any public image assets");
  }

  for (const match of matches) {
    const assetPath = match[1];
    const relativePath = assetPath.slice(1);
    const absolutePath = join(publicRoot, relativePath);

    if (!existsSync(absolutePath)) {
      failures.push(`client/index.html references missing public asset ${assetPath}`);
      continue;
    }

    const stat = statSync(absolutePath);
    if (!stat.isFile()) {
      failures.push(`client/index.html references non-file public asset ${assetPath}`);
    }
  }
}

function checkFavicon(content) {
  const faviconMatch = content.match(/<link\s+rel="icon"[^>]*href="([^"]+)"[^>]*>/);

  if (faviconMatch === null) {
    failures.push("client/index.html is missing a favicon link");
    return;
  }

  const faviconTag = faviconMatch[0];
  const faviconHref = faviconMatch[1];

  requireMatch("client/index.html", faviconTag, /type="image\/png"/, "uses a PNG favicon type");
  requireMatch("client/index.html", faviconTag, /sizes="64x64"/, "declares the favicon size");

  if (!faviconHref.startsWith("/")) {
    failures.push(`client/index.html favicon href must be an absolute public path, found ${faviconHref}`);
    return;
  }

  const faviconPath = join(publicRoot, faviconHref.slice(1));
  if (!existsSync(faviconPath)) {
    failures.push(`client/index.html favicon asset is missing at ${faviconHref}`);
    return;
  }

  if (extname(faviconPath).toLowerCase() !== ".png") {
    failures.push(`client/index.html favicon asset should be a PNG, found ${faviconHref}`);
    return;
  }

  const faviconBytes = readFileSync(faviconPath);
  const pngSignature = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);

  if (!faviconBytes.subarray(0, pngSignature.length).equals(pngSignature)) {
    failures.push(`client/index.html favicon asset is not a valid PNG file: ${faviconHref}`);
  }
}

function requireMatch(filePath, content, pattern, description) {
  if (!pattern.test(content)) {
    failures.push(`${filePath} must ${description}`);
  }
}

function readText(filePath, absolutePath) {
  if (!existsSync(absolutePath)) {
    failures.push(`${filePath} is missing`);
    return null;
  }

  return readFileSync(absolutePath, "utf8");
}
