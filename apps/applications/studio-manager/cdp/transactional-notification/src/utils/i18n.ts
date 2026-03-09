import { type TFunctionGeneric, instanciateAppI18n } from "@bsport/i18n";

import {
  i18nNamespacePrefix,
  i18nNamespaces,
  inMemoryTranslationsLoader,
} from "#src/i18n";
import type communicationVariablesTranslations from "#src/i18n/source/communicationVariables.json";
import type notificationRuleEventTranslations from "#src/i18n/source/notificationRuleEvent.json";
import type transactionalNotificationTranslations from "#src/i18n/source/transactionalNotification.json";

type Translations = {
  transactionalNotification: typeof transactionalNotificationTranslations;
  notificationRuleEvent: typeof notificationRuleEventTranslations;
  communicationVariables: typeof communicationVariablesTranslations;
};

export const {
  i18nInstance,
  useTranslation,
  withTranslation,
  getFixedNamespace,
  AppI18nextProvider,
} = instanciateAppI18n<Translations>({
  applicationName: i18nNamespacePrefix,
  namespaces: i18nNamespaces,
  inMemoryTranslationsLoader,
  debug: import.meta.env.DEV,
});

export type TFunction = TFunctionGeneric<Translations>;

export { Trans, LANGUAGES, LOCALES, type Locale } from "@bsport/i18n";
