/**
 * @description Error code constant for custom error codes received from the API
 *              Usually used in custom Exceptions
 */
export const CUSTOM_ERROR_CODE = 499;

/**
 * @description Error code constant for exceptions raised within bsport backend by stripe API client
 */
export const STRIPE_ERROR_CODE = 498;

/**
 * Minimum delay (in seconds) before a modal dialog's validation action can be triggered.
 */
export const VALIDATION_DELAY = 3;

export const APPLE_BUSINESS_URL = 'https://appstoreconnect.apple.com/business';
const ADP_GUIDE_BASE_URL = 'https://cdn.bsport.io/assets/docs/adp-config-guide';
const ADP_GUIDE_SUPPORTED_LANGUAGES = new Set([
  'fr',
  'en',
  'de',
  'it',
  'es',
  'nl',
]);

/**
 * Returns the language-specific step-by-step guide URL for migrating an iOS app
 * to the studio's own Apple Developer account. Falls back to English if the
 * language does not have a dedicated guide.
 */
export const getAppleDeveloperProgramGuideUrl = (
  languageCode: string,
): string => {
  const language = ADP_GUIDE_SUPPORTED_LANGUAGES.has(languageCode)
    ? languageCode
    : 'en';
  return `${ADP_GUIDE_BASE_URL}/${language}.pdf`;
};
