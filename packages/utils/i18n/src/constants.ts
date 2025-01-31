export const LANGUAGES = {
  DEFAULT: "af",
  FRENCH: "fr",
  ENGLISH: "en",
  ENGLISH_BRITISH: "en-GB",
  ENGLISH_US: "en-US",
  SPANISH: "es",
  DUTCH: "nl",
  GERMAN: "de",
  ITALIAN: "it",
  CATALAN: "ca",
  CZECH: "cs",
  PORTUGUESE: "pt",
} as const;

export const LOCALES = [
  LANGUAGES.FRENCH,
  LANGUAGES.ENGLISH,
  LANGUAGES.SPANISH,
  LANGUAGES.DUTCH,
  LANGUAGES.GERMAN,
  LANGUAGES.ITALIAN,
  LANGUAGES.PORTUGUESE,
  LANGUAGES.CZECH,
] as const;

export const EXTRA_TIMEZONES = {
  FR: [
    "Indian/Reunion",
    "America/Martinique",
    "Indian/Antananarivo",
    "America/Cayenne",
    "Africa/Casablanca",
    "Africa/Tunis",
    "Pacific/Noumea",
  ],
  US: ["America/Jamaica", "Asia/Manila", "Asia/Kuala_Lumpur"],
  NL: ["America/Curacao"],
};

export const LOCALES_WITH_FIRST_WEEKDAY_BEING_SUNDAY = ["en-US", "en-CA"];

export type InitConfig = {
  applicationName: string;
};

export type TFunction = (
  i18nKey: string | string[],
  options?: { ns?: string },
) => string;
