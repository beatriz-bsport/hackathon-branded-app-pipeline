import {
  DEFAULT_SIGMA_LANGUAGE,
  DEFAULT_SIGMA_LOCALE_BY_LANGUAGE,
  SUPPORTED_SIGMA_LOCALES,
} from "./constants";
import { SigmaEventData } from "./types";

/**
 * Try to resolve the input languageCode to a supported Sigma language.
 * Return english if it can't resolve.
 */
export function coerceSigmaLocale(languageCode: string): string {
  if (!languageCode) {
    return DEFAULT_SIGMA_LANGUAGE;
  }

  // Check if the full languageCode is supported by Sigma
  const lc = languageCode.toLowerCase();
  if (SUPPORTED_SIGMA_LOCALES.has(lc)) {
    return lc;
  }

  // Check if the first part of the languageCode is supported by Sigma
  const [lang] = lc.split("-");
  if (SUPPORTED_SIGMA_LOCALES.has(lang)) {
    return lang;
  }

  // Check if the first part of the languageCode corresponds to a mapped Sigma language
  const mappedLocale = DEFAULT_SIGMA_LOCALE_BY_LANGUAGE.get(lang);
  if (mappedLocale) {
    return mappedLocale;
  }

  return DEFAULT_SIGMA_LANGUAGE;
}

/**
 * Concatenate an iframe URL with language query params.
 *
 * @param baseIframeUrl Hosted url of the iframe
 * @param language Current i18n.language. It will try to resolve it to a Sigma language.
 * @param additionalParams Record to add additional query params to the built url
 *
 * @returns {string} The localized iframe URL
 *
 * @example
 * const localizedSrc = useMemo(() => {
 *  return buildLocalizedIframeUrl({
 *    baseIframeUrl: src,
 *    language: i18n.language,
 *    additionalParams: {
 *      ":responsive_height": "true",
 *      ":hide_element_interactions": "true",
 *    },
 *  });
 * }, [src, i18n.language]);
 */
export function buildLocalizedIframeUrl({
  baseIframeUrl,
  language,
  additionalParams = {},
}: {
  baseIframeUrl: string;
  language: string;
  additionalParams?: Record<string, string>;
}) {
  const sigmaLanguage = coerceSigmaLocale(language);

  try {
    const urlObj = new URL(baseIframeUrl);
    urlObj.searchParams.set(":lng", sigmaLanguage);
    Object.entries(additionalParams).forEach(([key, value]) => {
      urlObj.searchParams.set(key, value);
    });
    return urlObj.toString();
  } catch {
    const separator = baseIframeUrl.includes("?") ? "&" : "?";
    const params = new URLSearchParams({
      ":lng": sigmaLanguage,
      ...additionalParams,
    });
    return `${baseIframeUrl}${separator}${params.toString()}`;
  }
}

/**
 * Define a common pattern to create Error that are tracked afterwards on Sentry.
 */
export const buildSigmaError = ({ type, ...otherParams }: SigmaEventData) => {
  let stringifiedParams = "";
  try {
    stringifiedParams = JSON.stringify(otherParams);
  } catch {
    // Skip - silent failure
  }
  return new Error(`[SIGMA][${type}] ${stringifiedParams}`);
};
