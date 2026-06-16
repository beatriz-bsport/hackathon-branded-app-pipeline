import ts from "typescript";

import { parse } from "./ast";

export type RewriteResult = {
  content: string;
  movedSymbols: string[];
  /** True when a default/namespace barrel import was left untouched. */
  skippedNonNamed: boolean;
};

type ImportElement = {
  text: string; // reconstructed specifier text, e.g. `memberKeys` or `Member as M` or `type Foo`
  symbol: string; // the imported (original) name used for resource resolution
};

function elementText(element: ts.ImportSpecifier): ImportElement {
  const original = element.propertyName?.text ?? element.name.text;
  const typePrefix = element.isTypeOnly ? "type " : "";
  const alias = element.propertyName ? ` as ${element.name.text}` : "";
  return {
    text: `${typePrefix}${original}${alias}`,
    symbol: original,
  };
}

function buildImport(
  clauseTypeOnly: boolean,
  elements: ImportElement[],
  moduleSpecifier: string,
  quote: string,
): string {
  const keyword = clauseTypeOnly ? "import type" : "import";
  const names = elements.map((e) => e.text).join(", ");
  return `${keyword} { ${names} } from ${quote}${moduleSpecifier}${quote};`;
}

/**
 * Move the target resource's symbols from a root-barrel import to its subpath,
 * leaving any other symbols on the barrel. Default/namespace barrel imports are
 * left untouched (flagged via `skippedNonNamed`).
 */
export function rewriteBarrelImports(
  content: string,
  packageName: string,
  targetResource: string,
  symbolToResource: Map<string, string>,
): RewriteResult {
  const sourceFile = parse(content);
  const movedSymbols: string[] = [];
  let skippedNonNamed = false;

  type Edit = { start: number; end: number; replacement: string };
  const edits: Edit[] = [];

  for (const statement of sourceFile.statements) {
    if (
      !ts.isImportDeclaration(statement) ||
      !ts.isStringLiteral(statement.moduleSpecifier) ||
      statement.moduleSpecifier.text !== packageName
    ) {
      continue;
    }

    const clause = statement.importClause;
    const named = clause?.namedBindings;

    // Leave default imports / `import * as ns` on the barrel untouched.
    if (clause?.name || (named && !ts.isNamedImports(named))) {
      skippedNonNamed = true;
      continue;
    }
    if (!named || !ts.isNamedImports(named)) {
      continue;
    }

    const clauseTypeOnly = clause?.isTypeOnly ?? false;
    const moving: ImportElement[] = [];
    const staying: ImportElement[] = [];

    for (const element of named.elements) {
      const parsed = elementText(element);
      if (symbolToResource.get(parsed.symbol) === targetResource) {
        moving.push(parsed);
      } else {
        staying.push(parsed);
      }
    }

    if (moving.length === 0) {
      continue;
    }

    const quote =
      content[statement.moduleSpecifier.getStart(sourceFile)] ?? '"';
    const lines: string[] = [];
    if (staying.length > 0) {
      lines.push(buildImport(clauseTypeOnly, staying, packageName, quote));
    }
    lines.push(
      buildImport(
        clauseTypeOnly,
        moving,
        `${packageName}/${targetResource}`,
        quote,
      ),
    );

    edits.push({
      start: statement.getStart(sourceFile),
      end: statement.getEnd(),
      replacement: lines.join("\n"),
    });
    movedSymbols.push(...moving.map((m) => m.symbol));
  }

  // Apply edits back-to-front so earlier offsets stay valid.
  let next = content;
  for (const edit of edits.sort((a, b) => b.start - a.start)) {
    next = next.slice(0, edit.start) + edit.replacement + next.slice(edit.end);
  }

  return { content: next, movedSymbols, skippedNonNamed };
}
