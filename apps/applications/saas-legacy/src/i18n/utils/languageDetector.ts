import LanguageDetector from 'i18next-browser-languagedetector';

import { LANGUAGES } from '../languages';

/**
 * Create an additional LanguageDetector
 * It will return a fallback when other detectors have failed to return something.
 * The name of this detector is used in the detection options.
 *
 * Ref: https://github.com/i18next/i18next-browser-languageDetector?tab=readme-ov-file#adding-own-detection-functionality
 * */
export const languageDetector = new LanguageDetector();

languageDetector.addDetector({
  name: 'fallback-detector',
  lookup() {
    return LANGUAGES.ENGLISH;
  },
});

export const detectorOrder = [
  /**
   * Look for query string parameter `lng`
   * Can be customized with `lookupQuerystring` parameter
   * Ref: https://github.com/i18next/i18next-browser-languageDetector/blob/master/src/browserLookups/querystring.js
   */
  'querystring',

  /**
   * Look for cookie `i18next`
   * Can be customized with `lookupCookie` parameter
   * Ref: https://github.com/i18next/i18next-browser-languageDetector/blob/master/src/browserLookups/cookie.js
   */
  'cookie',

  /**
   * Look at localStorage for `i18nextLng`
   * Can be customized with `lookupLocalStorage`
   * Ref: https://github.com/i18next/i18next-browser-languageDetector/blob/master/src/browserLookups/localStorage.js
   */
  'localStorage',

  /**
   * Look at session storage for `i18nextLng`
   * Can be customized with `lookupSessionStorage`
   * Ref: https://github.com/i18next/i18next-browser-languageDetector/blob/master/src/browserLookups/sessionStorage.js
   */
  'sessionStorage',

  /**
   * Look at navigator Browser object: navigator.languages, navigator.language, navigator.userLanguage
   * Ref: https://github.com/i18next/i18next-browser-languageDetector/blob/master/src/browserLookups/navigator.js
   * */
  'navigator',

  /**
   * Look for `lang` attribute in <html> tag
   * Ref: https://github.com/i18next/i18next-browser-languageDetector/blob/master/src/browserLookups/htmlTag.js
   */
  'htmlTag',

  /**
   * Look at window.location.pathname (e.g. bsport.io/fr)
   * Ref: https://github.com/i18next/i18next-browser-languageDetector/blob/master/src/browserLookups/path.js
   */
  'path',

  /**
   * Look at subdomain name (e.g. bsport.fr)
   * Ref: https://github.com/i18next/i18next-browser-languageDetector/blob/master/src/browserLookups/subdomain.js
   */
  'subdomain',

  /**
   * Custom detector to add a final fallback to English
   */
  'fallback-detector',
];
