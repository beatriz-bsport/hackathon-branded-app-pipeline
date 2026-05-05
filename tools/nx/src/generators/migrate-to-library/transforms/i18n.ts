import { Tree, logger, readJson } from "@nx/devkit";

import { deriveNamespaceVar, generateI18nIndexContent } from "../utils";

const I18N_IMPORT =
  'import { type TFunctionGeneric, instanciateAppI18n } from "@bsport/i18n";\n';

const I18N_UTILS_IMPORT = `\nimport {
  i18nNamespacePrefix,
  i18nNamespaces,
  inMemoryTranslationsLoader,
} from "#src/i18n";
`;

export function transformI18n(
  tree: Tree,
  appRoot: string,
  packageName: string,
): void {
  const indexPath = `${appRoot}/src/i18n/index.ts`;

  if (tree.exists(indexPath)) {
    logger.warn(`${packageName} i18n already migrated, skipping`);
    return;
  }

  const namespacesPath = `${appRoot}/src/i18n/namespaces.json`;
  const namespaces = readJson<string[]>(tree, namespacesPath);
  const namespaceVar = deriveNamespaceVar(packageName);

  tree.write(indexPath, generateI18nIndexContent(namespaceVar, namespaces));

  const utilsPath = `${appRoot}/src/utils/i18n.ts`;
  const i18nUtilsContent = tree.read(utilsPath, "utf-8");

  if (i18nUtilsContent !== null) {
    const transformed = i18nUtilsContent
      .replace('import namespaces from "#src/i18n/namespaces.json";\n', "")
      .replace(
        /const applicationName = __\w+__\.__I18N_NAMESPACE_PREFIX__;\n/,
        "",
      )
      .replace(
        /const applicationUrl = __\w+__\.__APPLICATION_BASE_URL__;\n/,
        "",
      )
      .replace(I18N_IMPORT, `${I18N_IMPORT}${I18N_UTILS_IMPORT}`)
      .replace(
        "  applicationName,\n",
        "  applicationName: i18nNamespacePrefix,\n",
      )
      .replace("  applicationUrl,\n", "")
      .replace(
        "  namespaces,\n",
        "  namespaces: i18nNamespaces,\n  inMemoryTranslationsLoader,\n",
      );

    tree.write(utilsPath, transformed);
  }

  tree.delete(namespacesPath);
}
