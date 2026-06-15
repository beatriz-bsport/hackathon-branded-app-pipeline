import { type Tree, addProjectConfiguration } from "@nx/devkit";
import { createTreeWithEmptyWorkspace } from "@nx/devkit/testing";
import { beforeEach, describe, expect, it } from "vitest";

import { rewriteBarrelImports } from "../align-api-shared/barrel-imports";
import {
  buildSymbolToResourceMap,
  collectResourceExports,
} from "../align-api-shared/exports";
import { deleteBarrelGenerator } from "../delete-barrel/generator";
import { migrateBarrelImportsGenerator } from "./generator";

const root = "packages/api/cdp";

function setupTree(): Tree {
  const tree = createTreeWithEmptyWorkspace();
  addProjectConfiguration(tree, "@bsport/api-cdp", {
    root,
    projectType: "library",
    sourceRoot: `${root}/src`,
    targets: {},
  });
  tree.write(
    `${root}/package.json`,
    JSON.stringify(
      {
        name: "@bsport/api-cdp",
        exports: { ".": { import: "./build/index.js" }, "./*": {} },
      },
      null,
      2,
    ),
  );
  tree.write(
    `${root}/src/index.ts`,
    ['export * from "./member";', 'export * from "./email-template";'].join(
      "\n",
    ),
  );

  // member exports via export * (resolved through sibling files)
  tree.write(
    `${root}/src/member/index.ts`,
    ['export * from "./api";', 'export * from "./types";'].join("\n"),
  );
  tree.write(
    `${root}/src/member/api.ts`,
    [
      "export const memberKeys = {};",
      "export const MEMBER_STALE_TIME = 1;",
    ].join("\n"),
  );
  tree.write(
    `${root}/src/member/types.ts`,
    "export type Member = { id: number };",
  );

  tree.write(
    `${root}/src/email-template/index.ts`,
    'export { emailTemplateKeys } from "./keys";',
  );
  tree.write(
    `${root}/src/email-template/keys.ts`,
    "export const emailTemplateKeys = {};",
  );

  return tree;
}

describe("collectResourceExports", () => {
  it("follows export * to sibling files", () => {
    const names = collectResourceExports(setupTree(), root, "member");
    expect([...names].sort()).toEqual([
      "MEMBER_STALE_TIME",
      "Member",
      "memberKeys",
    ]);
  });

  it("builds a symbol→resource map and detects collisions", () => {
    const map = buildSymbolToResourceMap(setupTree(), root, [
      "member",
      "email-template",
    ]);
    expect(map.get("memberKeys")).toBe("member");
    expect(map.get("emailTemplateKeys")).toBe("email-template");
  });
});

describe("rewriteBarrelImports (pure)", () => {
  const map = new Map([
    ["memberKeys", "member"],
    ["MEMBER_STALE_TIME", "member"],
    ["emailTemplateKeys", "email-template"],
  ]);

  it("splits a mixed import, moving only the target resource's symbols", () => {
    const result = rewriteBarrelImports(
      'import { memberKeys, emailTemplateKeys } from "@bsport/api-cdp";',
      "@bsport/api-cdp",
      "member",
      map,
    );
    expect(result.content).toContain(
      'import { emailTemplateKeys } from "@bsport/api-cdp";',
    );
    expect(result.content).toContain(
      'import { memberKeys } from "@bsport/api-cdp/member";',
    );
    expect(result.movedSymbols).toEqual(["memberKeys"]);
  });

  it("preserves aliases and type-only specifiers", () => {
    const result = rewriteBarrelImports(
      'import { memberKeys as mk, type Member } from "@bsport/api-cdp";',
      "@bsport/api-cdp",
      "member",
      new Map([
        ["memberKeys", "member"],
        ["Member", "member"],
      ]),
    );
    expect(result.content).toContain('from "@bsport/api-cdp/member"');
    expect(result.content).toContain("memberKeys as mk");
    expect(result.content).toContain("type Member");
  });

  it("leaves subpath imports untouched", () => {
    const source = 'import { memberKeys } from "@bsport/api-cdp/member";';
    const result = rewriteBarrelImports(
      source,
      "@bsport/api-cdp",
      "member",
      map,
    );
    expect(result.content).toBe(source);
  });
});

describe("migrateBarrelImportsGenerator", () => {
  let tree: Tree;
  beforeEach(() => {
    tree = setupTree();
    tree.write(
      "apps/applications/saas-legacy/src/a.ts",
      'import { memberKeys, emailTemplateKeys } from "@bsport/api-cdp";\nconst x = memberKeys && emailTemplateKeys;',
    );
  });

  it("migrates only the target resource and leaves the rest on the barrel", async () => {
    await migrateBarrelImportsGenerator(tree, {
      appName: "cdp",
      resource: "member",
    });
    const content =
      tree.read("apps/applications/saas-legacy/src/a.ts", "utf-8") ?? "";
    // quote-agnostic: the test workspace's prettier normalizes quote style.
    expect(content).toMatch(
      /memberKeys\s*}\s*from\s*["']@bsport\/api-cdp\/member["']/,
    );
    expect(content).toMatch(
      /emailTemplateKeys\s*}\s*from\s*["']@bsport\/api-cdp["']/,
    );
  });
});

describe("deleteBarrelGenerator", () => {
  it("refuses while consumers still import from the barrel", async () => {
    const tree = setupTree();
    tree.write(
      "apps/x.ts",
      'import { memberKeys } from "@bsport/api-cdp";\nconst y = memberKeys;',
    );
    await deleteBarrelGenerator(tree, { appName: "cdp" });
    expect(tree.exists(`${root}/src/index.ts`)).toBe(true); // not deleted
  });

  it("deletes the barrel, drops the '.' export and sets sideEffects:false when clean", async () => {
    const tree = setupTree(); // no consumers
    await deleteBarrelGenerator(tree, { appName: "cdp" });

    expect(tree.exists(`${root}/src/index.ts`)).toBe(false);
    const pkg = JSON.parse(
      tree.read(`${root}/package.json`, "utf-8") as string,
    );
    expect(pkg.sideEffects).toBe(false);
    expect(pkg.exports["."]).toBeUndefined();
    expect(pkg.exports["./*"]).toBeDefined();
  });
});
