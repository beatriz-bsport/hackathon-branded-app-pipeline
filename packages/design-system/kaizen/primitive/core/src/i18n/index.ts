import { useContext } from "react";

import {
  type InMemoryTranslationsLoader,
  type TFunctionGeneric,
  getUseTranslation,
} from "@bsport/i18n";

import { KaizenI18nContext } from "#src/components/I18nProvider";
import type translations from "#src/i18n/locales/en/translations.json";

import i18nNamespaces from "./namespaces.json";

const i18nNamespacePrefix = import.meta.env.VITE_I18N_NAMESPACE_PREFIX;

// ----- To export in index.ts for the consuming app that initializes Kaizen I18n -----

/* Function to retrieve translations from the build files in i18n/locales */
export const inMemoryTranslationsLoader: InMemoryTranslationsLoader = async (
  locale,
  namespace,
) => {
  try {
    const localeTranslations =
      (await import(`./locales/${locale}/translations.json`)).default || {};
    return localeTranslations[namespace];
  } catch (error) {
    return {};
  }
};

export { i18nNamespaces, i18nNamespacePrefix };

// ----- To manage translations in Kaizen components -----

export const useTranslation = getUseTranslation<typeof translations>({
  applicationName: i18nNamespacePrefix,
});

/* Hook to retrieve the i18n instance to use in useTranslation options */
export const useKaizenI18nInstance = () => {
  const { kaizenI18nInstance } = useContext(KaizenI18nContext);
  return kaizenI18nInstance;
};

export type TFunction = TFunctionGeneric<typeof translations>;

// ----- For storybook -----

export {
  FLAG_EMOJIS,
  LOCALES,
  instanciateAppI18n,
  switchLanguage,
} from "@bsport/i18n";

export type Translations = typeof translations;
