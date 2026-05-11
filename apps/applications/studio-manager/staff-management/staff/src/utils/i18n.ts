import { type TFunctionGeneric, instanciateAppI18n } from "@bsport/i18n";

import {
  i18nNamespacePrefix,
  i18nNamespaces,
  inMemoryTranslationsLoader,
} from "#src/i18n";
import type roleDetailsTranslations from "#src/i18n/source/role-details.json";
import type roleFormTranslations from "#src/i18n/source/role-form.json";
import type roleListTranslations from "#src/i18n/source/role-list.json";
import type staffFormTranslations from "#src/i18n/source/staff-form.json";
import type staffListTranslations from "#src/i18n/source/staff-list.json";

type Translations = {
  "role-details": typeof roleDetailsTranslations;
  "role-form": typeof roleFormTranslations;
  "role-list": typeof roleListTranslations;
  "staff-list": typeof staffListTranslations;
  "staff-form": typeof staffFormTranslations;
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
