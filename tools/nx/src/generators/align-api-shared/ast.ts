import ts from "typescript";

/**
 * Tree-sitter-free structural detection for ADR-0001 violations, built on the
 * TypeScript compiler API. These helpers are pure (string in, findings out) so
 * they are trivially unit-testable and reused by the audit and fix generators.
 */

export type KeyFactoryViolation = {
  rule:
    | "4a-param-spread"
    | "4b-non-canonical-name"
    | "4c-missing-collection-tier";
  factory: string;
  key: string;
  detail: string;
};

export type BuilderViolation = {
  rule: "1a-app-pref-in-builder" | "1b-react-in-package";
  detail: string;
};

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

const REACT_QUERY_HOOKS = new Set([
  "useQuery",
  "useSuspenseQuery",
  "useInfiniteQuery",
  "useSuspenseInfiniteQuery",
  "useMutation",
  "useQueries",
  "useQueryClient",
]);

export function parse(content: string, fileName = "file.ts"): ts.SourceFile {
  return ts.createSourceFile(
    fileName,
    content,
    ts.ScriptTarget.Latest,
    /* setParentNodes */ true,
    ts.ScriptKind.TS,
  );
}

function unwrapAsConst(node: ts.Expression): ts.Expression {
  return ts.isAsExpression(node) ? unwrapAsConst(node.expression) : node;
}

/** Returns the `[...]` an arrow function (or array property) ultimately yields. */
function getReturnedArray(
  initializer: ts.Expression,
): ts.ArrayLiteralExpression | null {
  const expr = unwrapAsConst(initializer);

  if (ts.isArrayLiteralExpression(expr)) {
    return expr;
  }

  if (ts.isArrowFunction(expr)) {
    if (ts.isBlock(expr.body)) {
      for (const statement of expr.body.statements) {
        if (ts.isReturnStatement(statement) && statement.expression) {
          const returned = unwrapAsConst(statement.expression);
          if (ts.isArrayLiteralExpression(returned)) {
            return returned;
          }
        }
      }
      return null;
    }
    const body = unwrapAsConst(expr.body);
    return ts.isArrayLiteralExpression(body) ? body : null;
  }

  return null;
}

function getArity(initializer: ts.Expression): number {
  const expr = unwrapAsConst(initializer);
  return ts.isArrowFunction(expr) ? expr.parameters.length : 0;
}

function getParamNames(initializer: ts.Expression): Set<string> {
  const expr = unwrapAsConst(initializer);
  const names = new Set<string>();
  if (ts.isArrowFunction(expr)) {
    for (const param of expr.parameters) {
      if (ts.isIdentifier(param.name)) {
        names.add(param.name.text);
      }
    }
  }
  return names;
}

/**
 * A key factory is an exported `const <name>Keys = { ... } as const`.
 * Its keys are arrow functions returning arrays (or a bare array for `all`).
 */
export function findKeyFactories(
  sourceFile: ts.SourceFile,
): { name: string; node: ts.ObjectLiteralExpression }[] {
  const factories: { name: string; node: ts.ObjectLiteralExpression }[] = [];

  for (const statement of sourceFile.statements) {
    if (!ts.isVariableStatement(statement)) continue;
    const isExported = statement.modifiers?.some(
      (m) => m.kind === ts.SyntaxKind.ExportKeyword,
    );
    if (!isExported) continue;

    for (const declaration of statement.declarationList.declarations) {
      if (
        !ts.isIdentifier(declaration.name) ||
        !declaration.name.text.endsWith("Keys") ||
        !declaration.initializer
      ) {
        continue;
      }
      const init = unwrapAsConst(declaration.initializer);
      if (ts.isObjectLiteralExpression(init)) {
        factories.push({ name: declaration.name.text, node: init });
      }
    }
  }

  return factories;
}

export function analyzeKeyFactory(
  factoryName: string,
  node: ts.ObjectLiteralExpression,
): KeyFactoryViolation[] {
  const violations: KeyFactoryViolation[] = [];

  for (const property of node.properties) {
    if (!ts.isPropertyAssignment(property) || !ts.isIdentifier(property.name)) {
      continue;
    }
    const key = property.name.text;
    const initializer = property.initializer;
    const arity = getArity(initializer);

    // 4a — params spread across multiple args instead of one object segment.
    if (arity >= 2) {
      violations.push({
        rule: "4a-param-spread",
        factory: factoryName,
        key,
        detail: `\`${key}\` takes ${arity} params; pass a single params object as one key segment.`,
      });
    }

    // 4b — non-canonical name for the standard list tier.
    if (/scope$/i.test(key)) {
      violations.push({
        rule: "4b-non-canonical-name",
        factory: factoryName,
        key,
        detail: `\`${key}\` is non-canonical; the list collection should be named \`lists\`.`,
      });
    }

    // 4c — a parameterized key inlines a string literal + param instead of
    // building on a zero-arg collection accessor (missing collection tier).
    if (arity >= 1) {
      const array = getReturnedArray(initializer);
      if (array) {
        const paramNames = getParamNames(initializer);
        const hasInlineStringLiteral = array.elements.some((el) =>
          ts.isStringLiteralLike(el),
        );
        const hasInlineParam = array.elements.some(
          (el) => ts.isIdentifier(el) && paramNames.has(el.text),
        );
        if (hasInlineStringLiteral && hasInlineParam) {
          violations.push({
            rule: "4c-missing-collection-tier",
            factory: factoryName,
            key,
            detail: `\`${key}\` inlines a literal segment next to its param; add a collection tier accessor instead.`,
          });
        }
      }
    }
  }

  return violations;
}

export function findBuilderViolations(
  sourceFile: ts.SourceFile,
): BuilderViolation[] {
  const violations: BuilderViolation[] = [];

  // 1b — React or react-query hooks imported into a vanilla package.
  for (const statement of sourceFile.statements) {
    if (!ts.isImportDeclaration(statement)) continue;
    if (!ts.isStringLiteral(statement.moduleSpecifier)) continue;
    const moduleName = statement.moduleSpecifier.text;

    if (moduleName === "react") {
      violations.push({
        rule: "1b-react-in-package",
        detail: `imports from "react" — packages must be vanilla (no React).`,
      });
    }

    if (moduleName === "@tanstack/react-query") {
      const named = statement.importClause?.namedBindings;
      if (named && ts.isNamedImports(named)) {
        const hooks = named.elements
          .map((e) => e.name.text)
          .filter((name) => REACT_QUERY_HOOKS.has(name));
        if (hooks.length > 0) {
          violations.push({
            rule: "1b-react-in-package",
            detail: `imports hook(s) ${hooks.join(", ")} — hooks belong in the app.`,
          });
        }
      }
    }
  }

  // 1a — app-preference options baked into an option builder.
  const visit = (node: ts.Node): void => {
    if (
      ts.isCallExpression(node) &&
      ts.isIdentifier(node.expression) &&
      BUILDER_CALLEES.has(node.expression.text) &&
      node.arguments.length > 0 &&
      ts.isObjectLiteralExpression(node.arguments[0])
    ) {
      for (const property of node.arguments[0].properties) {
        if (
          (ts.isPropertyAssignment(property) ||
            ts.isShorthandPropertyAssignment(property)) &&
          ts.isIdentifier(property.name) &&
          APP_PREF_OPTIONS.has(property.name.text)
        ) {
          violations.push({
            rule: "1a-app-pref-in-builder",
            detail: `\`${node.expression.text}\` builder sets \`${property.name.text}\` — relocate it to the call site (keep the constant exported).`,
          });
        }
      }
    }
    ts.forEachChild(node, visit);
  };
  visit(sourceFile);

  return violations;
}
