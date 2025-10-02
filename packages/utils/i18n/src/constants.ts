export const LANGUAGES = {
  FRENCH: "fr",
  ENGLISH: "en",
  ENGLISH_BRITISH: "en-GB",
  ENGLISH_US: "en-US",
  SPANISH: "es",
  DUTCH: "nl",
  GERMAN: "de",
  ITALIAN: "it",
  CATALAN: "ca",
  PORTUGUESE: "pt",
  DEBUG: "cimode",
} as const;

export const LOCALES = [
  LANGUAGES.FRENCH,
  LANGUAGES.ENGLISH,
  LANGUAGES.SPANISH,
  LANGUAGES.DUTCH,
  LANGUAGES.GERMAN,
  LANGUAGES.ITALIAN,
  LANGUAGES.PORTUGUESE,
  LANGUAGES.DEBUG,
] as const;

// From https://emojipedia.org/fr/drapeaux
export const FLAG_EMOJIS = {
  [LANGUAGES.FRENCH]: "🇫🇷",
  [LANGUAGES.ENGLISH]: "🇬🇧",
  [LANGUAGES.ENGLISH_BRITISH]: "🇬🇧",
  [LANGUAGES.ENGLISH_US]: "🇺🇸",
  [LANGUAGES.SPANISH]: "🇪🇸",
  [LANGUAGES.DUTCH]: "🇳🇱",
  [LANGUAGES.GERMAN]: "🇩🇪",
  [LANGUAGES.ITALIAN]: "🇮🇹",
  [LANGUAGES.CATALAN]: "🇪🇸",
  [LANGUAGES.PORTUGUESE]: "🇵🇹",
  [LANGUAGES.DEBUG]: "🏳️",
};

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

export const LANGUAGE_SWITCHER_CHANNEL = "bsport:switch-language";

export const LANGUAGE_SWITCHER_ACTION = "SWITCH_LANGUAGE";
