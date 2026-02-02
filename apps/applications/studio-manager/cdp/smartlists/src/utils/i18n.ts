import { type TFunctionGeneric, instanciateAppI18n } from "@bsport/i18n";

import namespaces from "#src/i18n/namespaces.json";
import type campaignTranslations from "#src/i18n/source/campaign.json";
import type detailsTranslations from "#src/i18n/source/details.json";
import type listTranslations from "#src/i18n/source/list.json";

type Translations = {
  campaign: typeof campaignTranslations;
  list: typeof listTranslations;
  details: typeof detailsTranslations;
};
const applicationName = __SMARTLISTS__.__I18N_NAMESPACE_PREFIX__;
const applicationUrl = __SMARTLISTS__.__APPLICATION_BASE_URL__;

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
