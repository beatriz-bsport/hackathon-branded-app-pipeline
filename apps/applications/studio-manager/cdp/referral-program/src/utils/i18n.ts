import { type TFunctionGeneric, instanciateAppI18n } from "@bsport/i18n";

import namespaces from "#src/i18n/namespaces.json";
import type settingsTranslations from "#src/i18n/source/settings.json";

type Translations = {
  settings: typeof settingsTranslations;
};

const applicationName = __REFERRAL_PROGRAM__.__I18N_NAMESPACE_PREFIX__;
const applicationUrl = __REFERRAL_PROGRAM__.__APPLICATION_BASE_URL__;

export const {
  i18nInstance,
  useTranslation,
  withTranslation,
  getFixedNamespace,
  AppI18nextProvider,
} = instanciateAppI18n<Translations>({
  applicationName,
  applicationUrl,
  namespaces,
  debug: import.meta.env.DEV,
});

export type TFunction = TFunctionGeneric<Translations>;

export { Trans, LANGUAGES, LOCALES, type Locale } from "@bsport/i18n";
