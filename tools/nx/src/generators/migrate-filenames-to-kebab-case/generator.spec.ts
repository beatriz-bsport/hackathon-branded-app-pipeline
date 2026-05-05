import { type Tree, addProjectConfiguration } from "@nx/devkit";
import { createTreeWithEmptyWorkspace } from "@nx/devkit/testing";
import { describe, expect, it } from "vitest";

import { migrateFilenamesToKebabCaseGenerator } from "./generator";

const projectRoot = "apps/applications/studio-manager/cdp/smartlists";

function setupSmartlistsTree(): Tree {
  const tree = createTreeWithEmptyWorkspace();

  addProjectConfiguration(tree, "@bsport/sm-smartlists", {
    root: projectRoot,
    projectType: "application",
    sourceRoot: `${projectRoot}/src`,
    targets: {},
  });

  tree.write(
    `${projectRoot}/src/App.tsx`,
    [
      'import { AutomationCreateEditRouter } from "#src/routers/AutomationCreateEditRouter";',
      'import { CampaignPage } from "#src/pages/CampaignPage/CampaignPage";',
      "",
      "export function App() {",
      "  return AutomationCreateEditRouter && CampaignPage ? null : null;",
      "}",
      "",
    ].join("\n"),
  );

  tree.write(
    `${projectRoot}/src/routers/AutomationCreateEditRouter.tsx`,
    [
      'import { CampaignPage } from "../pages/CampaignPage/CampaignPage";',
      'import { CampaignTypeSelectorModal } from "#src/components/CampaignTypeSelector/CampaignTypeSelectorModal";',
      "",
      "export function AutomationCreateEditRouter() {",
      "  return CampaignPage && CampaignTypeSelectorModal ? null : null;",
      "}",
      "",
    ].join("\n"),
  );

  tree.write(
    `${projectRoot}/src/pages/CampaignPage/CampaignPage.tsx`,
    [
      'import { CampaignTypeSelectorModal } from "#src/components/CampaignTypeSelector/CampaignTypeSelectorModal";',
      'import { HelperWidget } from "./HelperWidget";',
      "",
      "export function CampaignPage() {",
      "  return CampaignTypeSelectorModal && HelperWidget ? null : null;",
      "}",
      "",
    ].join("\n"),
  );

  tree.write(
    `${projectRoot}/src/pages/CampaignPage/HelperWidget.tsx`,
    ["export function HelperWidget() {", "  return null;", "}", ""].join("\n"),
  );

  tree.write(
    `${projectRoot}/src/pages/CampaignPage/index.ts`,
    'export { CampaignPage } from "./CampaignPage";\n',
  );

  tree.write(
    `${projectRoot}/src/components/CampaignTypeSelector/CampaignTypeSelectorModal.tsx`,
    [
      "export function CampaignTypeSelectorModal() {",
      "  return null;",
      "}",
      "",
    ].join("\n"),
  );

  tree.write(
    `${projectRoot}/src/modules.d.ts`,
    'declare module "sm-smartlists/App" {}\n',
  );

  tree.write(
    `${projectRoot}/src/vite-env.d.ts`,
    '/// <reference types="vite/client" />\n',
  );

  return tree;
}

describe("migrateFilenamesToKebabCaseGenerator", () => {
  it("renames source files to kebab-case and updates package-local references", async () => {
    const tree = setupSmartlistsTree();

    await migrateFilenamesToKebabCaseGenerator(tree, { appName: "smartlists" });

    expect(tree.exists(`${projectRoot}/src/app.tsx`)).toBe(true);
    expect(
      tree.exists(
        `${projectRoot}/src/routers/automation-create-edit-router.tsx`,
      ),
    ).toBe(true);
    expect(
      tree.exists(`${projectRoot}/src/pages/campaign-page/campaign-page.tsx`),
    ).toBe(true);
    expect(
      tree.exists(`${projectRoot}/src/pages/campaign-page/helper-widget.tsx`),
    ).toBe(true);
    expect(
      tree.exists(
        `${projectRoot}/src/components/campaign-type-selector/campaign-type-selector-modal.tsx`,
      ),
    ).toBe(true);

    expect(tree.exists(`${projectRoot}/src/App.tsx`)).toBe(false);
    expect(
      tree.exists(`${projectRoot}/src/routers/AutomationCreateEditRouter.tsx`),
    ).toBe(false);

    const appContent = tree.read(`${projectRoot}/src/app.tsx`, "utf-8");
    expect(appContent).toContain("automation-create-edit-router");
    expect(appContent).toContain("pages/campaign-page/campaign-page");

    const routerContent = tree.read(
      `${projectRoot}/src/routers/automation-create-edit-router.tsx`,
      "utf-8",
    );
    expect(routerContent).toContain("../pages/campaign-page/campaign-page");
    expect(routerContent).toContain(
      "#src/components/campaign-type-selector/campaign-type-selector-modal",
    );

    const pageContent = tree.read(
      `${projectRoot}/src/pages/campaign-page/campaign-page.tsx`,
      "utf-8",
    );
    expect(pageContent).toContain("./helper-widget");

    const indexContent = tree.read(
      `${projectRoot}/src/pages/campaign-page/index.ts`,
      "utf-8",
    );
    expect(indexContent).toContain("./campaign-page");
  });

  it("accepts the same appName variants as the existing migration", async () => {
    const inputs = ["smartlists", "sm-smartlists", "@bsport/sm-smartlists"];

    for (const appName of inputs) {
      const tree = setupSmartlistsTree();

      await migrateFilenamesToKebabCaseGenerator(tree, { appName });

      expect(tree.exists(`${projectRoot}/src/app.tsx`)).toBe(true);
      expect(
        tree.exists(
          `${projectRoot}/src/routers/automation-create-edit-router.tsx`,
        ),
      ).toBe(true);
    }
  });

  it("preserves declaration file suffixes", async () => {
    const tree = setupSmartlistsTree();

    await migrateFilenamesToKebabCaseGenerator(tree, { appName: "smartlists" });

    expect(tree.exists(`${projectRoot}/src/modules.d.ts`)).toBe(true);
    expect(tree.exists(`${projectRoot}/src/vite-env.d.ts`)).toBe(true);
  });

  it("rewrites side-effect imports and preserves query suffixes", async () => {
    const tree = setupSmartlistsTree();

    tree.write(
      `${projectRoot}/src/index.tsx`,
      [
        'import "./App";',
        'import "#src/components/CampaignTypeSelector/CampaignTypeSelectorModal";',
        'import iconUrl from "./components/CampaignTypeSelector/CampaignTypeSelectorModal.tsx?url";',
        "",
        "void iconUrl;",
        "",
      ].join("\n"),
    );

    await migrateFilenamesToKebabCaseGenerator(tree, { appName: "smartlists" });

    const indexContent = tree.read(`${projectRoot}/src/index.tsx`, "utf-8");
    expect(indexContent).toContain("./app");
    expect(indexContent).toContain(
      "campaign-type-selector/campaign-type-selector-modal",
    );
    expect(indexContent).toContain(
      "./components/campaign-type-selector/campaign-type-selector-modal.tsx?url",
    );
  });

  it("renames folders and recalculates relative imports from the future path", async () => {
    const tree = createTreeWithEmptyWorkspace();

    addProjectConfiguration(tree, "@bsport/sm-smartlists", {
      root: projectRoot,
      projectType: "application",
      sourceRoot: `${projectRoot}/src`,
      targets: {},
    });

    tree.write(
      `${projectRoot}/src/components/FileInput/FileInput.tsx`,
      [
        'import { useField } from "../../hooks/useField";',
        "",
        "export function FileInput() {",
        "  return useField ? null : null;",
        "}",
        "",
      ].join("\n"),
    );
    tree.write(
      `${projectRoot}/src/hooks/useField.ts`,
      "export const useField = true;\n",
    );

    await migrateFilenamesToKebabCaseGenerator(tree, { appName: "smartlists" });

    expect(
      tree.exists(`${projectRoot}/src/components/file-input/file-input.tsx`),
    ).toBe(true);

    const fileInputContent = tree.read(
      `${projectRoot}/src/components/file-input/file-input.tsx`,
      "utf-8",
    );
    expect(fileInputContent).toContain("../hooks/use-field");
  });

  it("throws when a rename would overwrite an unchanged file", async () => {
    const tree = createTreeWithEmptyWorkspace();

    addProjectConfiguration(tree, "@bsport/sm-smartlists", {
      root: projectRoot,
      projectType: "application",
      sourceRoot: `${projectRoot}/src`,
      targets: {},
    });

    tree.write(`${projectRoot}/src/Foo.tsx`, "export const Foo = null;\n");
    tree.write(`${projectRoot}/src/foo.tsx`, "export const foo = null;\n");

    await expect(
      migrateFilenamesToKebabCaseGenerator(tree, { appName: "smartlists" }),
    ).rejects.toThrowError(/would overwrite existing file/);
  });

  it("uses tree rename for case-only renames", async () => {
    const tree = setupSmartlistsTree();

    await migrateFilenamesToKebabCaseGenerator(tree, { appName: "smartlists" });

    expect(tree.read(`${projectRoot}/src/app.tsx`, "utf-8")).toContain(
      "export function App()",
    );
  });

  it("skips i18n json resources to avoid Transifex conflicts", async () => {
    const tree = setupSmartlistsTree();

    tree.write(`${projectRoot}/src/i18n/en_US.json`, '{"hello":"world"}\n');
    tree.write(
      `${projectRoot}/src/i18n/admin/pt_BR.json`,
      '{"hello":"world"}\n',
    );

    await migrateFilenamesToKebabCaseGenerator(tree, { appName: "smartlists" });

    expect(tree.exists(`${projectRoot}/src/i18n/en_US.json`)).toBe(true);
    expect(tree.exists(`${projectRoot}/src/i18n/en-us.json`)).toBe(false);
    expect(tree.exists(`${projectRoot}/src/i18n/admin/pt_BR.json`)).toBe(true);
    expect(tree.exists(`${projectRoot}/src/i18n/admin/pt-br.json`)).toBe(false);
  });
});
