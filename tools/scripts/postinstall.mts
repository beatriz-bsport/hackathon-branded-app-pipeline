#!/usr/bin/env node
import { spawnSync } from "node:child_process";

if (process.env.ICHIZEN_SKIP_POSTINSTALL === "true") {
  console.log(
    "Skipping Ichizen postinstall because ICHIZEN_SKIP_POSTINSTALL=true",
  );
  process.exit(0);
}

const result = spawnSync(
  "pnpm",
  ["exec", "nx", "run-many", "--target=build", "--projects=tag:postinstall"],
  {
    shell: process.platform === "win32",
    stdio: "inherit",
  },
);

process.exit(result.status ?? 1);
