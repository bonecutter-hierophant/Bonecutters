#!/usr/bin/env node
import { spawnSync } from "node:child_process";
import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";

const configPath = resolve(process.cwd(), ".local", "aws-project.json");
const allowedCommands = new Set(["list", "check", "env", "deploy-env"]);
const parsedCommand = parseCommand(process.argv.slice(2));
const command = parsedCommand.command;
const laneName = parsedCommand.laneName;
const options = {
  showValues: process.argv.includes("--show-values")
};

if (command === "help" || command === "--help" || command === "-h") {
  printHelp();
  process.exit(0);
}

if (!allowedCommands.has(command)) {
  fail(`Unknown command "${command}".`);
}

const config = loadConfig();

if (command === "list") {
  listLanes(config);
  process.exit(0);
}

if (laneName === undefined || laneName.trim() === "") {
  fail(`Command "${command}" requires a lane name.`);
}

const lane = config.lanes?.[laneName];
if (lane === undefined) {
  fail(`Lane "${laneName}" is not configured in .local/aws-project.json.`);
}

if (command === "check") {
  checkLane(config, laneName, lane);
}

if (command === "env") {
  printLaneEnv(config, laneName, lane);
}

if (command === "deploy-env") {
  printDeployEnv(config, laneName, lane);
}

function loadConfig() {
  if (!existsSync(configPath)) {
    fail([
      ".local/aws-project.json is missing.",
      "Create it from the placeholder shape in docs/deployment/README.md.",
      "Do not commit .local files."
    ].join("\n"));
  }

  try {
    return JSON.parse(readFileSync(configPath, "utf8"));
  } catch (error) {
    fail(`Failed to parse .local/aws-project.json: ${error instanceof Error ? error.message : String(error)}`);
  }
}

function parseCommand(args) {
  const first = args[0] ?? "help";
  const second = args[1];

  if (first === "help" || first === "--help" || first === "-h" || first === "list") {
    return { command: first, laneName: second };
  }

  if (allowedCommands.has(first)) {
    return { command: first, laneName: second };
  }

  if (allowedCommands.has(second)) {
    return { command: second, laneName: first };
  }

  return { command: first, laneName: second };
}

function listLanes(config) {
  const names = Object.keys(config.lanes ?? {});
  console.log("Configured AWS lanes:");

  if (names.length === 0) {
    console.log("- none");
    return;
  }

  for (const name of names) {
    const lane = config.lanes[name];
    console.log(`- ${name}: ${lane.purpose ?? "no purpose documented"}`);
  }
}

function checkLane(config, name, lane) {
  requireString(lane.profile, `${name}.profile`);
  requireString(lane.region ?? config.workloadRegion, `${name}.region or workloadRegion`);

  const response = runAws([
    "sts",
    "get-caller-identity",
    "--profile",
    lane.profile,
    "--region",
    lane.region ?? config.workloadRegion,
    "--output",
    "json"
  ]);

  if (response.status !== 0) {
    process.stderr.write(redact(response.stderr));
    process.exit(response.status ?? 1);
  }

  const identity = JSON.parse(response.stdout);
  const accountMatches =
    typeof config.accountId === "string" &&
    config.accountId.trim() !== "" &&
    identity.Account === config.accountId;
  const accountConfigured = typeof config.accountId === "string" && config.accountId.trim() !== "";

  if (accountConfigured && !accountMatches) {
    fail(`Lane "${name}" identity check failed: active account does not match local project configuration.`);
  }

  console.log(`Lane "${name}" identity check succeeded.`);
  console.log(`- account: ${accountMatches ? "matches configured account" : "not checked"}`);
  console.log(`- arn: ${summarizeArn(identity.Arn)}`);
}

function printLaneEnv(config, name, lane) {
  requireString(lane.profile, `${name}.profile`);
  console.log(`PowerShell environment for lane "${name}":`);
  printEnvLine("AWS_PROFILE", lane.profile);
  printEnvLine("AWS_REGION", lane.region ?? config.workloadRegion);
  printEnvLine("AWS_DEFAULT_REGION", lane.region ?? config.workloadRegion);
}

function printDeployEnv(config, name, lane) {
  printLaneEnv(config, name, lane);
  printEnvLine("BONECUTTERS_AWS_REGION", config.workloadRegion);
  printEnvLine("BONECUTTERS_ACM_REGION", config.acmRegion);
  printEnvLine("BONECUTTERS_CANONICAL_HOST", config.hosts?.canonical);
  printEnvLine("BONECUTTERS_ROOT_HOST", config.hosts?.root);
  printEnvLine("BONECUTTERS_S3_BUCKET", config.resources?.s3Bucket);
  printEnvLine("BONECUTTERS_CLOUDFRONT_DISTRIBUTION_ID", config.resources?.cloudFrontDistributionId);
}

function printEnvLine(name, value) {
  if (options.showValues) {
    console.log(`$env:${name}="${value ?? ""}"`);
    return;
  }

  console.log(`$env:${name}="<local-${name.toLowerCase()}>"`);
}

function runAws(args) {
  return spawnSync(commandName("aws"), args, {
    encoding: "utf8",
    stdio: ["ignore", "pipe", "pipe"]
  });
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
  return process.platform === "win32" ? `${name}.exe` : name;
}

function printHelp() {
  console.log("AWS lane helper");
  console.log("");
  console.log("Usage:");
  console.log("  npm run aws:lane -- list");
  console.log("  npm run aws:lane -- <lane> check");
  console.log("  npm run aws:lane -- <lane> env");
  console.log("  npm run aws:lane -- <lane> deploy-env");
  console.log("  npm run aws:lane -- <lane> deploy-env -- --show-values");
  console.log("");
  console.log("Local config: .local/aws-project.json");
}

function fail(message) {
  console.error(message);
  process.exit(1);
}
