import child_process from "child_process";
import type { Command } from "commander";
import { existsSync, unlinkSync, writeFileSync } from "fs-extra";
import util from "node:util";
import path from "path";
import type { ValueOf } from "type-fest";

import {
  declareEnvVariable,
  getMonorepoBasePathSync,
  getProjectsPackageJsons,
} from "@bsport/typescript-monorepo-utils";

const exec = util.promisify(child_process.exec);

const ENVS = {
  DEV: "dev",
  LOCAL: "local",
  STAGING: "staging",
  PRODUCTION: "production",
  FEATURE_BRANCH: "feature-branch",
} as const;

type Env = ValueOf<typeof ENVS>;

type ActionOptions = {
  quiet: boolean;
  proxyUrl?: string;
  clientKey?: string;
};

const DEFAULTS = {
  [ENVS.LOCAL]: {
    proxyUrl: "http://localhost:4242/api/frontend",
    clientKey: "default:development.unleash-insecure-frontend-api-token",
  },
  [ENVS.DEV]: {
    proxyUrl: "https://unleash.tooling.bsport.io/api/frontend",
    clientKey:
      "default:development.33c0b79cf07ad244a1d63da1126b2306bc47f3c56f8f01637119d864",
  },
  [ENVS.STAGING]: {
    proxyUrl: "https://unleash.tooling.bsport.io/api/frontend",
    clientKey:
      "default:development.33c0b79cf07ad244a1d63da1126b2306bc47f3c56f8f01637119d864",
  },
  [ENVS.FEATURE_BRANCH]: {
    proxyUrl: "https://unleash.tooling.bsport.io/api/frontend",
    clientKey:
      "default:development.33c0b79cf07ad244a1d63da1126b2306bc47f3c56f8f01637119d864",
  },
  [ENVS.PRODUCTION]: {
    proxyUrl: "https://unleash.tooling.bsport.io/api/frontend",
    clientKey:
      "default:production.71464c7970fcbcc8392a28909f14b0eb221b9c21577f2c3ee611beb2",
  },
} as const satisfies Record<Env, { proxyUrl: string; clientKey: string }>;

async function action(env: Env, { quiet, proxyUrl, clientKey }: ActionOptions) {
  const print = (...args: unknown[]) => {
    if (!quiet) console.log(...args);
  };

  print(
    `⏳ Start updating @bsport/sm-backbone feature flags env variables to match ${env} configuration`,
  );

  const ichizenRootPath = getMonorepoBasePathSync();
  const projects = await getProjectsPackageJsons();
  const smBackbonePath = projects["@bsport/sm-backbone"].path;
  const smBackboneAbsolutePath = path.resolve(ichizenRootPath, smBackbonePath);
  const envFileName = env === ENVS.LOCAL ? ".env.local" : ".env.production";
  const envFilePath = path.resolve(smBackboneAbsolutePath, envFileName);

  // Validate env
  if (!Object.values(ENVS).includes(env)) {
    print("❌ The provided environment is not recognized.");
    print(
      `Please provide an authorized environment : ${Object.values(ENVS).join(", ")}`,
    );
    return;
  }

  // Remove existing env files and create a fresh one for the selected environment
  for (const fileName of [".env.local", ".env.production"]) {
    const fileAbsolutePath = path.resolve(smBackboneAbsolutePath, fileName);
    if (existsSync(fileAbsolutePath)) {
      print(`> Delete existing ${fileName} file`);
      unlinkSync(fileAbsolutePath);
    }
  }
  print(`> Create the @bsport/sm-backbone ${envFileName} file`);
  writeFileSync(envFilePath, "");

  // Resolve values with built-in defaults per environment, allow overrides via flags
  const resolvedProxyUrl = proxyUrl || DEFAULTS[env].proxyUrl;
  const resolvedClientKey = clientKey || DEFAULTS[env].clientKey;

  // Update env variables
  {
    const variableName = "VITE_UNLEASH_PROXY_URL";
    print(`> Set variable ${variableName} to : ${resolvedProxyUrl}`);
    declareEnvVariable({
      filename: envFilePath,
      name: variableName,
      value: resolvedProxyUrl,
    });
  }
  {
    const variableName = "VITE_UNLEASH_CLIENT_KEY";
    const masked =
      resolvedClientKey.length > 8
        ? `${resolvedClientKey.slice(0, 4)}…${resolvedClientKey.slice(-4)}`
        : "(hidden)";
    print(`> Set variable ${variableName} to : ${masked}`);
    declareEnvVariable({
      filename: envFilePath,
      name: variableName,
      value: resolvedClientKey,
    });
  }

  // Rebuild sm-backbone to reflect variable changes
  {
    print("> Rebuild the @bsport/sm-backbone library");
    await exec("pnpm run build", { cwd: smBackboneAbsolutePath });
  }

  print(
    `🚀 Feature Flags environment variables successfully set with environment ${env}`,
  );
}

export default function setFeatureFlagsEnvironment(program: Command) {
  program
    .command("feature-flags-environment:set")
    .description(
      "Set Unleash Feature Flags environment variables in @bsport/sm-backbone (.env.local/.env.production) and rebuild the package.",
    )
    .argument(
      "<env>",
      `Environment to set for Feature Flags variables. Accepted values are : ${Object.values(ENVS).join(", ")}`,
    )
    .option(
      "--proxy-url <string>",
      "Unleash proxy URL (e.g., http://localhost:4242/api/frontend)",
    )
    .option("--client-key <string>", "Unleash client key/token")
    .option(
      "-q, --quiet",
      "Suppress all output, unless an error occurs.",
      false,
    )
    .action(action);
  return program;
}
