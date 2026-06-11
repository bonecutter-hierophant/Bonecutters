#!/usr/bin/env node
import { spawnSync } from "node:child_process";
import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { extname, join, resolve } from "node:path";

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
const distRoot = resolve(process.cwd(), "client", "dist");

console.log("Deploying Bonecutters website through the configured deploy lane.");
console.log("- lane: deploy");
console.log(`- region: ${region}`);
console.log(`- remote deletion: ${options.deleteAssets ? "enabled for hashed assets" : "disabled"}`);
console.log("");

checkDeployIdentity();

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

const rootAssetPaths = uploadRootAssets();

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
  ...rootAssetPaths.map((assetPath) => `/${assetPath}`),
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
    shell: process.platform === "win32" && command !== "aws",
    stdio: quietAws ? ["ignore", "pipe", "pipe"] : "inherit"
  });

  if (result.error !== undefined) {
    process.stderr.write(redact(result.error.message));
    process.stderr.write("\n");
    process.exit(1);
  }

  if (result.status !== 0) {
    if (quietAws) {
      process.stderr.write(redact(result.stderr));
    }

    process.exit(result.status ?? 1);
  }

  if (quietAws && options.successMessage !== undefined) {
    console.log(options.successMessage);
  }
}

function uploadRootAssets() {
  const rootAssets = readdirSync(distRoot)
    .filter((entry) => entry !== "index.html")
    .filter((entry) => statSync(join(distRoot, entry)).isFile())
    .sort();

  for (const assetPath of rootAssets) {
    run("aws", [
      "s3",
      "cp",
      join("client", "dist", assetPath),
      `s3://${bucket}/${assetPath}`,
      "--profile",
      profile,
      "--cache-control",
      "public,max-age=3600",
      "--content-type",
      contentTypeFor(assetPath)
    ], { quietAws: true });
  }

  console.log(`Root asset${rootAssets.length === 1 ? "" : "s"} uploaded: ${rootAssets.join(", ")}`);

  return rootAssets;
}

function contentTypeFor(filePath) {
  const extension = extname(filePath).toLowerCase();
  const contentTypes = new Map([
    [".css", "text/css; charset=utf-8"],
    [".html", "text/html; charset=utf-8"],
    [".ico", "image/x-icon"],
    [".jpg", "image/jpeg"],
    [".jpeg", "image/jpeg"],
    [".js", "text/javascript; charset=utf-8"],
    [".png", "image/png"],
    [".svg", "image/svg+xml"],
    [".webp", "image/webp"]
  ]);

  return contentTypes.get(extension) ?? "application/octet-stream";
}

function checkDeployIdentity() {
  const identityArgs = [
    "sts",
    "get-caller-identity",
    "--profile",
    profile,
    "--region",
    region,
    "--output",
    "json"
  ];

  const firstAttempt = runForOutput("aws", identityArgs);

  if (firstAttempt.status === 0) {
    summarizeIdentity(firstAttempt.stdout);
    return;
  }

  console.log("Deploy lane session is not active. Starting AWS sign-in for the deploy lane.");
  run("aws", ["sso", "login", "--profile", profile], { quietAws: false });

  const secondAttempt = runForOutput("aws", identityArgs);
  if (secondAttempt.status !== 0) {
    process.stderr.write(redact(secondAttempt.stderr));
    process.exit(secondAttempt.status ?? 1);
  }

  summarizeIdentity(secondAttempt.stdout);
}

function runForOutput(command, args) {
  const result = spawnSync(commandName(command), args, {
    encoding: "utf8",
    shell: process.platform === "win32" && command !== "aws",
    stdio: ["ignore", "pipe", "pipe"]
  });

  if (result.error !== undefined) {
    return {
      status: 1,
      stdout: "",
      stderr: result.error.message
    };
  }

  return result;
}

function summarizeIdentity(stdout) {
  const identity = JSON.parse(stdout);
  const accountMatches = identity.Account === config.accountId;

  if (!accountMatches) {
    fail("Deploy lane identity check failed: active account does not match local project configuration.");
  }

  console.log("Deploy lane identity check succeeded.");
  console.log("- account: matches configured account");
  console.log(`- arn: ${summarizeArn(identity.Arn)}`);
  console.log("");
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
