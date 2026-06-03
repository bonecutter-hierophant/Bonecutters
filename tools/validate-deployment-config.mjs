#!/usr/bin/env node

export const requiredVariables = [
  "BONECUTTERS_S3_BUCKET",
  "BONECUTTERS_CLOUDFRONT_DISTRIBUTION_ID",
  "BONECUTTERS_AWS_REGION",
  "BONECUTTERS_ACM_REGION",
  "BONECUTTERS_CANONICAL_HOST",
  "BONECUTTERS_ROOT_HOST"
];

const expectedValues = new Map([
  ["BONECUTTERS_ACM_REGION", "us-east-1"],
  ["BONECUTTERS_CANONICAL_HOST", "www.bonecutters.us"],
  ["BONECUTTERS_ROOT_HOST", "bonecutters.us"]
]);

const secretLikePatterns = [
  /\b(A3T[A-Z0-9]|AKIA|ASIA)[A-Z0-9]{16}\b/,
  /\bgh[pousr]_[A-Za-z0-9_]{30,}\b/,
  /-----BEGIN (RSA |DSA |EC |OPENSSH |PGP )?PRIVATE KEY-----/
];

const options = parseArgs(process.argv.slice(2));
const result = validateDeploymentConfig(process.env);

if (import.meta.url === `file://${process.argv[1]?.replaceAll("\\", "/")}` || process.argv[1]?.endsWith("validate-deployment-config.mjs")) {
  printResult(result, options);

  if (options.strict && !result.valid) {
    process.exitCode = 1;
  }
}

export function validateDeploymentConfig(env) {
  const findings = [];

  for (const name of requiredVariables) {
    const value = env[name];

    if (value === undefined || value.trim() === "") {
      findings.push({ severity: "missing", name, message: `${name} is required for strict deployment validation.` });
      continue;
    }

    if (value.includes("<") || value.includes(">")) {
      findings.push({ severity: "invalid", name, message: `${name} still looks like a placeholder.` });
    }

    if (/simpleetl/i.test(value)) {
      findings.push({ severity: "invalid", name, message: `${name} appears to reference SimpleETL.` });
    }

    if (secretLikePatterns.some((pattern) => pattern.test(value))) {
      findings.push({ severity: "invalid", name, message: `${name} looks like a credential, not deployment config.` });
    }

    const expected = expectedValues.get(name);
    if (expected !== undefined && value !== expected) {
      findings.push({ severity: "invalid", name, message: `${name} must be ${expected}.` });
    }
  }

  return {
    valid: findings.length === 0,
    findings,
    requiredVariables
  };
}

function parseArgs(args) {
  return {
    strict: args.includes("--strict")
  };
}

function printResult(result, options) {
  console.log(`Deployment config validation (${options.strict ? "strict" : "dry-run"})`);
  console.log("");
  console.log("Required variables:");
  result.requiredVariables.forEach((name) => console.log(`- ${name}`));

  if (result.findings.length === 0) {
    console.log("");
    console.log("All required variables are present and shaped correctly.");
    return;
  }

  console.log("");
  console.log("Findings:");
  result.findings.forEach((finding) => console.log(`- ${finding.severity}: ${finding.message}`));

  if (!options.strict) {
    console.log("");
    console.log("Dry-run mode does not fail on missing local deployment variables.");
  }
}
