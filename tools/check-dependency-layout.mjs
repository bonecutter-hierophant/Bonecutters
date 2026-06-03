#!/usr/bin/env node
import { existsSync, lstatSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

// Contract: dependency-layout verification is read-only. It checks package
// metadata and ignored dependency links without installing or deleting anything.
const repoRoot = fileURLToPath(new URL("..", import.meta.url));
const packageRoots = ["client"];
const repoPackageName = "bonecutters";
const failures = [];

for (const packageRoot of packageRoots) {
  checkPackageFile(packageRoot, "package.json", { required: true });
  checkPackageFile(packageRoot, "package-lock.json", { required: false });
  checkSelfLink(packageRoot);
}

if (failures.length > 0) {
  console.error("Dependency layout check failed:");
  failures.forEach((failure) => console.error(`- ${failure}`));
  process.exitCode = 1;
}

function checkPackageFile(packageRoot, fileName, { required }) {
  const filePath = join(repoRoot, packageRoot, fileName);

  if (!existsSync(filePath)) {
    if (required) {
      failures.push(`${packageRoot}/${fileName} is missing`);
    }
    return;
  }

  const parsed = JSON.parse(readFileSync(filePath, "utf8"));

  if (hasRecursiveDependency(parsed)) {
    failures.push(`${packageRoot}/${fileName} contains a recursive ${repoPackageName} dependency`);
  }
}

function hasRecursiveDependency(value) {
  if (value === null || typeof value !== "object") {
    return false;
  }

  if (Object.prototype.hasOwnProperty.call(value, repoPackageName)) {
    return true;
  }

  return Object.values(value).some(hasRecursiveDependency);
}

function checkSelfLink(packageRoot) {
  const linkPath = join(repoRoot, packageRoot, "node_modules", repoPackageName);

  if (!existsSync(linkPath)) {
    return;
  }

  const stat = lstatSync(linkPath);
  failures.push(
    `${packageRoot}/node_modules/${repoPackageName} exists${stat.isSymbolicLink() ? " as a link" : ""}`
  );
}
