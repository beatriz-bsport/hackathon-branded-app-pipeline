import { type TFunctionGeneric, instanciateAppI18n } from "@bsport/i18n";

import namespaces from "#src/i18n/namespaces.json";
import type communicationVariablesTranslations from "#src/i18n/source/communicationVariables.json";
import type notificationRuleEventTranslations from "#src/i18n/source/notificationRuleEvent.json";
import type transactionalNotificationTranslations from "#src/i18n/source/transactionalNotification.json";

type Translations = {
  transactionalNotification: typeof transactionalNotificationTranslations;
  notificationRuleEvent: typeof notificationRuleEventTranslations;
  communicationVariables: typeof communicationVariablesTranslations;
};

const applicationName =
  __TRANSACTIONAL_NOTIFICATION__.__I18N_NAMESPACE_PREFIX__;
const applicationUrl = __TRANSACTIONAL_NOTIFICATION__.__APPLICATION_BASE_URL__;

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
