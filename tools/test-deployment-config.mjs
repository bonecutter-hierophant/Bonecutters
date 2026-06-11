#!/usr/bin/env node
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { createTestHarness } from "./test-runner.mjs";
import { requiredVariables, validateDeploymentConfig } from "./validate-deployment-config.mjs";

const harness = createTestHarness();
const deployAwsPath = fileURLToPath(new URL("deploy-aws.mjs", import.meta.url));

harness.test("deployment config validator documents required Bonecutters variables", () => {
  const required = new Set(requiredVariables);

  [
    "BONECUTTERS_S3_BUCKET",
    "BONECUTTERS_CLOUDFRONT_DISTRIBUTION_ID",
    "BONECUTTERS_AWS_REGION",
    "BONECUTTERS_ACM_REGION",
    "BONECUTTERS_CANONICAL_HOST",
    "BONECUTTERS_ROOT_HOST"
  ].forEach((name) => assert.equal(required.has(name), true));
});

harness.test("deployment config validator accepts shaped Bonecutters config", () => {
  const result = validateDeploymentConfig({
    BONECUTTERS_S3_BUCKET: "bonecutters-static-example",
    BONECUTTERS_CLOUDFRONT_DISTRIBUTION_ID: "EXAMPLE123456",
    BONECUTTERS_AWS_REGION: "us-west-2",
    BONECUTTERS_ACM_REGION: "us-east-1",
    BONECUTTERS_CANONICAL_HOST: "www.bonecutters.us",
    BONECUTTERS_ROOT_HOST: "bonecutters.us"
  });

  assert.equal(result.valid, true);
});

harness.test("deployment config validator rejects SimpleETL references and wrong hosts", () => {
  const result = validateDeploymentConfig({
    BONECUTTERS_S3_BUCKET: "simpleetl-static-example",
    BONECUTTERS_CLOUDFRONT_DISTRIBUTION_ID: "EXAMPLE123456",
    BONECUTTERS_AWS_REGION: "us-west-2",
    BONECUTTERS_ACM_REGION: "us-west-2",
    BONECUTTERS_CANONICAL_HOST: "bonecutters.us",
    BONECUTTERS_ROOT_HOST: "www.bonecutters.us"
  });

  assert.equal(result.valid, false);
  assert.equal(result.findings.some((finding) => /SimpleETL/.test(finding.message)), true);
  assert.equal(result.findings.some((finding) => /BONECUTTERS_ACM_REGION/.test(finding.message)), true);
});

harness.test("deployment helper publishes root assets from the built client", () => {
  const source = readFileSync(deployAwsPath, "utf8");

  assert.match(source, /function uploadRootAssets\(\)/);
  assert.match(source, /entry !== "index\.html"/);
  assert.match(source, /statSync\(join\(distRoot, entry\)\)\.isFile\(\)/);
  assert.match(source, /contentTypeFor\(assetPath\)/);
  assert.match(source, /rootAssetPaths\.map\(\(assetPath\) => `\/\$\{assetPath\}`\)/);
  assert.match(source, /\["\.png", "image\/png"\]/);
  assert.doesNotMatch(source, /client\/dist\/bonecutters-logo\.svg/);
});

await harness.run();
