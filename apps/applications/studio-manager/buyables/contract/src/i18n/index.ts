import type { InMemoryTranslationsLoader } from "@bsport/i18n";

export const inMemoryTranslationsLoader: InMemoryTranslationsLoader = async (
  locale,
  namespace,
) => {
  try {
    if (locale === "en") {
      return (await import(`./source/${namespace}.json`)).default || {};
    }
    return (
      (await import(`./locales/${locale}/${namespace}.json`)).default || {}
    );
  } catch {
    return {};
  }
};

export const i18nNamespacePrefix = __CONTRACT__.__I18N_NAMESPACE_PREFIX__;
