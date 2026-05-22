import { type TFunctionGeneric, instanciateAppI18n } from "@bsport/i18n";

import {
  i18nNamespacePrefix,
  i18nNamespaces,
  inMemoryTranslationsLoader,
} from "#src/i18n";
import type locationFormTranslations from "#src/i18n/source/location-form.json";
import type venuesListTranslations from "#src/i18n/source/venues-list.json";

type Translations = {
  "venues-list": typeof venuesListTranslations;
  "location-form": typeof locationFormTranslations;
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

export type NamespacedTFunction<Ns extends keyof Translations> = ReturnType<
  typeof useTranslation<Ns>
>["t"];

export { Trans, LANGUAGES, LOCALES, type Locale } from "@bsport/i18n";
