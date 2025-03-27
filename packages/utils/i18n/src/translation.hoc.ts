import { withTranslation } from "react-i18next";

import type { InitConfig } from "./types";
import { getNamespacePrefixer } from "./utils";

/**
 * Return an override version of withTranslation, for which provided namespaces
 * are prefixed with the config.applicationName input.
 * To have typescript intellisense, provide generic type of your resources to the getter.
 *
 * @description
 * In your i18n app folder, after running translation:update script, you'll find
 * the `locales/en/translations.json` build file : it contains your app translations
 * structure. Use it to define your AppResources type.
 * ```tsx
 * import type translations from "#src/i18n/locales/en/translations.json";
 *
 * export const withTranslation = getWithTranslation<typeof translations>({
 *   applicationName: i18nNamespacePrefix,
 * });
 * ```
 */
export function getWithTranslation<AppResources>({
  applicationName,
}: InitConfig) {
  const namespacePrefixer = getNamespacePrefixer<keyof AppResources>({
    applicationName,
  });

  function withTranslationOverride<Namespaces extends keyof AppResources>(
    namespaces?: Namespaces | Namespaces[],
    options?: { withRef?: boolean; keyPrefix?: undefined } | undefined,
    // @ts-expect-error TS can not infer that Namespaces (keyof AppResources) extends string
  ): ReturnType<typeof withTranslation<Namespaces, undefined>> {
    // Prefix namespaces
    const overrideNamespaces = namespaces
      ? Array.isArray(namespaces)
        ? namespaces.map(namespacePrefixer)
        : namespacePrefixer(namespaces)
      : undefined;
    return withTranslation<string | string[], undefined>(
      overrideNamespaces,
      options,
    );
  }

  return withTranslationOverride;
}
