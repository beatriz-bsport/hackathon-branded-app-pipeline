import { type TFunctionGeneric, instanciateAppI18n } from "@bsport/i18n";

import type translations from "#src/i18n/locales/en/translations.json";
import namespaces from "#src/i18n/namespaces.json";

const applicationName = __GROUP_ACTIVITY__.__I18N_NAMESPACE_PREFIX__;
const applicationUrl = __GROUP_ACTIVITY__.__APPLICATION_BASE_URL__;

export const {
  i18nInstance,
  useTranslation,
  withTranslation,
  getFixedNamespace,
  AppI18nextProvider,
} = instanciateAppI18n<typeof translations>({
  applicationName,
  applicationUrl,
  namespaces,
  debug: import.meta.env.DEV,
});

export type TFunction = TFunctionGeneric<typeof translations>;

export { Trans, LANGUAGES, LOCALES, type Locale } from "@bsport/i18n";
