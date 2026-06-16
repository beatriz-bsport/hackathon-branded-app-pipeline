import { Tree, formatFiles, logger } from "@nx/devkit";

import {
  listResources,
  resolveApiPackage,
} from "../align-api-shared/api-package";
import { rewriteBarrelImports } from "../align-api-shared/barrel-imports";
import { findRootBarrelImportSites } from "../align-api-shared/consumers";
import { buildSymbolToResourceMap } from "../align-api-shared/exports";

type MigrateBarrelImportsSchema = {
  appName: string;
  resource: string;
};

/**
 * Rule 3 (phase 2): move a single resource's symbols off the package root
 * barrel and onto its subpath (`@bsport/api-cdp/member`) at every consumer
 * import site. Other resources' symbols stay on the barrel until their own run.
 */
export async function migrateBarrelImportsGenerator(
  tree: Tree,
  schema: MigrateBarrelImportsSchema,
): Promise<void> {
  const { packageName, root } = resolveApiPackage(tree, schema.appName);

  const resources = listResources(tree, root);
  if (!resources.includes(schema.resource)) {
    throw new Error(
      `Resource "${schema.resource}" not found in ${packageName}. Available: ${resources.join(", ")}`,
    );
  }

  const symbolToResource = buildSymbolToResourceMap(tree, root, resources);
  const sites = findRootBarrelImportSites(tree, packageName);

  let filesChanged = 0;
  let symbolsMoved = 0;
  const skippedFiles: string[] = [];

  for (const { file } of sites) {
    const content = tree.read(file, "utf-8");
    if (content === null) {
      continue;
    }
    const result = rewriteBarrelImports(
      content,
      packageName,
      schema.resource,
      symbolToResource,
    );
    if (result.skippedNonNamed) {
      skippedFiles.push(file);
    }
    if (result.content !== content) {
      tree.write(file, result.content);
      filesChanged += 1;
      symbolsMoved += result.movedSymbols.length;
    }
  }

  await formatFiles(tree);

  logger.info(
    `Moved ${symbolsMoved} ${packageName}/${schema.resource} symbol import(s) across ${filesChanged} file(s) to the subpath.`,
  );
  if (skippedFiles.length > 0) {
    logger.warn(
      `Left default/namespace barrel import(s) untouched in:\n  ${skippedFiles.join("\n  ")}`,
    );
  }
}

export default migrateBarrelImportsGenerator;
