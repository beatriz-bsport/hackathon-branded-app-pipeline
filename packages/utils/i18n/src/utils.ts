import { Settings } from "luxon";
import {
  LOCALES_WITH_FIRST_WEEKDAY_BEING_SUNDAY,
  LANGUAGES,
  LOCALES,
} from "./constants";

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

type Locale = (typeof LOCALES)[number];

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
export function getNamespacePrefixer({
  applicationName,
}: {
  applicationName: string;
}) {
  return (namespace: string) => `${applicationName}_${namespace}`;
}
