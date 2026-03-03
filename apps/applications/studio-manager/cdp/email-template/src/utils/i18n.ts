import { type TFunctionGeneric, instanciateAppI18n } from "@bsport/i18n";

import {
  i18nNamespacePrefix,
  i18nNamespaces,
  inMemoryTranslationsLoader,
} from "#src/i18n";
import type detailTranslations from "#src/i18n/source/detail.json";
import type listTranslations from "#src/i18n/source/list.json";
import type notificationRuleTranslations from "#src/i18n/source/notificationRule.json";

type Translations = {
  list: typeof listTranslations;
  detail: typeof detailTranslations;
  notificationRule: typeof notificationRuleTranslations;
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
