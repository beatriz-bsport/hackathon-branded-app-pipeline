import { Tree, readProjectConfiguration } from "@nx/devkit";
import path from "node:path";

const posixPath = path.posix;

export type ResolvedApiPackage = {
  packageName: string;
  root: string;
};

function tryReadProjectRoot(tree: Tree, packageName: string): string | null {
  try {
    return readProjectConfiguration(tree, packageName).root;
  } catch {
    return null;
  }
}

/**
 * Resolve a `packages/api/*` package from a loose input:
 * `cdp` / `api-cdp` / `@bsport/api-cdp` all resolve to `@bsport/api-cdp`.
 */
export function resolveApiPackage(
  tree: Tree,
  input: string,
): ResolvedApiPackage {
  const normalized = input.trim();

  const candidates = normalized.startsWith("@bsport/")
    ? [normalized]
    : normalized.startsWith("api-")
      ? [`@bsport/${normalized}`]
      : [`@bsport/api-${normalized}`, `@bsport/${normalized}`];

  for (const packageName of candidates) {
    const root = tryReadProjectRoot(tree, packageName);
    if (root !== null) {
      return { packageName, root };
    }
  }

  throw new Error(
    `Unable to resolve API package for "${input}". Tried: ${candidates.join(", ")}`,
  );
}

/** Resource directories under `src/` that expose an `index.ts`. */
export function listResources(tree: Tree, root: string): string[] {
  const sourceRoot = `${root}/src`;
  const resources: string[] = [];

  for (const child of tree.children(sourceRoot)) {
    const childPath = `${sourceRoot}/${child}`;
    if (!tree.isFile(childPath) && tree.exists(`${childPath}/index.ts`)) {
      resources.push(child);
    }
  }

  return resources.sort();
}

export function readRootBarrel(tree: Tree, root: string): string | null {
  return tree.read(`${root}/src/index.ts`, "utf-8");
}

export function readResourceIndex(
  tree: Tree,
  root: string,
  resource: string,
): string | null {
  return tree.read(`${root}/src/${resource}/index.ts`, "utf-8");
}

/** Source files (.ts/.tsx) that belong to one resource directory. */
export function resourceSourceFiles(
  tree: Tree,
  root: string,
  resource: string,
): string[] {
  const resourceRoot = `${root}/src/${resource}`;
  const files: string[] = [];

  const walk = (dir: string): void => {
    for (const child of tree.children(dir)) {
      const childPath = `${dir}/${child}`;
      if (tree.isFile(childPath)) {
        if (/\.tsx?$/.test(childPath) && !/\.spec\.tsx?$/.test(childPath)) {
          files.push(childPath);
        }
      } else {
        walk(childPath);
      }
    }
  };
  walk(resourceRoot);

  return files.sort();
}

export function readSideEffects(tree: Tree, root: string): unknown {
  const raw = tree.read(`${root}/package.json`, "utf-8");
  if (raw === null) {
    return undefined;
  }
  return (JSON.parse(raw) as { sideEffects?: unknown }).sideEffects;
}

export function usesExportStar(content: string | null): boolean {
  if (content === null) {
    return false;
  }
  return /^\s*export\s+\*\s+from\s+/m.test(content);
}

export { posixPath };
