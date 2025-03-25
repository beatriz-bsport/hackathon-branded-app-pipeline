import { instanciateAppI18n, type TFunctionGeneric } from "@bsport/i18n";
import namespaceList from "#src/i18n/namespaces.json";
import type translations from "#src/i18n/locales/en/translations.json";

const i18nNamespacePrefix = import.meta.env.VITE_I18N_NAMESPACE_PREFIX;

export const {
  i18nInstance,
  useTranslation,
  withTranslation,
  getFixedNamespace,
  AppI18nextProvider,
} = instanciateAppI18n<typeof translations>({
  applicationName: i18nNamespacePrefix,
  namespaces: namespaceList,
});

export type TFunction = TFunctionGeneric<typeof translations>;

export { Trans, LANGUAGES, LOCALES, type Locale } from "@bsport/i18n";
