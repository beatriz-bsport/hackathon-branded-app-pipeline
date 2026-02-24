import { Tree, readProjectConfiguration } from "@nx/devkit";

export function deriveNamespaceVar(packageName: string): string {
  const result = packageName
    .replace(/@bsport\//i, "")
    .replace(/^[^-]+-/, "")
    .replace(/-/g, "_")
    .toUpperCase();
  return `__${result}__`;
}

/**
 * Generates the content of `src/i18n/index.ts` matching the referral-program pattern.
 *
 * @param namespaceVar The namespace variable (e.g., `__REFERRAL_PROGRAM__`)
 * @param namespaces Array of namespace strings (e.g., `["settings"]`)
 * @returns The complete i18n index.ts file content
 */
export function generateI18nIndexContent(
  namespaceVar: string,
  namespaces: string[],
): string {
  const namespacesStr = namespaces.map((ns) => `"${ns}"`).join(", ");

  return `import type { InMemoryTranslationsLoader } from "@bsport/i18n";

export const inMemoryTranslationsLoader: InMemoryTranslationsLoader = async (
  locale,
  namespace,
) => {
  try {
    if (locale === "en") {
      return (await import(\`./source/\${namespace}.json\`)).default || {};
    }
    return (
      (await import(\`./locales/\${locale}/\${namespace}.json\`)).default || {}
    );
  } catch {
    return {};
  }
};

export const i18nNamespacePrefix =
  ${namespaceVar}.__I18N_NAMESPACE_PREFIX__;
export const i18nNamespaces: string[] = [${namespacesStr}];
`;
}

/**
 * Resolves the root path of a Studio Manager app.
 * Accepts various formats: `sm-giftcard`, `@bsport/sm-giftcard`, or bare `giftcard`.
 * Normalizes to `sm-{bare}` and resolves via Nx project configuration.
 *
 * @param tree The Nx virtual file system
 * @param appName The app name in various formats
 * @returns The absolute path to the app's root
 */
export function resolveAppRoot(tree: Tree, appName: string): string {
  let normalized = appName;

  if (normalized.startsWith("@bsport/")) {
    normalized = normalized.slice("@bsport/".length);
  }

  if (!normalized.startsWith("sm-")) {
    normalized = `sm-${normalized}`;
  }

  const projectConfig = readProjectConfiguration(tree, `@bsport/${normalized}`);
  return projectConfig.root;
}

/**
 * Resolves the root path of the Studio Manager host application.
 * The host is always located at `apps/applications/studio-manager/host`.
 *
 * @param _tree The Nx virtual file system (unused, but kept for API consistency)
 * @returns The hardcoded path to the host app root
 */
export function resolveHostRoot(_tree: Tree): string {
  return "apps/applications/studio-manager/host";
}
