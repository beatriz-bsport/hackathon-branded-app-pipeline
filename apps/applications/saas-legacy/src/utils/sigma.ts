// Utilities to handle Sigma embed URL localization

const toSigmaLocale = (languageCode: string | undefined | null): string => {
  if (!languageCode) return 'en';
  const parts = languageCode.split('-');
  if (parts.length === 1) return parts[0].toLowerCase();
  return `${parts[0].toLowerCase()}-${parts[1].toLowerCase()}`;
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
  const lng = toSigmaLocale(browserLanguage);
  return buildSigmaEmbedUrl(rawSrc, lng);
};

export default appendSigmaLocale;
