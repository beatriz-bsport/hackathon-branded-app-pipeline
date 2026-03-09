import { Tree, formatFiles, logger, readJson } from "@nx/devkit";

import {
  transformAppPackageJson,
  transformViteConfig,
} from "./transforms/app-config";
import {
  transformHostModulesDts,
  transformHostPackageJson,
  transformHostRootTsx,
} from "./transforms/host";
import { transformI18n } from "./transforms/i18n";
import { resolveAppRoot, resolveHostRoot } from "./utils";

type MigrateToLibrarySchema = {
  appName: string;
};

type PackageJsonLike = {
  exports?: Record<string, unknown>;
  devDependencies?: Record<string, string | undefined>;
};

function normalizeAppName(input: string): string {
  const withoutScope = input.startsWith("@bsport/")
    ? input.slice("@bsport/".length)
    : input;
  const bareName = withoutScope.startsWith("sm-")
    ? withoutScope.slice("sm-".length)
    : withoutScope;
  return `sm-${bareName}`;
}

export async function migrateToLibraryGenerator(
  tree: Tree,
  schema: MigrateToLibrarySchema,
): Promise<void> {
  const appName = normalizeAppName(schema.appName);
  const packageName = `@bsport/${appName}`;

  const appRoot = resolveAppRoot(tree, appName);
  const appPackageJson = readJson<PackageJsonLike>(
    tree,
    `${appRoot}/package.json`,
  );
  if (
    appPackageJson.exports !== undefined ||
    appPackageJson.devDependencies?.["@bsport/config-library"] !== undefined
  ) {
    throw new Error(
      `${packageName} is already migrated to library mode. Aborting.`,
    );
  }

  const hostRoot = resolveHostRoot(tree);

  transformAppPackageJson(tree, appRoot);
  transformViteConfig(tree, appRoot);
  transformI18n(tree, appRoot, packageName);
  transformHostPackageJson(tree, hostRoot, appName, packageName);
  transformHostRootTsx(tree, hostRoot, appName, packageName);
  transformHostModulesDts(tree, hostRoot, appName);

  await formatFiles(tree);

  logger.info(
    `Migration complete for ${packageName}. Review changes and run pnpm install.`,
  );
  logger.warn(
    "Manual review needed: check dependencies/peerDependencies, src/index.tsx, vite-env.d.ts",
  );
}

export default migrateToLibraryGenerator;
