import { Tree } from "@nx/devkit";
import path from "node:path";
import ts from "typescript";

import { parse } from "./ast";

const posixPath = path.posix;

const RESOLVE_EXTENSIONS = [".ts", ".tsx"];

/** Resolve a relative module specifier to an existing file path in the Tree. */
function resolveRelative(
  fromFile: string,
  specifier: string,
  exists: (filePath: string) => boolean,
): string | null {
  const base = posixPath.normalize(
    posixPath.join(posixPath.dirname(fromFile), specifier),
  );
  const candidates = [
    ...RESOLVE_EXTENSIONS.map((ext) => `${base}${ext}`),
    ...RESOLVE_EXTENSIONS.map((ext) => posixPath.join(base, `index${ext}`)),
  ];
  return candidates.find((candidate) => exists(candidate)) ?? null;
}

type FileExports = {
  /** Concrete exported names declared or re-exported by name in this file. */
  names: Set<string>;
  /** Relative specifiers this file re-exports wholesale via `export *`. */
  starReexports: string[];
};

function collectFileExports(sourceFile: ts.SourceFile): FileExports {
  const names = new Set<string>();
  const starReexports: string[] = [];

  for (const statement of sourceFile.statements) {
    if (ts.isExportDeclaration(statement)) {
      const specifier =
        statement.moduleSpecifier &&
        ts.isStringLiteral(statement.moduleSpecifier)
          ? statement.moduleSpecifier.text
          : null;

      if (statement.exportClause && ts.isNamedExports(statement.exportClause)) {
        // export { a, b } [from "./x"]
        for (const element of statement.exportClause.elements) {
          names.add(element.name.text);
        }
      } else if (!statement.exportClause && specifier) {
        // export * from "./x"
        starReexports.push(specifier);
      }
      continue;
    }

    const isExported = ts.canHaveModifiers(statement)
      ? ts
          .getModifiers(statement)
          ?.some((m) => m.kind === ts.SyntaxKind.ExportKeyword)
      : false;
    if (!isExported) {
      continue;
    }

    if (ts.isVariableStatement(statement)) {
      for (const declaration of statement.declarationList.declarations) {
        if (ts.isIdentifier(declaration.name)) {
          names.add(declaration.name.text);
        }
      }
    } else if (
      (ts.isFunctionDeclaration(statement) ||
        ts.isClassDeclaration(statement) ||
        ts.isInterfaceDeclaration(statement) ||
        ts.isTypeAliasDeclaration(statement) ||
        ts.isEnumDeclaration(statement)) &&
      statement.name
    ) {
      names.add(statement.name.text);
    }
  }

  return { names, starReexports };
}

/**
 * All symbol names a resource exports through its `index.ts`, following
 * `export *` re-exports to sibling files (one of the things that makes the
 * barrel migration impossible to do with grep alone).
 */
export function collectResourceExports(
  tree: Tree,
  root: string,
  resource: string,
): Set<string> {
  const indexPath = `${root}/src/${resource}/index.ts`;
  const names = new Set<string>();
  const visited = new Set<string>();

  const walk = (filePath: string): void => {
    if (visited.has(filePath)) {
      return;
    }
    visited.add(filePath);

    const content = tree.read(filePath, "utf-8");
    if (content === null) {
      return;
    }
    const { names: fileNames, starReexports } = collectFileExports(
      parse(content, filePath),
    );
    for (const name of fileNames) {
      names.add(name);
    }
    for (const specifier of starReexports) {
      if (specifier.startsWith(".")) {
        const resolved = resolveRelative(filePath, specifier, (p) =>
          tree.exists(p),
        );
        if (resolved !== null) {
          walk(resolved);
        }
      }
    }
  };

  walk(indexPath);
  return names;
}

/**
 * Map every exported symbol to the resource that owns it. Throws on a
 * cross-resource name collision (which would mean the root barrel couldn't have
 * compiled under `export *` in the first place).
 */
export function buildSymbolToResourceMap(
  tree: Tree,
  root: string,
  resources: string[],
): Map<string, string> {
  const map = new Map<string, string>();

  for (const resource of resources) {
    for (const name of collectResourceExports(tree, root, resource)) {
      const existing = map.get(name);
      if (existing && existing !== resource) {
        throw new Error(
          `Symbol "${name}" is exported by both "${existing}" and "${resource}"; cannot resolve a unique subpath.`,
        );
      }
      map.set(name, resource);
    }
  }

  return map;
}
