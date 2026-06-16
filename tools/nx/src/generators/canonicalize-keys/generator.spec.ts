import { type Tree, addProjectConfiguration } from "@nx/devkit";
import { createTreeWithEmptyWorkspace } from "@nx/devkit/testing";
import { describe, expect, it } from "vitest";

import { rewriteKeyCalls } from "../align-api-shared/key-rewrites";
import { canonicalizeKeysGenerator } from "./generator";

const root = "packages/api/cdp";

describe("rewriteKeyCalls (pure)", () => {
  it("renames a method at the call site, preserving args", () => {
    const result = rewriteKeyCalls(
      "queryClient.invalidateQueries({ queryKey: memberKeys.listScope() });",
      "memberKeys",
      [{ from: "listScope", to: "lists" }],
    );
    expect(result.content).toContain("memberKeys.lists()");
    expect(result.count).toBe(1);
  });

  it("collapses positional args into one object segment", () => {
    const result = rewriteKeyCalls(
      'const k = emailTemplateKeys.searchQueries(query, "a", 2);',
      "emailTemplateKeys",
      [
        {
          from: "searchQueries",
          to: "searchQuery",
          collapseArgsToObject: ["query", "id__in", "page"],
        },
      ],
    );
    expect(result.content).toContain(
      'emailTemplateKeys.searchQuery({ query, id__in: "a", page: 2 })',
    );
  });

  it("ignores same-named methods on a different object", () => {
    const result = rewriteKeyCalls(
      "const x = otherKeys.listScope();",
      "memberKeys",
      [{ from: "listScope", to: "lists" }],
    );
    expect(result.content).toContain("otherKeys.listScope()");
    expect(result.count).toBe(0);
  });
});

describe("canonicalizeKeysGenerator", () => {
  function setupTree(): Tree {
    const tree = createTreeWithEmptyWorkspace();
    addProjectConfiguration(tree, "@bsport/api-cdp", {
      root,
      projectType: "library",
      sourceRoot: `${root}/src`,
      targets: {},
    });
    tree.write(`${root}/src/member/index.ts`, 'export * from "./api";');
    tree.write(
      `${root}/src/member/api.ts`,
      [
        'import { QUERY_KEY_MAIN } from "#src/constants";',
        "export const memberKeys = {",
        '  all: [QUERY_KEY_MAIN, "member"] as const,',
        '  listScope: () => [...memberKeys.all, "list"] as const,',
        "  list: (params) => [...memberKeys.listScope(), params] as const,",
        "} as const;",
      ].join("\n"),
    );
    // a consumer invalidating with the old name
    tree.write(
      "apps/x/src/use-thing.ts",
      'import { memberKeys } from "@bsport/api-cdp/member";\nexport const f = (qc) => qc.invalidateQueries({ queryKey: memberKeys.listScope() });',
    );
    return tree;
  }

  it("swaps the factory literal and rewrites consumer call sites", async () => {
    const tree = setupTree();
    tree.write(
      "tmp-map.json",
      JSON.stringify({
        factoryName: "memberKeys",
        factorySource: [
          "{",
          '  all: [QUERY_KEY_MAIN, "member"] as const,',
          '  lists: () => [...memberKeys.all, "lists"] as const,',
          "  list: (params) => [...memberKeys.lists(), params] as const,",
          "}",
        ].join("\n"),
        callRewrites: [{ from: "listScope", to: "lists" }],
      }),
    );

    await canonicalizeKeysGenerator(tree, {
      appName: "cdp",
      resource: "member",
      mapFile: "tmp-map.json",
    });

    const factory = tree.read(`${root}/src/member/api.ts`, "utf-8") ?? "";
    expect(factory).toContain("lists: () =>");
    expect(factory).not.toContain("listScope");

    const consumer = tree.read("apps/x/src/use-thing.ts", "utf-8") ?? "";
    expect(consumer).toContain("memberKeys.lists()");
    expect(consumer).not.toContain("listScope");
  });
});
