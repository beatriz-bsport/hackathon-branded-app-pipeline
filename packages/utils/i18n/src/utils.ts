import { Settings } from "luxon";

import { applyBroadcastChannelPolyfill } from "@bsport/broadcast-channel-polyfill";
import { formatPriceWithCurrency, getCurrencyDisplay } from "@bsport/currency";

import {
  LANGUAGES,
  LANGUAGE_SWITCHER_ACTION,
  LANGUAGE_SWITCHER_CHANNEL,
  LOCALES_WITH_FIRST_WEEKDAY_BEING_SUNDAY,
} from "./constants";
import type { Locale } from "./types";

applyBroadcastChannelPolyfill();

export function setLuxonLocale(language: string) {
  Settings.defaultLocale = language;
  if (LOCALES_WITH_FIRST_WEEKDAY_BEING_SUNDAY.includes(language)) {
    Settings.defaultWeekSettings = {
      firstDay: 7,
      minimalDays: 1,
      weekend: [6, 7],
    };
  } else {
    Settings.defaultWeekSettings = null;
  }
}

export function getFallbackLanguage(language: string): Array<Locale> {
  const defaultFallback = [LANGUAGES.ENGLISH];

  if (!language) return defaultFallback;

  const isEnglish = language.startsWith(LANGUAGES.ENGLISH);
  if (isEnglish) return defaultFallback;

  const isFrench = language.startsWith(LANGUAGES.FRENCH);
  if (isFrench) return [LANGUAGES.FRENCH, LANGUAGES.ENGLISH];

  for (const locale of [
    LANGUAGES.ITALIAN,
    LANGUAGES.DUTCH,
    LANGUAGES.GERMAN,
    LANGUAGES.SPANISH,
    LANGUAGES.PORTUGUESE,
  ]) {
    if (language.startsWith(locale)) return [locale, ...defaultFallback];
  }

  const isCatalan = language.startsWith(LANGUAGES.CATALAN);
  if (isCatalan) return [LANGUAGES.SPANISH, ...defaultFallback];

  return defaultFallback;
}

// Return a function that appends the application name as prefix to the namespace
export function getNamespacePrefixer<T = string>({
  applicationName,
}: {
  applicationName: string;
}) {
  return (namespace: T) => `${applicationName}_${namespace}`;
}

/**
 * Post a message to the language switcher broadcast channel to tell i18n instances
 * to change their language based on the provided languageId
 * @param languageId Language to set in i18n instances
 */
export const switchLanguage = (languageId: Locale) => {
  if (!languageId) return;

  const broadcast = new BroadcastChannel(LANGUAGE_SWITCHER_CHANNEL);
  // Ensure languageId is well formatted, in case typing is bypassed
  let language = languageId.toLowerCase();
  if (language.includes("-")) {
    // Ex : en-US
    const [country, locale] = language.split("-");
    language = `${country}-${locale.toUpperCase()}`;
  }
  broadcast.postMessage({
    action: LANGUAGE_SWITCHER_ACTION,
    payload: language,
  });
  broadcast.close();
};

/**
 * Formats a value for i18n interpolation based on the provided format type.
 * Supports "uuid" (truncates UUIDs), "price" (formats as currency), and "lowercase".
 *
 * @param value - The value to format (string or number).
 * @param format - The format type ("uuid", "price", "lowercase", etc.).
 * @returns The formatted value.
 */
export function format(value: string | number, format: string) {
  if (
    format === "uuid" &&
    typeof value === "string" &&
    /^[\da-f-]{8,}$/.test(value)
  ) {
    return value.slice(0, 8);
  }

  if (format === "price") {
    const price = typeof value === "string" ? parseFloat(value) : value;
    if (isNaN(price)) return value;
    return formatPriceWithCurrency(price, getCurrencyDisplay());
  }

  if (format === "lowercase" && typeof value === "string") {
    return value.toLowerCase();
  }

  return value;
}
