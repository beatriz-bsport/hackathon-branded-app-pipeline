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

// IMPORTANT: we have to keep here the previous namespece hardcoded
// becuase we don't want to change everything in Transifex
export const i18nNamespacePrefix = "sm-smartlists";
export const i18nNamespaces: string[] = [
  "list",
  "details",
  "campaign",
  "campaign-filters",
  "communicationVariables",
];
