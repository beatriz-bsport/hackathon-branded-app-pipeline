import { Tree, formatFiles, logger } from "@nx/devkit";

import {
  applyRenameMap,
  buildRenameMap,
  collectSourceFiles,
  isTextSourceFile,
  resolveProjectRoot,
  rewriteLocalReferences,
} from "./utils";

type MigrateFilenamesToKebabCaseSchema = {
  appName: string;
};

export async function migrateFilenamesToKebabCaseGenerator(
  tree: Tree,
  schema: MigrateFilenamesToKebabCaseSchema,
): Promise<void> {
  const { packageName, root } = resolveProjectRoot(tree, schema.appName);
  const sourceFiles = collectSourceFiles(tree, root);
  const sourceRoot = `${root}/src`;
  const renameMap = buildRenameMap(sourceFiles, sourceRoot);

  if (renameMap.size === 0) {
    logger.info(`${packageName} already uses kebab-case filenames in src.`);
    return;
  }

  const knownFiles = new Set(sourceFiles);

  for (const filePath of sourceFiles) {
    if (!isTextSourceFile(filePath)) {
      continue;
    }

    const content = tree.read(filePath, "utf-8");
    if (content === null) {
      continue;
    }

    const nextContent = rewriteLocalReferences(
      content,
      filePath,
      renameMap.get(filePath) ?? filePath,
      root,
      knownFiles,
      renameMap,
    );

    if (nextContent !== content) {
      tree.write(filePath, nextContent);
    }
  }

  applyRenameMap(tree, renameMap);
  await formatFiles(tree);

  logger.info(
    `Renamed ${renameMap.size} file(s) to kebab-case in ${packageName}.`,
  );
}

export default migrateFilenamesToKebabCaseGenerator;
