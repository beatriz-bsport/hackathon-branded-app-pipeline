import { withTranslation } from "react-i18next";
import { getNamespacePrefixer } from "./utils";
import type { InitConfig } from "./types";

type WithTranslationNs = Parameters<typeof withTranslation>[0];
type WithTranslationFn = typeof withTranslation<WithTranslationNs>;
type WithTranslationOptions = Parameters<WithTranslationFn>[1];
type WithTranslationReturnType = ReturnType<WithTranslationFn>;

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
 * export const withTranslation = getWithTranslation<AppResources>({
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
    options?: WithTranslationOptions,
  ): WithTranslationReturnType {
    let overrideNs: WithTranslationNs = undefined;
    if (typeof namespaces === "string") {
      overrideNs = namespacePrefixer(namespaces);
    }
    if (Array.isArray(namespaces)) {
      overrideNs = namespaces.map(namespacePrefixer);
    }
    return withTranslation(overrideNs, options);
  }

  return withTranslationOverride;
}
