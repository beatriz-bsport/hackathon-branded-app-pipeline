import { type TFunctionGeneric, instanciateAppI18n } from "@bsport/i18n";

import type translations from "#src/i18n/locales/en/translations.json";
import namespaceList from "#src/i18n/namespaces.json";

const applicationName = import.meta.env.VITE_I18N_NAMESPACE_PREFIX;
const applicationUrl = import.meta.env.VITE_APPLICATION_BASE_URL;

export const {
  i18nInstance,
  useTranslation,
  withTranslation,
  getFixedNamespace,
  AppI18nextProvider,
} = instanciateAppI18n<typeof translations>({
  applicationName,
  applicationUrl,
  namespaces: namespaceList,
});

export type TFunction = TFunctionGeneric<typeof translations>;

export { Trans, LANGUAGES, LOCALES, type Locale } from "@bsport/i18n";
