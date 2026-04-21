import {
  Tree,
  names,
  readProjectConfiguration,
  visitNotIgnoredFiles,
} from "@nx/devkit";
import path from "node:path";

const posixPath = path.posix;

const compoundSuffixes = [
  ".stories.tsx",
  ".stories.ts",
  ".spec.tsx",
  ".spec.ts",
  ".test.tsx",
  ".test.ts",
  ".d.ts",
];

const resolvableExtensions = [
  ".ts",
  ".tsx",
  ".js",
  ".jsx",
  ".json",
  ".css",
  ".scss",
  ".svg",
  ".png",
  ".jpg",
];

const textFileExtensions = new Set([".ts", ".tsx", ".js", ".jsx"]);

type ResolvedProject = {
  packageName: string;
  root: string;
};

function toKebabPathSegment(segment: string): string {
  if (segment.startsWith(".") || /^__.*__$/.test(segment)) {
    return segment;
  }

  return names(segment).fileName;
}

function normalizeToPosix(filePath: string): string {
  return filePath.split(path.sep).join(posixPath.sep);
}

function isExcludedI18nJsonFile(filePath: string, sourceRoot: string): boolean {
  const normalizedFilePath = normalizeToPosix(filePath);
  const normalizedSourceRoot = normalizeToPosix(sourceRoot);
  const relativePath = posixPath.relative(
    normalizedSourceRoot,
    normalizedFilePath,
  );

  if (
    relativePath === "" ||
    relativePath.startsWith("..") ||
    posixPath.isAbsolute(relativePath)
  ) {
    return false;
  }

  const [topLevelDirectory] = relativePath.split(posixPath.sep);

  return (
    topLevelDirectory === "i18n" && posixPath.extname(relativePath) === ".json"
  );
}

function getStemAndSuffix(baseName: string): { stem: string; suffix: string } {
  for (const suffix of compoundSuffixes) {
    if (baseName.endsWith(suffix)) {
      return {
        stem: baseName.slice(0, -suffix.length),
        suffix,
      };
    }
  }

  const extension = posixPath.extname(baseName);
  return {
    stem:
      extension.length > 0 ? baseName.slice(0, -extension.length) : baseName,
    suffix: extension,
  };
}

function toKebabBaseName(baseName: string): string {
  if (baseName.startsWith(".")) {
    return baseName;
  }

  const { stem, suffix } = getStemAndSuffix(baseName);
  return `${names(stem).fileName}${suffix}`;
}

function tryReadProjectRoot(tree: Tree, packageName: string): string | null {
  try {
    return readProjectConfiguration(tree, packageName).root;
  } catch {
    return null;
  }
}

export function resolveProjectRoot(tree: Tree, input: string): ResolvedProject {
  const normalizedInput = input.trim();

  const candidatePackageNames = normalizedInput.startsWith("@bsport/")
    ? [normalizedInput]
    : normalizedInput.startsWith("sm-")
      ? [`@bsport/${normalizedInput}`]
      : [`@bsport/sm-${normalizedInput}`, `@bsport/${normalizedInput}`];

  for (const packageName of candidatePackageNames) {
    const root = tryReadProjectRoot(tree, packageName);

    if (root !== null) {
      return { packageName, root };
    }
  }

  throw new Error(
    `Unable to resolve project for \"${input}\". Tried: ${candidatePackageNames.join(
      ", ",
    )}`,
  );
}

export function collectSourceFiles(tree: Tree, projectRoot: string): string[] {
  const sourceRoot = `${projectRoot}/src`;
  const files: string[] = [];

  visitNotIgnoredFiles(tree, sourceRoot, (filePath) => {
    const normalizedFilePath = normalizeToPosix(filePath);
    const baseName = posixPath.basename(normalizedFilePath);

    if (baseName.startsWith(".")) {
      return;
    }

    if (isExcludedI18nJsonFile(normalizedFilePath, sourceRoot)) {
      return;
    }

    files.push(normalizedFilePath);
  });

  return files.sort();
}

export function getRenamedFilePath(
  filePath: string,
  sourceRoot: string,
): string {
  const relativePath = posixPath.relative(sourceRoot, filePath);
  const pathSegments = relativePath.split(posixPath.sep);
  const baseName = pathSegments.at(-1);

  if (baseName === undefined) {
    return filePath;
  }

  const renamedBaseName = toKebabBaseName(baseName);
  const renamedPathSegments = pathSegments.map((segment, index) =>
    index === pathSegments.length - 1
      ? renamedBaseName
      : toKebabPathSegment(segment),
  );
  const renamedRelativePath = renamedPathSegments.join(posixPath.sep);

  return renamedRelativePath === relativePath
    ? filePath
    : posixPath.join(sourceRoot, renamedRelativePath);
}

export function buildRenameMap(
  files: string[],
  sourceRoot: string,
): Map<string, string> {
  const renameMap = new Map<string, string>();
  const seenTargets = new Map<string, string>();
  const allFiles = new Set(files);

  for (const filePath of files) {
    const renamedFilePath = getRenamedFilePath(filePath, sourceRoot);

    if (renamedFilePath === filePath) {
      continue;
    }

    const existingSource = seenTargets.get(renamedFilePath);
    if (existingSource !== undefined) {
      throw new Error(
        `Filename collision detected: ${existingSource} and ${filePath} would both become ${renamedFilePath}`,
      );
    }

    if (allFiles.has(renamedFilePath) && !renameMap.has(renamedFilePath)) {
      throw new Error(
        `Filename collision detected: ${filePath} would overwrite existing file ${renamedFilePath}`,
      );
    }

    seenTargets.set(renamedFilePath, filePath);
    renameMap.set(filePath, renamedFilePath);
  }

  return renameMap;
}

function stripExtension(filePath: string): string {
  const { stem, suffix } = getStemAndSuffix(posixPath.basename(filePath));

  if (suffix === "") {
    return filePath;
  }

  return posixPath.join(posixPath.dirname(filePath), stem);
}

function resolveRelativeTarget(
  sourceFilePath: string,
  specifier: string,
): string {
  const sourceDirectory = posixPath.dirname(sourceFilePath);
  return posixPath.normalize(posixPath.join(sourceDirectory, specifier));
}

function resolveAliasTarget(projectRoot: string, specifier: string): string {
  const relativeToSource = specifier.slice("#src/".length);
  return posixPath.normalize(
    posixPath.join(projectRoot, "src", relativeToSource),
  );
}

function splitSpecifierAndQuery(specifier: string): {
  bareSpecifier: string;
  suffix: string;
} {
  const queryStart = specifier.indexOf("?");
  const hashStart = specifier.startsWith("#src/") ? -1 : specifier.indexOf("#");
  const suffixStart = [queryStart, hashStart]
    .filter((index) => index >= 0)
    .reduce<number>((smallest, index) => Math.min(smallest, index), Infinity);

  return suffixStart === Infinity
    ? { bareSpecifier: specifier, suffix: "" }
    : {
        bareSpecifier: specifier.slice(0, suffixStart),
        suffix: specifier.slice(suffixStart),
      };
}

function findReferencedFile(
  candidatePath: string,
  knownFiles: Set<string>,
): string | null {
  if (knownFiles.has(candidatePath)) {
    return candidatePath;
  }

  for (const extension of resolvableExtensions) {
    const fileWithExtension = `${candidatePath}${extension}`;
    if (knownFiles.has(fileWithExtension)) {
      return fileWithExtension;
    }
  }

  for (const extension of resolvableExtensions) {
    const indexFile = posixPath.join(candidatePath, `index${extension}`);
    if (knownFiles.has(indexFile)) {
      return indexFile;
    }
  }

  return null;
}

function buildRelativeSpecifier(
  sourceFilePath: string,
  targetFilePath: string,
): string {
  const relativePath = posixPath.relative(
    posixPath.dirname(sourceFilePath),
    targetFilePath,
  );
  return relativePath.startsWith(".") ? relativePath : `./${relativePath}`;
}

function hasExplicitExtension(specifier: string): boolean {
  const baseName = posixPath.basename(specifier);
  return resolvableExtensions.some((extension) => baseName.endsWith(extension));
}

function rewriteSpecifier(
  sourceFilePath: string,
  nextSourceFilePath: string,
  projectRoot: string,
  specifier: string,
  knownFiles: Set<string>,
  renameMap: Map<string, string>,
): string {
  const { bareSpecifier, suffix } = splitSpecifierAndQuery(specifier);
  const isAlias = bareSpecifier.startsWith("#src/");
  const isRelative =
    bareSpecifier.startsWith("./") || bareSpecifier.startsWith("../");

  if (!isAlias && !isRelative) {
    return specifier;
  }

  const candidatePath = isAlias
    ? resolveAliasTarget(projectRoot, bareSpecifier)
    : resolveRelativeTarget(sourceFilePath, bareSpecifier);

  const referencedFile = findReferencedFile(candidatePath, knownFiles);
  if (referencedFile === null) {
    return specifier;
  }

  const renamedTarget = renameMap.get(referencedFile);
  if (renamedTarget === undefined) {
    return specifier;
  }

  const explicitExtension = hasExplicitExtension(bareSpecifier);
  const nextTarget = explicitExtension
    ? renamedTarget
    : stripExtension(renamedTarget);

  if (isAlias) {
    const aliasPath = posixPath.relative(
      posixPath.join(projectRoot, "src"),
      nextTarget,
    );
    return `#src/${aliasPath}${suffix}`;
  }

  return `${buildRelativeSpecifier(nextSourceFilePath, nextTarget)}${suffix}`;
}

export function rewriteLocalReferences(
  content: string,
  sourceFilePath: string,
  nextSourceFilePath: string,
  projectRoot: string,
  knownFiles: Set<string>,
  renameMap: Map<string, string>,
): string {
  const moduleSpecifierPattern =
    /(from\s+|import\s*\(\s*|export\s+\*\s+from\s+|export\s*\{[^}]*\}\s*from\s+)(["'])([^"']+)\2/g;
  const sideEffectImportPattern = /(import\s+)(["'])([^"']+)\2/g;

  const rewrittenModules = content.replace(
    moduleSpecifierPattern,
    (match, prefix: string, quote: string, specifier: string) => {
      const nextSpecifier = rewriteSpecifier(
        sourceFilePath,
        nextSourceFilePath,
        projectRoot,
        specifier,
        knownFiles,
        renameMap,
      );

      return nextSpecifier === specifier
        ? match
        : `${prefix}${quote}${nextSpecifier}${quote}`;
    },
  );

  return rewrittenModules.replace(
    sideEffectImportPattern,
    (match, prefix: string, quote: string, specifier: string) => {
      const nextSpecifier = rewriteSpecifier(
        sourceFilePath,
        nextSourceFilePath,
        projectRoot,
        specifier,
        knownFiles,
        renameMap,
      );

      return nextSpecifier === specifier
        ? match
        : `${prefix}${quote}${nextSpecifier}${quote}`;
    },
  );
}

export function isTextSourceFile(filePath: string): boolean {
  return textFileExtensions.has(posixPath.extname(filePath));
}

export function applyRenameMap(
  tree: Tree,
  renameMap: Map<string, string>,
): void {
  const sortedEntries = [...renameMap.entries()].sort(([left], [right]) =>
    left.localeCompare(right),
  );

  for (const [sourcePath, targetPath] of sortedEntries) {
    tree.rename(sourcePath, targetPath);
  }
}
