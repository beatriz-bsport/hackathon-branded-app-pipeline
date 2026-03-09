import { type TFunctionGeneric, instanciateAppI18n } from "@bsport/i18n";

import {
  i18nNamespacePrefix,
  i18nNamespaces,
  inMemoryTranslationsLoader,
} from "#src/i18n";
import type common from "#src/i18n/source/common.json";
import type sessionCreation from "#src/i18n/source/sessionCreation.json";
import type sessionDetails from "#src/i18n/source/sessionDetails.json";
import type sessionEdit from "#src/i18n/source/sessionEdit.json";
import type sessionList from "#src/i18n/source/sessionList.json";

type Translations = {
  sessionEdit: typeof sessionEdit;
  sessionList: typeof sessionList;
  common: typeof common;
  sessionCreation: typeof sessionCreation;
  sessionDetails: typeof sessionDetails;
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
