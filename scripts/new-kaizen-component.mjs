#!/usr/bin/env node

import { spawnSync } from "node:child_process";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const scriptDirectory = dirname(fileURLToPath(import.meta.url));
const repoRoot = resolve(scriptDirectory, "..");

const targets = {
  primitive: "packages/design-system/kaizen/primitive/core",
  business: "packages/design-system/kaizen/business",
};

const args = process.argv.slice(2);

const printUsage = () => {
  process.stdout.write(
    [
      "Usage: pnpm new:kaizen-component -- --target primitive|business",
      "",
      "Examples:",
      "  pnpm new:kaizen-component -- --target primitive",
      "  pnpm new:kaizen-component -- --target business",
    ].join("\n"),
  );
};

if (args.includes("--help") || args.includes("-h")) {
  printUsage();
  process.stdout.write("\n");
  process.exit(0);
}

const targetFlagIndex = args.indexOf("--target");
const target = targetFlagIndex >= 0 ? args[targetFlagIndex + 1] : undefined;

if (!target || !(target in targets)) {
  printUsage();
  process.stdout.write("\n");
  process.exit(1);
}

const forwardedArgs =
  targetFlagIndex >= 0
    ? [...args.slice(0, targetFlagIndex), ...args.slice(targetFlagIndex + 2)]
    : args;

const commandResult = spawnSync(
  "pnpm",
  ["run", "component:add", ...forwardedArgs],
  {
    cwd: resolve(repoRoot, targets[target]),
    stdio: "inherit",
  },
);

if (typeof commandResult.status === "number") {
  process.exit(commandResult.status);
}

process.exit(1);
