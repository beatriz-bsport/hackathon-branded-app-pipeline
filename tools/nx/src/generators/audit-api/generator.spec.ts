import { type Tree, addProjectConfiguration } from "@nx/devkit";
import { createTreeWithEmptyWorkspace } from "@nx/devkit/testing";
import { describe, expect, it } from "vitest";

import {
  analyzeKeyFactory,
  findBuilderViolations,
  findKeyFactories,
  parse,
} from "../align-api-shared/ast";
import { countRootBarrelImports } from "../align-api-shared/consumers";
import { auditApiPackage, hasFindings } from "./audit";

const root = "packages/api/cdp";

function analyzeKeys(source: string) {
  const sourceFile = parse(source);
  return findKeyFactories(sourceFile).flatMap((f) =>
    analyzeKeyFactory(f.name, f.node),
  );
}

function setupTree(): Tree {
  const tree = createTreeWithEmptyWorkspace();

  addProjectConfiguration(tree, "@bsport/api-cdp", {
    root,
    projectType: "library",
    sourceRoot: `${root}/src`,
    targets: {},
  });

  // package.json WITHOUT sideEffects: false (a Rule 3 violation)
  tree.write(
    `${root}/package.json`,
    JSON.stringify({ name: "@bsport/api-cdp" }, null, 2),
  );

  tree.write(
    `${root}/src/constants.ts`,
    `export const QUERY_KEY_MAIN = "@api-cdp";`,
  );

  // root barrel using export * (Rule 3 violation)
  tree.write(
    `${root}/src/index.ts`,
    ['export * from "./member";', 'export * from "./email-template";'].join(
      "\n",
    ),
  );

  // member resource — listScope (4b), inline detail (4c), staleTime in builder (1a)
  tree.write(`${root}/src/member/index.ts`, 'export * from "./api";');
  tree.write(
    `${root}/src/member/api.ts`,
    [
      'import { QUERY_KEY_MAIN } from "#src/constants";',
      "export const MEMBER_STALE_TIME = 120000;",
      "export const memberKeys = {",
      '  all: [QUERY_KEY_MAIN, "member"] as const,',
      '  listScope: () => [...memberKeys.all, "list"] as const,',
      "  list: (params) => [...memberKeys.listScope(), params] as const,",
      '  detail: (id) => [...memberKeys.all, "detail", id] as const,',
      "} as const;",
    ].join("\n"),
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

  // email-template — param spreading (4a)
  tree.write(`${root}/src/email-template/index.ts`, 'export * from "./keys";');
  tree.write(
    `${root}/src/email-template/keys.ts`,
    [
      'import { QUERY_KEY_MAIN } from "#src/constants";',
      "export const emailTemplateKeys = {",
      '  emailTemplate: () => [QUERY_KEY_MAIN, "email-template"] as const,',
      "  emailTemplateSearchQueries: (query, id__in, page, page_size) =>",
      "    [...emailTemplateKeys.emailTemplate(), query, id__in, page, page_size] as const,",
      "} as const;",
    ].join("\n"),
  );

  // a consumer importing from the root barrel
  tree.write(
    "apps/applications/saas-legacy/src/x.ts",
    'import { memberKeys } from "@bsport/api-cdp";\nconst y = memberKeys;',
  );
  // a consumer importing from a subpath (must NOT be counted)
  tree.write(
    "apps/applications/studio-manager/y.ts",
    'import { memberKeys } from "@bsport/api-cdp/member";\nconst z = memberKeys;',
  );

  return tree;
}

describe("ast key-factory analysis", () => {
  it("flags param spreading (4a)", () => {
    const violations = analyzeKeys(
      "export const thingKeys = { search: (a, b, c) => [a, b, c] as const } as const;",
    );
    expect(violations.map((v) => v.rule)).toContain("4a-param-spread");
  });

  it("flags non-canonical *Scope names (4b)", () => {
    const violations = analyzeKeys(
      'export const memberKeys = { listScope: () => ["x"] as const } as const;',
    );
    expect(violations.map((v) => v.rule)).toContain("4b-non-canonical-name");
  });

  it("flags an inline literal+param key missing its collection tier (4c)", () => {
    const violations = analyzeKeys(
      'export const memberKeys = { detail: (id) => [...memberKeys.all, "detail", id] as const } as const;',
    );
    expect(violations.map((v) => v.rule)).toContain(
      "4c-missing-collection-tier",
    );
  });

  it("does not flag a canonical parameterized key built on a collection accessor", () => {
    const violations = analyzeKeys(
      "export const memberKeys = { list: (params) => [...memberKeys.lists(), params] as const } as const;",
    );
    expect(violations).toHaveLength(0);
  });
});

describe("ast builder analysis", () => {
  it("flags app-pref options baked into a builder (1a)", () => {
    const sourceFile = parse(
      'import { queryOptions } from "@tanstack/react-query";\nexport const o = () => queryOptions({ queryKey: [], queryFn: () => 1, staleTime: 5 });',
    );
    const violations = findBuilderViolations(sourceFile);
    expect(violations.map((v) => v.rule)).toContain("1a-app-pref-in-builder");
  });

  it("flags react-query hooks imported into a package (1b)", () => {
    const sourceFile = parse(
      'import { useQuery } from "@tanstack/react-query";',
    );
    const violations = findBuilderViolations(sourceFile);
    expect(violations.map((v) => v.rule)).toContain("1b-react-in-package");
  });
});

describe("countRootBarrelImports", () => {
  it("counts root-barrel imports but not subpath imports", () => {
    expect(
      countRootBarrelImports(
        'import { a } from "@bsport/api-cdp";',
        "@bsport/api-cdp",
      ),
    ).toBe(1);
    expect(
      countRootBarrelImports(
        'import { a } from "@bsport/api-cdp/member";',
        "@bsport/api-cdp",
      ),
    ).toBe(0);
  });
});

describe("auditApiPackage", () => {
  it("detects the seeded divergences across rules 1/3/4", () => {
    const audit = auditApiPackage(setupTree(), "cdp");

    expect(audit.packageName).toBe("@bsport/api-cdp");
    expect(audit.sideEffectsDeclaredFalse).toBe(false);
    expect(audit.rootBarrelExportStar).toBe(true);
    expect(audit.barrelImportSiteCount).toBe(1); // subpath import excluded

    const member = audit.resources.find((r) => r.resource === "member");
    expect(member?.resourceIndexExportStar).toBe(true);
    expect(member?.builderViolations.map((v) => v.rule)).toContain(
      "1a-app-pref-in-builder",
    );
    const memberRules = member?.keyViolations.map((v) => v.rule) ?? [];
    expect(memberRules).toContain("4b-non-canonical-name");
    expect(memberRules).toContain("4c-missing-collection-tier");

    const email = audit.resources.find((r) => r.resource === "email-template");
    expect(email?.keyViolations.map((v) => v.rule)).toContain(
      "4a-param-spread",
    );

    expect(hasFindings(audit)).toBe(true);
  });

  it("can scope to a single resource", () => {
    const audit = auditApiPackage(setupTree(), "@bsport/api-cdp", "member");
    expect(audit.resources).toHaveLength(1);
    expect(audit.resources[0].resource).toBe("member");
  });

  it("reports no findings on an aligned package", () => {
    const tree = createTreeWithEmptyWorkspace();
    addProjectConfiguration(tree, "@bsport/api-clean", {
      root: "packages/api/clean",
      projectType: "library",
      sourceRoot: "packages/api/clean/src",
      targets: {},
    });
    tree.write(
      "packages/api/clean/package.json",
      JSON.stringify({ name: "@bsport/api-clean", sideEffects: false }),
    );
    tree.write(
      "packages/api/clean/src/index.ts",
      'export { thingKeys } from "./thing";',
    );
    tree.write(
      "packages/api/clean/src/thing/index.ts",
      'export { thingKeys } from "./api";',
    );
    tree.write(
      "packages/api/clean/src/thing/api.ts",
      [
        "export const thingKeys = {",
        '  all: ["@api-clean", "thing"] as const,',
        '  lists: () => [...thingKeys.all, "lists"] as const,',
        "  list: (params) => [...thingKeys.lists(), params] as const,",
        "} as const;",
      ].join("\n"),
    );

    const audit = auditApiPackage(tree, "clean");
    expect(hasFindings(audit)).toBe(false);
  });
});
