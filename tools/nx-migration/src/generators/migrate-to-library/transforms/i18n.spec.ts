import { type Tree } from "@nx/devkit";
import { createTreeWithEmptyWorkspace } from "@nx/devkit/testing";
import { describe, expect, it } from "vitest";

import { transformI18n } from "./i18n";

const appRoot = "apps/applications/studio-manager/buyables/giftcard";
const packageName = "@bsport/sm-giftcard";

const giftcardI18nUtilsBefore = `import { type TFunctionGeneric, instanciateAppI18n } from "@bsport/i18n";

import namespaces from "#src/i18n/namespaces.json";
import type commonTranslations from "#src/i18n/source/common.json";
import type giftcardDetailsTranslations from "#src/i18n/source/giftcard-details.json";
import type imageUploadTranslations from "#src/i18n/source/imageUpload.json";

type Translations = {
  common: typeof commonTranslations;
  imageUpload: typeof imageUploadTranslations;
  "giftcard-details": typeof giftcardDetailsTranslations;
};

const applicationName = __GIFTCARD__.__I18N_NAMESPACE_PREFIX__;
const applicationUrl = __GIFTCARD__.__APPLICATION_BASE_URL__;

export const {
  i18nInstance,
  useTranslation,
  withTranslation,
  getFixedNamespace,
  AppI18nextProvider,
} = instanciateAppI18n<Translations>({
  applicationName,
  applicationUrl,
  namespaces,
  debug: import.meta.env.DEV,
});

export type TFunction = TFunctionGeneric<Translations>;

export { Trans, LANGUAGES, LOCALES, type Locale } from "@bsport/i18n";
`;

function setupTree(): Tree {
  const tree = createTreeWithEmptyWorkspace();

  tree.write(
    `${appRoot}/src/i18n/namespaces.json`,
    '["common", "imageUpload", "giftcard-details"]',
  );
  tree.write(`${appRoot}/src/utils/i18n.ts`, giftcardI18nUtilsBefore);

  return tree;
}

describe("transformI18n", () => {
  it("transformI18n generates correct src/i18n/index.ts from namespaces.json", () => {
    const tree = setupTree();

    transformI18n(tree, appRoot, packageName);

    const indexPath = `${appRoot}/src/i18n/index.ts`;
    const indexContent = tree.read(indexPath)?.toString();

    expect(indexContent).toBeDefined();
    expect(indexContent).toContain("inMemoryTranslationsLoader");
    expect(indexContent).toContain("__GIFTCARD__.__I18N_NAMESPACE_PREFIX__");
    expect(indexContent).toContain(
      '["common", "imageUpload", "giftcard-details"]',
    );
  });

  it("transformI18n deletes namespaces.json", () => {
    const tree = setupTree();

    transformI18n(tree, appRoot, packageName);

    expect(tree.exists(`${appRoot}/src/i18n/namespaces.json`)).toBe(false);
  });

  it("transformI18n rewrites utils/i18n.ts correctly", () => {
    const tree = setupTree();

    transformI18n(tree, appRoot, packageName);

    const utilsContent = tree.read(`${appRoot}/src/utils/i18n.ts`)?.toString();

    expect(utilsContent).toBeDefined();
    expect(utilsContent).not.toContain(
      'import namespaces from "#src/i18n/namespaces.json";',
    );
    expect(utilsContent).not.toContain("__GIFTCARD__");
    expect(utilsContent).toContain("applicationName: i18nNamespacePrefix");
    expect(utilsContent).toContain("inMemoryTranslationsLoader");
    expect(utilsContent).toContain("namespaces: i18nNamespaces");
    expect(utilsContent).toContain(
      'import type commonTranslations from "#src/i18n/source/common.json";',
    );
    expect(utilsContent).toContain(
      'export { Trans, LANGUAGES, LOCALES, type Locale } from "@bsport/i18n";',
    );
  });

  it("transformI18n skips if src/i18n/index.ts already exists", () => {
    const tree = setupTree();
    const indexPath = `${appRoot}/src/i18n/index.ts`;
    const existingIndex = "export const already = true;\n";

    tree.write(indexPath, existingIndex);

    transformI18n(tree, appRoot, packageName);

    expect(tree.read(indexPath)?.toString()).toBe(existingIndex);
  });
});
