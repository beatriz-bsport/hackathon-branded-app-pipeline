import { useContext } from "react";

import {
  type InMemoryTranslationsLoader,
  type TFunctionGeneric,
  getUseTranslation,
} from "@bsport/i18n";

import { KaizenI18nContext } from "#src/components/I18nProvider";
import type defaultTranslations from "#src/i18n/source/default.json";

import i18nNamespaces from "./namespaces.json";

export type Translations = {
  default: typeof defaultTranslations;
};

const i18nNamespacePrefix = import.meta.env.VITE_I18N_NAMESPACE_PREFIX;

// ----- To export in index.ts for the consuming app that initializes Kaizen I18n -----

/* Function to retrieve translations from the build files in i18n/locales */
export const inMemoryTranslationsLoader: InMemoryTranslationsLoader = async (
  locale,
  namespace,
) => {
  try {
    // For static analysis, avoid conditions inside the import, as well as using constants for filenames
    if (locale === "en") {
      return (await import(`./source/${namespace}.json`)).default || {};
    }
    return (
      (await import(`./locales/${locale}/${namespace}.json`)).default || {}
    );
  } catch (error) {
    return {};
  }
};

export { i18nNamespaces, i18nNamespacePrefix };

// ----- To manage translations in Kaizen components -----

export const useTranslation = getUseTranslation<Translations>({
  applicationName: i18nNamespacePrefix,
});

/* Hook to retrieve the i18n instance to use in useTranslation options */
export const useKaizenI18nInstance = () => {
  const { kaizenI18nInstance } = useContext(KaizenI18nContext);
  return kaizenI18nInstance;
};

export type TFunction = TFunctionGeneric<Translations>;

// ----- For storybook -----

export {
  FLAG_EMOJIS,
  LOCALES,
  instanciateAppI18n,
  switchLanguage,
} from "@bsport/i18n";
