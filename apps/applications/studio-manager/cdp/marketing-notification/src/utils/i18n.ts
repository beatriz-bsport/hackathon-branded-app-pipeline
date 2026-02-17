import { type TFunctionGeneric, instanciateAppI18n } from "@bsport/i18n";

import {
  i18nNamespacePrefix,
  i18nNamespaces,
  inMemoryTranslationsLoader,
} from "#src/i18n/index";
import type communicationVariables from "#src/i18n/source/communicationVariables.json";
import type marketingNotificationDetails from "#src/i18n/source/marketingNotificationDetails.json";
import type marketingNotificationList from "#src/i18n/source/marketingNotificationList.json";
import type marketingNotificationsModal from "#src/i18n/source/marketingNotificationsModal.json";

type Translations = {
  marketingNotificationList: typeof marketingNotificationList;
  marketingNotificationDetails: typeof marketingNotificationDetails;
  marketingNotificationsModal: typeof marketingNotificationsModal;
  communicationVariables: typeof communicationVariables;
};

export const {
  i18nInstance,
  useTranslation,
  withTranslation,
  getFixedNamespace,
  AppI18nextProvider,
} = instanciateAppI18n<Translations>({
  applicationName: i18nNamespacePrefix,
  inMemoryTranslationsLoader,
  namespaces: i18nNamespaces,
  debug: import.meta.env.DEV,
});

export type TFunction = TFunctionGeneric<Translations>;

export { Trans, LANGUAGES, LOCALES, type Locale } from "@bsport/i18n";
