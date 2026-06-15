import { type Tree, addProjectConfiguration } from "@nx/devkit";
import { createTreeWithEmptyWorkspace } from "@nx/devkit/testing";
import { beforeEach, describe, expect, it } from "vitest";

import {
  findRelocatableOptions,
  relocateAtCallSites,
  stripBuilderOptions,
} from "../align-api-shared/builder-relocate";
import { vanillaizeBuildersGenerator } from "./generator";

const root = "packages/api/cdp";

describe("builder-relocate (pure)", () => {
  const builderSource = [
    'import { queryOptions } from "@tanstack/react-query";',
    'import { MEMBER_STALE_TIME, memberKeys } from "./api";',
    "export const memberListQueryOptions = (fetch, params) =>",
    "  queryOptions({",
    "    queryKey: memberKeys.list(params),",
    "    queryFn: () => fetch(params),",
    "    staleTime: MEMBER_STALE_TIME,",
    "  });",
  ].join("\n");

  it("finds app-pref options tagged with their builder", () => {
    const found = findRelocatableOptions(builderSource);
    expect(found).toEqual([
      {
        builderName: "memberListQueryOptions",
        option: "staleTime",
        valueText: "MEMBER_STALE_TIME",
      },
    ]);
  });

  it("strips the option from the builder", () => {
    const stripped = stripBuilderOptions(builderSource, [
      {
        builderName: "memberListQueryOptions",
        option: "staleTime",
        valueText: "MEMBER_STALE_TIME",
      },
    ]);
    expect(stripped).not.toContain("staleTime");
    expect(stripped).toContain("queryKey: memberKeys.list(params)");
  });

  it("wraps a bare builder arg (shape A)", () => {
    const result = relocateAtCallSites(
      "const q = useSuspenseQuery(memberListQueryOptions(fetch, params));",
      "memberListQueryOptions",
      [{ option: "staleTime", valueText: "MEMBER_STALE_TIME" }],
    );
    expect(result.unhandleable).toHaveLength(0);
    expect(result.content).toContain(
      "useSuspenseQuery({ ...memberListQueryOptions(fetch, params), staleTime: MEMBER_STALE_TIME })",
    );
  });

  it("adds the option to an existing spread object (shape B)", () => {
    const result = relocateAtCallSites(
      "const q = useQuery({ ...memberListQueryOptions(fetch, params), enabled });",
      "memberListQueryOptions",
      [{ option: "staleTime", valueText: "MEMBER_STALE_TIME" }],
    );
    expect(result.unhandleable).toHaveLength(0);
    expect(result.content).toContain("staleTime: MEMBER_STALE_TIME");
    expect(result.content).toContain("enabled");
  });

  it("flags an unhandleable assign-then-use site", () => {
    const result = relocateAtCallSites(
      "const opts = memberListQueryOptions(fetch, params); useQuery(opts);",
      "memberListQueryOptions",
      [{ option: "staleTime", valueText: "MEMBER_STALE_TIME" }],
    );
    expect(result.unhandleable.length).toBeGreaterThan(0);
    expect(result.content).toContain("const opts = memberListQueryOptions"); // untouched
  });
});

describe("vanillaizeBuildersGenerator", () => {
  let tree: Tree;

  beforeEach(() => {
    tree = createTreeWithEmptyWorkspace();
    addProjectConfiguration(tree, "@bsport/api-cdp", {
      root,
      projectType: "library",
      sourceRoot: `${root}/src`,
      targets: {},
    });
    tree.write(`${root}/src/member/index.ts`, 'export * from "./api";');
    tree.write(
      `${root}/src/member/api.ts`,
      "export const memberKeys = {};\nexport const MEMBER_STALE_TIME = 120000;",
    );
    tree.write(
      `${root}/src/member/query-options.ts`,
      [
        'import { queryOptions } from "@tanstack/react-query";',
        'import { MEMBER_STALE_TIME, memberKeys } from "./api";',
        "export const memberListQueryOptions = (fetch, params) =>",
        "  queryOptions({",
        "    queryKey: memberKeys.list(params),",
        "    queryFn: () => fetch(params),",
        "    staleTime: MEMBER_STALE_TIME,",
        "  });",
      ].join("\n"),
    );
  });

  it("aborts (no changes) when a call site is unhandleable", async () => {
    tree.write(
      "apps/x/src/bad.ts",
      'import { memberListQueryOptions } from "@bsport/api-cdp/member";\nconst opts = memberListQueryOptions(fetch, params);\nexport const q = () => useQuery(opts);',
    );
    await vanillaizeBuildersGenerator(tree, {
      appName: "cdp",
      resource: "member",
    });

    // builder still carries the option — nothing was touched
    expect(tree.read(`${root}/src/member/query-options.ts`, "utf-8")).toContain(
      "staleTime",
    );
  });

  it("relocates the option and imports the constant at a clean call site", async () => {
    tree.write(
      "apps/x/src/good.ts",
      [
        'import { memberListQueryOptions } from "@bsport/api-cdp/member";',
        "export const useList = (fetch, params) =>",
        "  useSuspenseQuery(memberListQueryOptions(fetch, params));",
      ].join("\n"),
    );
    await vanillaizeBuildersGenerator(tree, {
      appName: "cdp",
      resource: "member",
    });

    const builder =
      tree.read(`${root}/src/member/query-options.ts`, "utf-8") ?? "";
    expect(builder).not.toContain("staleTime");
    // MEMBER_STALE_TIME no longer used in the builder file → import dropped
    // cleanly (no dangling comma).
    expect(builder).not.toContain("MEMBER_STALE_TIME");
    expect(builder).toMatch(
      /import\s*{\s*memberKeys\s*}\s*from\s*["']\.\/api["']/,
    );
    expect(builder).not.toMatch(/{\s*,/);

    const consumer = tree.read("apps/x/src/good.ts", "utf-8") ?? "";
    expect(consumer).toContain("staleTime: MEMBER_STALE_TIME");
    expect(consumer).toMatch(
      /import\s*{[^}]*MEMBER_STALE_TIME[^}]*}\s*from\s*["']@bsport\/api-cdp\/member["']/,
    );
  });
});
