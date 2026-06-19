import type { InMemoryTranslationsLoader } from "@bsport/i18n";

const sourceTranslations = import.meta.glob("./source/*.json");
const localeTranslations = import.meta.glob("./locales/*/*.json");

export const inMemoryTranslationsLoader: InMemoryTranslationsLoader = async (
  locale,
  namespace,
) => {
  try {
    const translationPath =
      locale === "en"
        ? `./source/${namespace}.json`
        : `./locales/${locale}/${namespace}.json`;
    const translationLoader = (
      locale === "en" ? sourceTranslations : localeTranslations
    )[translationPath] as
      | (() => Promise<{ default: Record<string, object> }>)
      | undefined;

    return ((await translationLoader?.())?.default || {}) as Record<
      string,
      object
    >;
  } catch {
    return {};
  }
};

export const i18nNamespacePrefix = __REPORT__.__I18N_NAMESPACE_PREFIX__;
export const i18nNamespaces: string[] = ["reports"];
