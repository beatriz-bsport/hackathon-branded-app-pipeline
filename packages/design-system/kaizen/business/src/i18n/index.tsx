import {
  type InMemoryTranslationsLoader,
  type TFunctionGeneric,
  instanciateAppI18n,
} from "@bsport/i18n";

import type bookingTranslations from "#src/i18n/source/booking.json";
import type buyablesTranslations from "#src/i18n/source/buyables.json";
import type cdpTranslations from "#src/i18n/source/cdp.json";
import type financialServicesTranslations from "#src/i18n/source/financial-services.json";

import i18nNamespaces from "./namespaces.json";

/**
 * ========== NAMESPACES ==========
 */

export type Translations = {
  booking: typeof bookingTranslations;
  buyables: typeof buyablesTranslations;
  cdp: typeof cdpTranslations;
  "financial-services": typeof financialServicesTranslations;
};

/**
 * ========== I18N INSTANCE ==========
 *
 * -> Retrieve i18nNamespacePrefix to define prefix for the i18nInstance
 * -> Define inMemoryTranslationsLoader for the i18nInstance
 * -> Generate the i18nInstance and useTranslation related hook
 */

const i18nNamespacePrefix = import.meta.env.VITE_I18N_NAMESPACE_PREFIX;

/* Function to retrieve translations from the build files in i18n/locales */
const inMemoryTranslationsLoader: InMemoryTranslationsLoader = async (
  locale,
  namespace,
) => {
  try {
    // For static analysis, avoid conditions inside the import, as well as using constants for filenames
    if (locale === "en") {
      return (await import(`./source/${namespace}.json`)).default || {};
    }
    return (
      (await import(`./locales/${locale}/${namespace}.json`)).default || {}
    );
  } catch (_error) {
    return {};
  }
};

const { i18nInstance, useTranslation } = instanciateAppI18n<Translations>({
  applicationName: i18nNamespacePrefix,
  namespaces: i18nNamespaces as string[],
  inMemoryTranslationsLoader,
  debug: false,
});

export { i18nInstance, useTranslation, i18nNamespaces, i18nNamespacePrefix };

export type TFunction = TFunctionGeneric<Translations>;
