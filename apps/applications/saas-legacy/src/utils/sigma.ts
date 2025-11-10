// Utilities to handle Sigma embed URL localization

// https://help.sigmacomputing.com/docs/manage-workbook-localization#supported-languages-and-locales
const SUPPORTED_LOCALES = new Set([
  'en',
  'fr', // fr-fr isn't supported
  'fr-ca',
  'es',
  'de',
  'it',
  'pt',
  'nl-nl',
  'ru',
  'th',
  'ja',
  'pl',
]);

const DEFAULT_SIGMA_LOCALE_BY_LANGUAGE = new Map([['nl', 'nl-nl']]);

const coerceSigmaLocale = (languageCode: string | undefined | null): string => {
  if (!languageCode) return 'en';
  const lc = languageCode.toLowerCase();
  if (SUPPORTED_LOCALES.has(lc)) return lc;
  const [lang] = lc.split('-');
  if (SUPPORTED_LOCALES.has(lang)) return lang;
  const mappedLocale = DEFAULT_SIGMA_LOCALE_BY_LANGUAGE.get(lang);
  if (mappedLocale) return mappedLocale;
  return 'en';
};

const buildSigmaEmbedUrl = (rawSrc: string, lng: string): string => {
  try {
    if (typeof window === 'undefined') return rawSrc;
    const urlObj = new URL(rawSrc, window.location.origin);
    urlObj.searchParams.set(':lng', lng);
    return urlObj.toString();
  } catch (_e) {
    const separator = rawSrc.includes('?') ? '&' : '?';
    return `${rawSrc}${separator}:lng=${encodeURIComponent(lng)}`;
  }
};

export const appendSigmaLocale = (
  rawSrc: string,
  languageCode?: string | null,
): string => {
  const browserLanguage =
    languageCode ||
    (typeof navigator !== 'undefined' ? navigator.language : 'en');
  const lng = coerceSigmaLocale(browserLanguage);
  return buildSigmaEmbedUrl(rawSrc, lng);
};

export default appendSigmaLocale;
