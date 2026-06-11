import ts from "typescript";

import { parse } from "./ast";

export type CallRewrite = {
  /** Existing key-factory method name, e.g. `listScope`. */
  from: string;
  /** Canonical replacement name, e.g. `lists`. */
  to: string;
  /**
   * When the old method spread positional params, the object-property names to
   * collapse those positional args into (arg[i] → collapseArgsToObject[i]).
   * Omit for a pure rename.
   */
  collapseArgsToObject?: string[];
};

export type KeyCallRewriteResult = {
  content: string;
  count: number;
};

function buildCollapsedArgs(
  argTexts: string[],
  propertyNames: string[],
): string {
  const pairs = argTexts.map((argText, index) => {
    const key = propertyNames[index] ?? `arg${index}`;
    return key === argText ? key : `${key}: ${argText}`;
  });
  return `{ ${pairs.join(", ")} }`;
}

/**
 * Rewrite every `<factoryName>.<from>(...)` call in a file according to the
 * rewrite rules: rename the accessed method, and (for param-collapse rules)
 * fold positional arguments into a single object segment. Pure — the generator
 * runs it across the package and all consumers.
 */
export function rewriteKeyCalls(
  content: string,
  factoryName: string,
  rewrites: CallRewrite[],
): KeyCallRewriteResult {
  const byName = new Map(rewrites.map((r) => [r.from, r]));
  if (byName.size === 0) {
    return { content, count: 0 };
  }

  const sourceFile = parse(content);
  type Edit = { start: number; end: number; replacement: string };
  const edits: Edit[] = [];

  const visit = (node: ts.Node): void => {
    if (
      ts.isCallExpression(node) &&
      ts.isPropertyAccessExpression(node.expression) &&
      ts.isIdentifier(node.expression.expression) &&
      node.expression.expression.text === factoryName
    ) {
      const rewrite = byName.get(node.expression.name.text);
      if (rewrite) {
        // Rename the accessed method.
        const nameNode = node.expression.name;
        edits.push({
          start: nameNode.getStart(sourceFile),
          end: nameNode.getEnd(),
          replacement: rewrite.to,
        });

        // Collapse positional args into one object segment, if requested.
        if (rewrite.collapseArgsToObject && node.arguments.length > 0) {
          const argTexts = node.arguments.map((arg) => arg.getText(sourceFile));
          const firstArg = node.arguments[0];
          const lastArg = node.arguments[node.arguments.length - 1];
          edits.push({
            start: firstArg.getStart(sourceFile),
            end: lastArg.getEnd(),
            replacement: buildCollapsedArgs(
              argTexts,
              rewrite.collapseArgsToObject,
            ),
          });
        }
      }
    }
    ts.forEachChild(node, visit);
  };
  visit(sourceFile);

  if (edits.length === 0) {
    return { content, count: 0 };
  }

  let next = content;
  for (const edit of edits.sort((a, b) => b.start - a.start)) {
    next = next.slice(0, edit.start) + edit.replacement + next.slice(edit.end);
  }

  // count = number of distinct call sites rewritten (rename edits, not arg edits)
  const callSites = edits.filter((e) =>
    rewrites.some((r) => r.to === e.replacement),
  ).length;
  return { content: next, count: callSites };
}
