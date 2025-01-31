import {
  initI18n,
  getNamespacePrefixer,
  getUseTranslation,
  getWithTranslation,
} from "@bsport/i18n";
import namespaceList from "#src/i18n/namespaces.json";

const i18nNamespacePrefix = import.meta.env.VITE_I18N_NAMESPACE_PREFIX;

export const i18nInstance = initI18n({
  applicationName: i18nNamespacePrefix,
  namespaces: namespaceList,
});

export const useTranslation = getUseTranslation({
  applicationName: i18nNamespacePrefix,
});

export const withTranslation = getWithTranslation({
  applicationName: i18nNamespacePrefix,
});

export {
  I18nextProvider,
  Trans,
  LANGUAGES,
  LOCALES,
  type TFunction,
} from "@bsport/i18n";

export const getFixedNamespace = getNamespacePrefixer({
  applicationName: i18nNamespacePrefix,
});
