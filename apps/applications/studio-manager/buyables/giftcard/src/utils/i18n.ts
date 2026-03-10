import { type TFunctionGeneric, instanciateAppI18n } from "@bsport/i18n";

import {
  i18nNamespacePrefix,
  i18nNamespaces,
  inMemoryTranslationsLoader,
} from "#src/i18n";
import type commonTranslations from "#src/i18n/source/common.json";
import type giftcardDetailsTranslations from "#src/i18n/source/giftcard-details.json";
import type imageUploadTranslations from "#src/i18n/source/imageUpload.json";

type Translations = {
  common: typeof commonTranslations;
  imageUpload: typeof imageUploadTranslations;
  "giftcard-details": typeof giftcardDetailsTranslations;
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
