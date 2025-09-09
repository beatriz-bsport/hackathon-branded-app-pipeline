import { type TFunctionGeneric, instanciateAppI18n } from "@bsport/i18n";

import namespaces from "#src/i18n/namespaces.json";
import type namespaceAlphaTranslations from "#src/i18n/source/namespaceAlpha.json";
import type namespaceBetaTranslations from "#src/i18n/source/namespaceBeta.json";

type Translations = {
  namespaceAlpha: typeof namespaceAlphaTranslations;
  namespaceBeta: typeof namespaceBetaTranslations;
};

const applicationName = __SM_APPLICATION__.__I18N_NAMESPACE_PREFIX__;
const applicationUrl = __SM_APPLICATION__.__APPLICATION_BASE_URL__;

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
