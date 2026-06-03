#!/usr/bin/env node
import assert from "node:assert/strict";
import { createTestHarness } from "./test-runner.mjs";
import { requiredVariables, validateDeploymentConfig } from "./validate-deployment-config.mjs";

const harness = createTestHarness();

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

await harness.run();
