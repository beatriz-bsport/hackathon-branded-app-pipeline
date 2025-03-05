import {
  getNamespacePrefixer,
  getUseTranslation,
  getWithTranslation,
  initI18n,
  type UseTranslation,
  type WithTranslation,
} from "@bsport/i18n";
import namespaceList from "#src/i18n/namespaces.json";

const i18nNamespacePrefix = import.meta.env.VITE_I18N_NAMESPACE_PREFIX;

export const i18nInstance = initI18n({
  applicationName: i18nNamespacePrefix,
  namespaces: namespaceList,
});

export const useTranslation: UseTranslation = getUseTranslation({
  applicationName: i18nNamespacePrefix,
});

export const withTranslation: WithTranslation = getWithTranslation({
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
