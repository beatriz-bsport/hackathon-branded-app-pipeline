import { Tree, formatFiles, logger } from "@nx/devkit";

import { resolveApiPackage } from "../align-api-shared/api-package";
import { findRootBarrelImportSites } from "../align-api-shared/consumers";

type DeleteBarrelSchema = {
  appName: string;
  force?: boolean;
};

/**
 * Rule 3 (phase 3): delete the package root barrel. Package-atomic and gated —
 * it refuses to run while any consumer still imports from the root barrel
 * (migrate those resources first). Also declares `sideEffects: false`.
 */
export async function deleteBarrelGenerator(
  tree: Tree,
  schema: DeleteBarrelSchema,
): Promise<void> {
  const { packageName, root } = resolveApiPackage(tree, schema.appName);

  const remaining = findRootBarrelImportSites(tree, packageName);
  const remainingCount = remaining.reduce((sum, s) => sum + s.count, 0);

  if (remainingCount > 0 && !schema.force) {
    logger.error(
      `${packageName} still has ${remainingCount} root-barrel import site(s) across ${remaining.length} file(s). ` +
        `Run migrate-barrel-imports for the remaining resources first (or pass --force to override).`,
    );
    return;
  }

  // 1. Declare sideEffects: false so bundlers can tree-shake.
  const packageJsonPath = `${root}/package.json`;
  const packageJsonRaw = tree.read(packageJsonPath, "utf-8");
  if (packageJsonRaw !== null) {
    const packageJson = JSON.parse(packageJsonRaw) as Record<string, unknown>;
    packageJson.sideEffects = false;
    if (
      packageJson.exports &&
      typeof packageJson.exports === "object" &&
      "." in (packageJson.exports as Record<string, unknown>)
    ) {
      delete (packageJson.exports as Record<string, unknown>)["."];
    }
    tree.write(packageJsonPath, `${JSON.stringify(packageJson, null, 2)}\n`);
  }

  // 2. Delete the root barrel itself.
  const barrelPath = `${root}/src/index.ts`;
  if (tree.exists(barrelPath)) {
    tree.delete(barrelPath);
  }

  await formatFiles(tree);

  logger.info(
    `Deleted ${packageName} root barrel, removed the "." export, and set sideEffects: false.`,
  );
}

export default deleteBarrelGenerator;
