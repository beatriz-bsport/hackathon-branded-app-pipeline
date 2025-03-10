import {
  initI18n,
  getAppI18nextProvider,
  getNamespacePrefixer,
  getUseTranslation,
  getWithTranslation,
  type TFunction as BaseTFunction,
} from "@bsport/i18n";
import namespaceList from "#src/i18n/namespaces.json";
import type translations from "#src/i18n/locales/en/translations.json";

const i18nNamespacePrefix = import.meta.env.VITE_I18N_NAMESPACE_PREFIX;

export const i18nInstance = initI18n({
  applicationName: i18nNamespacePrefix,
  namespaces: namespaceList,
});

export const useTranslation = getUseTranslation<typeof translations>({
  applicationName: i18nNamespacePrefix,
});

export const withTranslation = getWithTranslation<typeof translations>({
  applicationName: i18nNamespacePrefix,
});

export type TFunction = BaseTFunction<typeof translations>;

export const getFixedNamespace = getNamespacePrefixer<
  keyof typeof translations
>({
  applicationName: i18nNamespacePrefix,
});

export const { AppI18nextProvider } = getAppI18nextProvider(i18nInstance);

export { Trans, LANGUAGES, LOCALES, type Locale } from "@bsport/i18n";
