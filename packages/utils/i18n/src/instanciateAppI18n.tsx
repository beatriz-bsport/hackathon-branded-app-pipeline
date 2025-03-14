import { getUseTranslation } from "./translation.hook";
import { getWithTranslation } from "./translation.hoc";
import { initI18n } from "./initI18n";
import { getLanguageSwitcher, getNamespacePrefixer } from "./utils";
import { getAppI18nextProvider } from "./i18nextProvider";
import type { InMemoryTranslationsLoader } from "./types";

/**
 * Instantiates and returns all necessary objects and functions to manage the application's i18n system.
 *
 * @template AppResources - The type representing the application's translation resources.
 *
 * @param {Object} config - Configuration object for setting up the i18n system.
 * @param {string} config.applicationName - The name of the application. Used to prefix the build translation files served from `/public/locales`.
 * @param {string} [config.applicationUrl] - The URL of the application, indicating where to fetch public translation files.
 *   If not provided, defaults to the current URL where `vite dev` is running.
 * @param {boolean} [config.debug=false] - Flag to enable debug mode, which shows missing keys in the i18n instance.
 * @param {InMemoryTranslationsLoader} [config.inMemoryTranslationsLoader] - An asynchronous function that returns the translation object
 *   for a given namespace and locale. If provided, i18n will load translations in-memory; otherwise, it uses the backend method (`public/locales`).
 *   This should only be used by internationalized libraries, not applications.
 * @param {string[]} config.namespaces - List of namespaces (without prefix) related to the application.
 *
 * @returns {Object} An object containing the i18n instance, translation hooks, components, and utilities.
 *
 * @description
 * After running the `translation:update` script in your i18n app folder, you'll find the `locales/en/translations.json` build file.
 * This file contains your app's translation structure. Use it to define your `AppResources` type.
 *
 * Example usage:
 * ```tsx
 * import { instanciateAppI18n } from "@bsport/i18n";
 * import type translations from "#src/i18n/locales/en/translations.json";
 * import namespaceList from "#src/i18n/namespaces.json";
 *
 * export const {
 *   i18nInstance,
 *   useTranslation,
 *   withTranslation,
 *   getFixedNamespace,
 *   AppI18nextProvider,
 *   languageSwitcher,
 * } = instanciateAppI18n<typeof translations>({
 *   applicationUrl: "URL_AFTER_DEPLOYMENT", // Replace with actual URL after deployment
 *   applicationName: "i18nNamespacePrefix",
 *   namespaces: namespaceList,
 * });
 * ```
 */
export function instanciateAppI18n<AppResources>({
  applicationName,
  applicationUrl,
  inMemoryTranslationsLoader,
  debug = false,
  namespaces,
}: {
  applicationName: string;
  applicationUrl?: string;
  debug?: boolean;
  inMemoryTranslationsLoader?: InMemoryTranslationsLoader;
  namespaces: string[];
}) {
  const i18nInstance = initI18n({
    applicationName,
    namespaces,
    applicationUrl,
    debug,
    inMemoryTranslationsLoader,
  });

  const useTranslation = getUseTranslation<AppResources>({
    applicationName,
  });

  const withTranslation = getWithTranslation<AppResources>({
    applicationName,
  });

  const getFixedNamespace = getNamespacePrefixer<keyof AppResources>({
    applicationName,
  });

  const { AppI18nextProvider } = getAppI18nextProvider(i18nInstance);
  const languageSwitcher = getLanguageSwitcher(i18nInstance);

  return {
    i18nInstance,
    useTranslation,
    withTranslation,
    getFixedNamespace,
    AppI18nextProvider,
    languageSwitcher,
  };
}
