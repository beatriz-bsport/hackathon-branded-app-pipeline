import { type TFunctionGeneric, instanciateAppI18n } from "@bsport/i18n";

import namespaces from "#src/i18n/namespaces.json";
import type marketingNotificationDetails from "#src/i18n/source/marketingNotificationDetails.json";
import type marketingNotificationList from "#src/i18n/source/marketingNotificationList.json";
import type marketingNotificationsModal from "#src/i18n/source/marketingNotificationsModal.json";

type Translations = {
  marketingNotificationList: typeof marketingNotificationList;
  marketingNotificationDetails: typeof marketingNotificationDetails;
  marketingNotificationsModal: typeof marketingNotificationsModal;
};

const applicationName = __MARKETING_NOTIFICATION__.__I18N_NAMESPACE_PREFIX__;
const applicationUrl = __MARKETING_NOTIFICATION__.__APPLICATION_BASE_URL__;

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
