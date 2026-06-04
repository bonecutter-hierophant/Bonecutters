#!/usr/bin/env node
import { spawnSync } from "node:child_process";
import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";

const configPath = resolve(process.cwd(), ".local", "aws-project.json");
const config = loadConfig();
const deployLane = config.lanes?.deploy;
const options = parseArgs(process.argv.slice(2));

requireString(config.accountId, "accountId");
requireString(deployLane?.profile, "lanes.deploy.profile");
requireString(config.resources?.s3Bucket, "resources.s3Bucket");
requireString(config.resources?.cloudFrontDistributionId, "resources.cloudFrontDistributionId");

const profile = deployLane.profile;
const region = deployLane.region ?? config.workloadRegion;
const bucket = config.resources.s3Bucket;
const distributionId = config.resources.cloudFrontDistributionId;

console.log("Deploying Bonecutters website through the configured deploy lane.");
console.log("- lane: deploy");
console.log(`- region: ${region}`);
console.log(`- remote deletion: ${options.deleteAssets ? "enabled for hashed assets" : "disabled"}`);
console.log("");

run("aws", [
  "sts",
  "get-caller-identity",
  "--profile",
  profile,
  "--region",
  region,
  "--output",
  "json"
], { summarizeIdentity: true });

run("npm", ["run", "build"]);

const syncArgs = [
  "s3",
  "sync",
  "client/dist/assets",
  `s3://${bucket}/assets`,
  "--profile",
  profile,
  "--cache-control",
  "public,max-age=31536000,immutable"
];

if (options.deleteAssets) {
  syncArgs.push("--delete");
}

run("aws", syncArgs, { quietAws: true, successMessage: "Hashed assets uploaded." });

run("aws", [
  "s3",
  "cp",
  "client/dist/bonecutters-logo.svg",
  `s3://${bucket}/bonecutters-logo.svg`,
  "--profile",
  profile,
  "--cache-control",
  "public,max-age=3600",
  "--content-type",
  "image/svg+xml"
], { quietAws: true, successMessage: "Root logo asset uploaded." });

run("aws", [
  "s3",
  "cp",
  "client/dist/index.html",
  `s3://${bucket}/index.html`,
  "--profile",
  profile,
  "--cache-control",
  "no-cache,no-store,must-revalidate",
  "--content-type",
  "text/html; charset=utf-8"
], { quietAws: true, successMessage: "Entry document uploaded." });

run("aws", [
  "cloudfront",
  "create-invalidation",
  "--profile",
  profile,
  "--distribution-id",
  distributionId,
  "--paths",
  "/",
  "/index.html",
  "/bonecutters-logo.svg",
  "--query",
  "Invalidation.Status",
  "--output",
  "text"
], { quietAws: true, successMessage: "CloudFront invalidation submitted." });

console.log("");
console.log("Deployment submitted.");

function loadConfig() {
  if (!existsSync(configPath)) {
    fail(".local/aws-project.json is missing. Configure local AWS lane values before deploying.");
  }

  try {
    return JSON.parse(readFileSync(configPath, "utf8"));
  } catch (error) {
    fail(`Failed to parse .local/aws-project.json: ${error instanceof Error ? error.message : String(error)}`);
  }
}

function parseArgs(args) {
  return {
    deleteAssets: args.includes("--delete-assets")
  };
}

function run(command, args, options = {}) {
  const quietAws = options.quietAws === true;
  const result = spawnSync(commandName(command), args, {
    encoding: "utf8",
    stdio: options.summarizeIdentity || quietAws ? ["ignore", "pipe", "pipe"] : "inherit"
  });

  if (options.summarizeIdentity && result.status === 0) {
    const identity = JSON.parse(result.stdout);
    const accountMatches = identity.Account === config.accountId;

    if (!accountMatches) {
      fail("Deploy lane identity check failed: active account does not match local project configuration.");
    }

    console.log("Deploy lane identity check succeeded.");
    console.log("- account: matches configured account");
    console.log(`- arn: ${summarizeArn(identity.Arn)}`);
    console.log("");
  }

  if (result.status !== 0) {
    if (options.summarizeIdentity || quietAws) {
      process.stderr.write(redact(result.stderr));
    }

    process.exit(result.status ?? 1);
  }

  if (quietAws && options.successMessage !== undefined) {
    console.log(options.successMessage);
  }
}

function requireString(value, label) {
  if (typeof value !== "string" || value.trim() === "") {
    fail(`Missing required local config value: ${label}`);
  }
}

function summarizeArn(value) {
  if (typeof value !== "string" || value.trim() === "") {
    return "not returned";
  }

  const parts = value.split("/");
  return parts.length > 1 ? `.../${parts.at(-1)}` : "returned";
}

function redact(value) {
  let redacted = String(value ?? "")
    .replace(/\b\d{12}\b/g, "<account-id>")
    .replace(/arn:aws:[^\s]+/g, "<aws-arn>");

  const localValues = [
    ...Object.values(config.lanes ?? {}).map((lane) => lane?.profile),
    config.resources?.s3Bucket,
    config.resources?.cloudFrontDistributionId,
    config.accountId
  ].filter((item) => typeof item === "string" && item.trim() !== "");

  for (const item of localValues) {
    redacted = redacted.replaceAll(item, `<${classifyLocalValue(item)}>`);
  }

  return redacted;
}

function classifyLocalValue(value) {
  if (/^[A-Z0-9]{10,}$/.test(value)) {
    return "cloudfront-distribution-id";
  }

  if (value.includes("bucket") || value.includes("static") || value.includes("s3")) {
    return "s3-bucket";
  }

  if (/^\d{12}$/.test(value)) {
    return "account-id";
  }

  return "local-profile";
}

function commandName(name) {
  if (process.platform !== "win32") {
    return name;
  }

  return name === "aws" ? "aws.exe" : `${name}.cmd`;
}

function fail(message) {
  console.error(message);
  process.exit(1);
}
