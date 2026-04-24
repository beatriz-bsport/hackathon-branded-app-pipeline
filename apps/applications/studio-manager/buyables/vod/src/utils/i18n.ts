import { type TFunctionGeneric, instanciateAppI18n } from "@bsport/i18n";

import {
  i18nNamespacePrefix,
  i18nNamespaces,
  inMemoryTranslationsLoader,
} from "#src/i18n";
import type collectionDetailsTranslations from "#src/i18n/source/collection-details.json";
import type collectionFormTranslations from "#src/i18n/source/collection-form.json";
import type collectionsListTranslations from "#src/i18n/source/collections-list.json";
import type mediaDetailsTranslations from "#src/i18n/source/media-details.json";
import type mediaListTranslations from "#src/i18n/source/media-list.json";
import type sharedListTranslations from "#src/i18n/source/shared-list.json";

type Translations = {
  "shared-list": typeof sharedListTranslations;
  "collections-list": typeof collectionsListTranslations;
  "collection-details": typeof collectionDetailsTranslations;
  "collection-form": typeof collectionFormTranslations;
  "media-list": typeof mediaListTranslations;
  "media-details": typeof mediaDetailsTranslations;
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
