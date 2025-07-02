/**
 * Formats a number as currency using the provided locale and currency code.
 *
 * @param amount - The numeric amount to format
 * @param currency - The currency code (e.g., "EUR", "USD", "GBP")
 * @param locale - The locale for formatting (e.g., "en-US", "fr-FR", "de-DE")
 * @returns Formatted currency string
 */
export function formatCurrency(
  amount: number,
  currency: string = "EUR",
  locale: string = "en-US",
): string {
  // Map common locale formats to valid Intl.NumberFormat locales
  const localeMap: Record<string, string> = {
    en: "en-US",
    fr: "fr-FR",
    de: "de-DE",
    es: "es-ES",
    it: "it-IT",
    pt: "pt-PT",
    nl: "nl-NL",
    cs: "cs-CZ",
  };

  // If locale is just a language code, map it to a full locale
  let normalizedLocale = locale;

  if (locale && localeMap[locale]) {
    normalizedLocale = localeMap[locale];
  }

  try {
    return new Intl.NumberFormat(normalizedLocale, {
      style: "currency",
      currency: currency,
    }).format(amount);
  } catch (error) {
    // Fallback to EUR with en-US locale if there's any error
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "EUR",
    }).format(amount);
  }
}
