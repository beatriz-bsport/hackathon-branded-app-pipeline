import ts from "typescript";

import { parse } from "./ast";

const APP_PREF_OPTIONS = new Set([
  "staleTime",
  "gcTime",
  "cacheTime",
  "enabled",
  "select",
  "retry",
  "refetchOnMount",
  "refetchOnWindowFocus",
  "refetchOnReconnect",
  "refetchInterval",
  "placeholderData",
]);

const BUILDER_CALLEES = new Set([
  "queryOptions",
  "infiniteQueryOptions",
  "mutationOptions",
]);

const QUERY_HOOKS = new Set([
  "useQuery",
  "useSuspenseQuery",
  "useInfiniteQuery",
  "useSuspenseInfiniteQuery",
]);

export type RelocatableOption = {
  builderName: string; // exported builder const, e.g. memberListQueryOptions
  option: string; // e.g. staleTime
  valueText: string; // e.g. MEMBER_STALE_TIME or 120000
};

/** Walk up to the nearest `export const <name> = ...` that encloses a node. */
function enclosingExportedConstName(node: ts.Node): string | null {
  let current: ts.Node | undefined = node;
  while (current) {
    if (
      ts.isVariableDeclaration(current) &&
      ts.isIdentifier(current.name) &&
      ts.isVariableStatement(current.parent.parent) &&
      ts
        .getModifiers(current.parent.parent)
        ?.some((m) => m.kind === ts.SyntaxKind.ExportKeyword)
    ) {
      return current.name.text;
    }
    current = current.parent;
  }
  return null;
}

/**
 * Find app-preference options baked into option builders, tagged with the
 * exported builder name that wraps them. Returns the data needed both to strip
 * the option from the package and to re-apply it at consumer call sites.
 */
export function findRelocatableOptions(content: string): RelocatableOption[] {
  const sourceFile = parse(content);
  const found: RelocatableOption[] = [];

  const visit = (node: ts.Node): void => {
    if (
      ts.isCallExpression(node) &&
      ts.isIdentifier(node.expression) &&
      BUILDER_CALLEES.has(node.expression.text) &&
      node.arguments.length > 0 &&
      ts.isObjectLiteralExpression(node.arguments[0])
    ) {
      const builderName = enclosingExportedConstName(node);
      if (builderName) {
        for (const property of node.arguments[0].properties) {
          if (
            ts.isPropertyAssignment(property) &&
            ts.isIdentifier(property.name) &&
            APP_PREF_OPTIONS.has(property.name.text)
          ) {
            found.push({
              builderName,
              option: property.name.text,
              valueText: property.initializer.getText(sourceFile),
            });
          }
        }
      }
    }
    ts.forEachChild(node, visit);
  };
  visit(sourceFile);

  return found;
}

/** Remove the named app-pref properties from a builder file. */
export function stripBuilderOptions(
  content: string,
  options: RelocatableOption[],
): string {
  const sourceFile = parse(content);
  const targets = new Set(options.map((o) => `${o.builderName}:${o.option}`));
  type Edit = { start: number; end: number };
  const edits: Edit[] = [];

  const visit = (node: ts.Node): void => {
    if (
      ts.isCallExpression(node) &&
      ts.isIdentifier(node.expression) &&
      BUILDER_CALLEES.has(node.expression.text) &&
      node.arguments.length > 0 &&
      ts.isObjectLiteralExpression(node.arguments[0])
    ) {
      const builderName = enclosingExportedConstName(node);
      const objectLiteral = node.arguments[0];
      objectLiteral.properties.forEach((property, index) => {
        if (
          ts.isPropertyAssignment(property) &&
          ts.isIdentifier(property.name) &&
          builderName &&
          targets.has(`${builderName}:${property.name.text}`)
        ) {
          // Remove the property and its trailing comma/whitespace.
          const start = property.getStart(sourceFile);
          let end = property.getEnd();
          const next = objectLiteral.properties[index + 1];
          end = next ? next.getStart(sourceFile) : end;
          edits.push({ start, end });
        }
      });
    }
    ts.forEachChild(node, visit);
  };
  visit(sourceFile);

  let next = content;
  for (const edit of edits.sort((a, b) => b.start - a.start)) {
    next = next.slice(0, edit.start) + next.slice(edit.end);
  }
  return next;
}

/** Add `symbolToAdd` to the named import that already imports `anchorSymbol`. */
export function ensureNamedImportWith(
  content: string,
  anchorSymbol: string,
  symbolToAdd: string,
): string {
  const sourceFile = parse(content);

  for (const statement of sourceFile.statements) {
    if (!ts.isImportDeclaration(statement)) continue;
    const named = statement.importClause?.namedBindings;
    if (!named || !ts.isNamedImports(named)) continue;

    const names = named.elements.map((e) => e.name.text);
    if (!names.includes(anchorSymbol)) continue;
    if (names.includes(symbolToAdd)) return content; // already present

    const last = named.elements[named.elements.length - 1];
    const insertAt = last.getEnd();
    return (
      content.slice(0, insertAt) + `, ${symbolToAdd}` + content.slice(insertAt)
    );
  }

  return content;
}

/** Drop `symbol` from its named import when nothing else in the file uses it. */
export function removeNamedImportIfUnused(
  content: string,
  symbol: string,
): string {
  const sourceFile = parse(content);

  let usages = 0;
  let specifier: ts.ImportSpecifier | null = null;
  let owningImport: ts.ImportDeclaration | null = null;
  let siblingCount = 0;

  const visit = (node: ts.Node): void => {
    if (
      ts.isImportSpecifier(node) &&
      node.name.text === symbol &&
      ts.isNamedImports(node.parent)
    ) {
      specifier = node;
      siblingCount = node.parent.elements.length;
      owningImport = node.parent.parent.parent as ts.ImportDeclaration;
    } else if (ts.isIdentifier(node) && node.text === symbol) {
      usages += 1; // counts both the import binding and real references
    }
    ts.forEachChild(node, visit);
  };
  visit(sourceFile);

  // usages includes the import binding itself; >1 means it's referenced.
  if (specifier === null || usages > 1) {
    return content;
  }

  if (siblingCount === 1 && owningImport !== null) {
    const imp = owningImport as ts.ImportDeclaration;
    return (
      content.slice(0, imp.getStart(sourceFile)) +
      content.slice(imp.getEnd()).replace(/^\n/, "")
    );
  }

  const spec = specifier as ts.ImportSpecifier;
  const elements = (spec.parent as ts.NamedImports).elements;
  const index = elements.indexOf(spec);
  // Drop the leading comma for a non-first element, otherwise the trailing one,
  // so we never leave a dangling `{ , x }`.
  const start =
    index > 0 ? elements[index - 1].getEnd() : spec.getStart(sourceFile);
  const end =
    index > 0 ? spec.getEnd() : elements[index + 1].getStart(sourceFile);
  return content.slice(0, start) + content.slice(end);
}

export type CallSiteClassification = {
  handleable: boolean;
  reason?: string;
};

/**
 * Classify (and, when handleable, rewrite) every consumer call site of a
 * builder, injecting the relocated options into the enclosing query hook.
 * Returns the rewritten content plus any unhandleable sites — the generator
 * aborts the whole migration if anything is unhandleable, so behavior is never
 * partially relocated.
 */
export function relocateAtCallSites(
  content: string,
  builderName: string,
  options: { option: string; valueText: string }[],
): { content: string; rewritten: number; unhandleable: string[] } {
  const sourceFile = parse(content);
  const unhandleable: string[] = [];
  type Edit = { start: number; end: number; replacement: string };
  const edits: Edit[] = [];
  let rewritten = 0;

  const optionText = options
    .map((o) => `${o.option}: ${o.valueText}`)
    .join(", ");

  const visit = (node: ts.Node): void => {
    if (
      ts.isCallExpression(node) &&
      ts.isIdentifier(node.expression) &&
      node.expression.text === builderName
    ) {
      const parent = node.parent;

      // Shape A: useX(builder(...))  →  useX({ ...builder(...), <options> })
      if (
        ts.isCallExpression(parent) &&
        ts.isIdentifier(parent.expression) &&
        QUERY_HOOKS.has(parent.expression.text) &&
        parent.arguments.length === 1 &&
        parent.arguments[0] === node
      ) {
        const callText = node.getText(sourceFile);
        edits.push({
          start: node.getStart(sourceFile),
          end: node.getEnd(),
          replacement: `{ ...${callText}, ${optionText} }`,
        });
        rewritten += 1;
        return;
      }

      // Shape B: useX({ ...builder(...) [, props] })  →  add <options> to object
      if (
        ts.isSpreadAssignment(parent) &&
        ts.isObjectLiteralExpression(parent.parent) &&
        ts.isCallExpression(parent.parent.parent) &&
        ts.isIdentifier(parent.parent.parent.expression) &&
        QUERY_HOOKS.has(parent.parent.parent.expression.text)
      ) {
        const objectLiteral = parent.parent;
        const alreadySet = objectLiteral.properties.some((p) => {
          if (
            !ts.isPropertyAssignment(p) &&
            !ts.isShorthandPropertyAssignment(p)
          ) {
            return false;
          }
          if (!ts.isIdentifier(p.name)) {
            return false;
          }
          const name = p.name.text;
          return options.some((o) => o.option === name);
        });
        if (!alreadySet) {
          edits.push({
            start: parent.getEnd(),
            end: parent.getEnd(),
            replacement: `, ${optionText}`,
          });
        }
        rewritten += 1;
        return;
      }

      const { line } = sourceFile.getLineAndCharacterOfPosition(
        node.getStart(sourceFile),
      );
      unhandleable.push(
        `${builderName}() at line ${line + 1} is not a direct query-hook argument (assign-then-spread, prefetch, etc.) — relocate by hand.`,
      );
    }
    ts.forEachChild(node, visit);
  };
  visit(sourceFile);

  if (unhandleable.length > 0) {
    return { content, rewritten: 0, unhandleable };
  }

  let next = content;
  for (const edit of edits.sort((a, b) => b.start - a.start)) {
    next = next.slice(0, edit.start) + edit.replacement + next.slice(edit.end);
  }
  return { content: next, rewritten, unhandleable };
}
