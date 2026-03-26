import type { CompanyTheme } from "@bsport/api-core";

const GERMAN_IDENTIFIER = "DE";

/**
 * Whether the company needs to use Bookkeeping Account feature
 */
export const isBookkeepingAccountActive = (theme?: CompanyTheme) => {
  if (!theme) {
    return false;
  }

  // Format: LANGUAGE_LOCALE
  const locale = theme.locale.toUpperCase();

  return locale.endsWith(GERMAN_IDENTIFIER);
};
