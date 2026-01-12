import {
  type CreateNodesContextV2,
  type CreateNodesV2,
  type TargetConfiguration,
  createNodesFromFiles,
} from "@nx/devkit";
import { readFileSync, readdirSync } from "fs";
import { dirname, join } from "path";

export interface NxFederationPluginOptions {
  devTargetName?: string;
  devSingleTargetName?: string;
  watchDeps?: boolean;
}

const packageJsonGlob = "**/package.json";

export const createNodesV2: CreateNodesV2<NxFederationPluginOptions> = [
  packageJsonGlob,
  async (configFiles, options, context) => {
    return await createNodesFromFiles(
      (configFile, opts, ctx) =>
        createNodesInternal(configFile, opts ?? {}, ctx),
      configFiles,
      options,
      context,
    );
  },
];

function createNodesInternal(
  configFilePath: string,
  options: NxFederationPluginOptions,
  context: CreateNodesContextV2,
) {
  const projectRoot = dirname(configFilePath);

  // Skip root package.json
  if (projectRoot === ".") {
    return {};
  }

  // Only process studio-manager apps
  if (!configFilePath.includes("studio-manager")) {
    return {};
  }

  // Check if this is an Nx project (has package.json)
  const siblingFiles = readdirSync(join(context.workspaceRoot, projectRoot));
  const hasPackageJson = siblingFiles.includes("package.json");

  if (!hasPackageJson) {
    return {};
  }

  // Read package.json
  let packageJson: { federation?: { devPort?: number } };
  try {
    const content = readFileSync(
      join(context.workspaceRoot, configFilePath),
      "utf-8",
    );
    packageJson = JSON.parse(content);
  } catch {
    return {};
  }

  // Only process packages with federation.devPort
  if (!packageJson.federation?.devPort) {
    return {};
  }

  const devTargetName = options.devTargetName ?? "dev-mfe";
  const devSingleTargetName = options.devSingleTargetName ?? "dev-mfe:single";

  const devTarget: TargetConfiguration = {
    executor: "@bsport/nx-federation:dev",
    options: {
      watchDeps: options.watchDeps ?? true,
    },
  };

  const devSingleTarget: TargetConfiguration = {
    command: "vite",
    options: {
      cwd: projectRoot,
    },
  };

  return {
    projects: {
      [projectRoot]: {
        targets: {
          [devTargetName]: devTarget,
          [devSingleTargetName]: devSingleTarget,
        },
      },
    },
  };
}
