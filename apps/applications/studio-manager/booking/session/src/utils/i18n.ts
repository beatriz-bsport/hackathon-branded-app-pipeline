import { type TFunctionGeneric, instanciateAppI18n } from "@bsport/i18n";

import namespaces from "#src/i18n/namespaces.json";
import type common from "#src/i18n/source/common.json";
import type sessionCreation from "#src/i18n/source/sessionCreation.json";
import type sessionList from "#src/i18n/source/sessionList.json";

type Translations = {
  sessionList: typeof sessionList;
  common: typeof common;
  sessionCreation: typeof sessionCreation;
};

const applicationName = __SESSION__.__I18N_NAMESPACE_PREFIX__;
const applicationUrl = __SESSION__.__APPLICATION_BASE_URL__;

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
