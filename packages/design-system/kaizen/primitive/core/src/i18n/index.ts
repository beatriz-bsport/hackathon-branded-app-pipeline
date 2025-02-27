import { useContext } from "react";
import {
  getUseTranslation,
  type Locale,
  type UseTranslation,
} from "@bsport/i18n";
import i18nNamespaces from "./namespaces.json";
import { KaizenI18nContext } from "#src/components/I18nProvider";

const i18nNamespacePrefix = import.meta.env.VITE_I18N_NAMESPACE_PREFIX;

export { i18nNamespacePrefix, i18nNamespaces };

export const useTranslation: UseTranslation = getUseTranslation({
  applicationName: i18nNamespacePrefix,
});

export const inMemoryTranslationsLoader = async (
  locale: Locale,
  namespace: string,
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
