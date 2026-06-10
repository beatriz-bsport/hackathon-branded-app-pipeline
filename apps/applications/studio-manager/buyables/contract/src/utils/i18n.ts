import { type TFunctionGeneric, instanciateAppI18n } from "@bsport/i18n";

import { i18nNamespacePrefix, inMemoryTranslationsLoader } from "#src/i18n";
import type contractDetailsTranslations from "#src/i18n/source/contract-details.json";
import type contractFeaturesTranslations from "#src/i18n/source/contract-features.json";
import type contractListTranslations from "#src/i18n/source/contract-list.json";
import type membershipPlanTranslations from "#src/i18n/source/membership-plan.json";

type Translations = {
  "contract-list": typeof contractListTranslations;
  "contract-details": typeof contractDetailsTranslations;
  "contract-features": typeof contractFeaturesTranslations;
  "membership-plan": typeof membershipPlanTranslations;
};

const i18nNamespaces: string[] = [
  "contract-list",
  "contract-details",
  "contract-features",
  "membership-plan",
];

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
