export const DEFAULT_SIGMA_LANGUAGE = "en";

const SIGMA_LANGUAGE_NL = "nl-nl";

export const SUPPORTED_SIGMA_LOCALES: ReadonlySet<string> = new Set([
  DEFAULT_SIGMA_LANGUAGE,
  SIGMA_LANGUAGE_NL,
  "fr", // fr-fr isn't supported
  "fr-ca",
  "es",
  "de",
  "it",
  "pt",
  "ru",
  "th",
  "ja",
  "pl",
]);

export const DEFAULT_SIGMA_LOCALE_BY_LANGUAGE: ReadonlyMap<string, string> =
  new Map([["nl", SIGMA_LANGUAGE_NL]]);
