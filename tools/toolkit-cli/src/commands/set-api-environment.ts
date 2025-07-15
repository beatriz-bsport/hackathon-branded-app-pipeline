import child_process from "child_process";
import type { Command } from "commander";
import { existsSync, writeFileSync } from "fs-extra";
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

const ENV_API_BASE_URLS: {
  [env in Env]: string;
} = {
  [ENVS.DEV]: "https://api.dev.bsport.io",
  [ENVS.LOCAL]: "http://localhost:8000",
  [ENVS.STAGING]: "https://api.staging.bsport.io",
  [ENVS.PRODUCTION]: "https://api.production.bsport.io",
  [ENVS.FEATURE_BRANCH]:
    "https://api-FEATURE-BRANCH-IDENTIFIER.chaos.bsport.io",
};

const FEATURE_BRANCH_API_IDENTIFIERS = [
  // Set 1
  "alpha",
  "beta",
  "delta",
  "epsilon",
  "eta",
  "gamma",
  "iota",
  "kappa",
  "lambda",
  "mu",
  "omega",
  "phi",
  "sigma",
  "theta",
  "zeta",
  // Set 2
  "arceus",
  "caterie",
  "charizard",
  "charmander",
  "ditto",
  "evoli",
  "goupelin",
  "jigglypuff",
  "magikarp",
  "mewtwo",
  "onix",
  "pikachu",
  "slowpoke",
  "togepi",
  "torchic",
  "totodile",
  "turtwig",
] as const;

type FeatureBranchApiIdentifier =
  (typeof FEATURE_BRANCH_API_IDENTIFIERS)[number];

async function action(
  env: Env,
  {
    quiet,
    featureBranch,
  }: {
    quiet: boolean;
    featureBranch: FeatureBranchApiIdentifier;
  },
) {
  const print = (...args) => !quiet && console.log(...args);

  print(
    `⏳ Start updating @bsport/fetch env variables to match ${env} configuration`,
  );

  const ichizenRootPath = getMonorepoBasePathSync();
  const projects = await getProjectsPackageJsons();
  const fetchPath = projects["@bsport/fetch"].path;
  const fetchAbsolutePath = path.resolve(ichizenRootPath, fetchPath);
  const envFileName = env === ENVS.LOCAL ? ".env.local" : ".env.production";
  const envFilePath = path.resolve(fetchPath, envFileName);

  // Verify the env is among accepted values
  {
    const isValidEnvironment =
      env !== ENVS.FEATURE_BRANCH && Object.values(ENVS).includes(env);
    const isValidFeatureBranch =
      env === ENVS.FEATURE_BRANCH &&
      FEATURE_BRANCH_API_IDENTIFIERS.includes(featureBranch);
    if (!isValidEnvironment && !isValidFeatureBranch) {
      print("❌ The provided environment is not recognized.");
      print(
        env === ENVS.FEATURE_BRANCH
          ? `Please provide an authorized feature branch identifier : ${FEATURE_BRANCH_API_IDENTIFIERS.join(", ")}`
          : `Please provide an authorized environment : ${Object.values(ENVS).join(", ")}`,
      );
      return;
    }
  }

  // Cleanup the build of @bsport/fetch
  {
    await exec("pnpm run clean", { cwd: fetchAbsolutePath });
  }

  // Create the env file if it does not exist
  {
    if (!existsSync(envFilePath)) {
      print(`> Create the @bsport/fetch ${envFileName} file`);
      writeFileSync(envFilePath, "");
    }
  }

  // Update VITE_API_BASE_URL
  {
    const variableName = "VITE_API_BASE_URL";
    let variableValue = ENV_API_BASE_URLS[env || ENVS.LOCAL];
    if (env === ENVS.FEATURE_BRANCH) {
      variableValue = variableValue.replace(
        "FEATURE-BRANCH-IDENTIFIER",
        featureBranch,
      );
    }
    print(`> Set variable ${variableName} to : ${variableValue}`);
    declareEnvVariable({
      filename: envFilePath,
      name: variableName,
      value: variableValue,
    });
  }

  // Update the build of @bsport/fetch and @bsport/sm-backbone to reflect variable changes
  {
    print("> Rebuild the @bsport/fetch library");
    await exec("pnpm run build", {
      cwd: fetchAbsolutePath,
    });
    print("> Rebuild the @bsport/sm-backbone library");
    const b2bBackboneAbsolutePath = path.resolve(
      ichizenRootPath,
      projects["@bsport/sm-backbone"].path,
    );
    await exec("pnpm run build", { cwd: b2bBackboneAbsolutePath });
  }

  print(
    `🚀 API Environment variables successfully set with environment ${env}`,
  );
}

export default function setApiEnvironment(program: Command) {
  program
    .command("api-environment:set")
    .description(
      "This script allows to set the API environment variables in fetch package.",
    )
    .argument(
      "<env>",
      `Environment to set for API variables. Accepted values are : ${Object.values(ENVS).join(", ")}`,
    )
    .option(
      "-fb, --feature-branch <string>",
      `Identifier of a feature branch. Accepted values are : ${FEATURE_BRANCH_API_IDENTIFIERS.join(", ")}`,
      "",
    )
    .option(
      "-q, --quiet",
      "Suppress all output, unless an error occurs.",
      false,
    )
    .action(action);
  return program;
}
