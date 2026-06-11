import { Tree, visitNotIgnoredFiles } from "@nx/devkit";

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/**
 * Count root-barrel import sites in a single file's content — i.e.
 * `... from "@bsport/api-cdp"` with NO `/subpath`. Subpath imports
 * (`@bsport/api-cdp/member`) are intentionally not matched.
 */
export function countRootBarrelImports(
  content: string,
  packageName: string,
): number {
  const pattern = new RegExp(
    `from\\s*["']${escapeRegExp(packageName)}["']`,
    "g",
  );
  const matches = content.match(pattern);
  return matches ? matches.length : 0;
}

export type BarrelImportSite = {
  file: string;
  count: number;
};

const SEARCH_ROOTS = ["apps", "packages"];

/**
 * Find every file in the workspace that imports from a package's root barrel.
 * A Tree-wide scan (no project graph) keeps this deterministic and unit-testable;
 * scanning dependents only is a future optimization.
 */
export function findRootBarrelImportSites(
  tree: Tree,
  packageName: string,
): BarrelImportSite[] {
  const sites: BarrelImportSite[] = [];

  for (const searchRoot of SEARCH_ROOTS) {
    if (!tree.exists(searchRoot)) {
      continue;
    }
    visitNotIgnoredFiles(tree, searchRoot, (filePath) => {
      if (!/\.tsx?$/.test(filePath) || filePath.includes("/node_modules/")) {
        return;
      }
      const content = tree.read(filePath, "utf-8");
      if (content === null) {
        return;
      }
      const count = countRootBarrelImports(content, packageName);
      if (count > 0) {
        sites.push({ file: filePath, count });
      }
    });
  }

  return sites.sort((a, b) => a.file.localeCompare(b.file));
}
