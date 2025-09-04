import { type TFunctionGeneric, instanciateAppI18n } from "@bsport/i18n";

import namespaces from "#src/i18n/namespaces.json";
import type insightsTranslations from "#src/i18n/source/insights.json";

type Translations = {
  insights: typeof insightsTranslations;
};

const applicationName = __INSIGHTS__.__I18N_NAMESPACE_PREFIX__;
const applicationUrl = __INSIGHTS__.__APPLICATION_BASE_URL__;

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
