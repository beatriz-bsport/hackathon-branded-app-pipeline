import { type TFunctionGeneric, instanciateAppI18n } from "@bsport/i18n";

import namespaces from "#src/i18n/namespaces.json";
import type detailTranslations from "#src/i18n/source/detail.json";
import type listTranslations from "#src/i18n/source/list.json";
import type notificationRuleTranslations from "#src/i18n/source/notificationRule.json";

type Translations = {
  list: typeof listTranslations;
  detail: typeof detailTranslations;
  notificationRule: typeof notificationRuleTranslations;
};

const applicationName = __EMAIL_TEMPLATE__.__I18N_NAMESPACE_PREFIX__;
const applicationUrl = __EMAIL_TEMPLATE__.__APPLICATION_BASE_URL__;

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
