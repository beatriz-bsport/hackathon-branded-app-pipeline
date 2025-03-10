import { useContext } from "react";
import {
  getUseTranslation,
  type TFunction as BaseTFunction,
  type InMemoryTranslationsLoader,
} from "@bsport/i18n";
import i18nNamespaces from "./namespaces.json";
import { KaizenI18nContext } from "#src/components/I18nProvider";
import type translations from "#src/i18n/locales/en/translations.json";

const i18nNamespacePrefix = import.meta.env.VITE_I18N_NAMESPACE_PREFIX;

export { i18nNamespacePrefix, i18nNamespaces };

export const useTranslation = getUseTranslation<typeof translations>({
  applicationName: i18nNamespacePrefix,
});

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

/* Hook to retrieve the i18n instance to use in useTranslation options */
export const useKaizenI18nInstance = () => {
  const { kaizenI18nInstance } = useContext(KaizenI18nContext);
  return kaizenI18nInstance;
};

export type TFunction = BaseTFunction<typeof translations>;
