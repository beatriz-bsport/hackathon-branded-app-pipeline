import { Settings } from "luxon";
import { applyBroadcastChannelPolyfill } from "@bsport/broadcast-channel-polyfill";

import {
  LOCALES_WITH_FIRST_WEEKDAY_BEING_SUNDAY,
  LANGUAGES,
  LANGUAGE_SWITCHER_CHANNEL,
  LANGUAGE_SWITCHER_ACTION,
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
  const defaultFallback = [LANGUAGES.ENGLISH, LANGUAGES.FRENCH];

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
    LANGUAGES.CZECH,
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
  const broadcast = new BroadcastChannel(LANGUAGE_SWITCHER_CHANNEL);
  broadcast.postMessage({
    action: LANGUAGE_SWITCHER_ACTION,
    payload: languageId,
  });
  broadcast.close();
};
