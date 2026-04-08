/** Session key for the current impersonation / workspace token (legacy parity). */
export const BSPORT_IMPERSONATION_AUTH_TOKEN_KEY = "http:token";

/** Session key for the franchisor/origin token while navigating a franchise workspace (legacy parity). */
export const BSPORT_FRANCHISE_ORIGIN_TOKEN_KEY = "bsport:franchise:http:token";

/** Session key for the URL to restore when navigating back to the franchisor account. */
export const BSPORT_IMPERSONATION_ORIGIN_URL_KEY =
  "bsport:impersonation:url:origin";

/** Session key for the i18n language to restore for the franchisor account. */
export const BSPORT_I18NEXTLNG_ORIGIN_KEY = "i18nextLng:impersonated:origin";

/** Session copy of i18next language during impersonation (legacy `clearSessionStorageOnDeImpersonating`). */
export const BSPORT_I18NEXTLNG_SESSION_KEY = "i18nextLng";

/** localStorage key for the active UI language (i18next). */
export const BSPORT_I18NEXTLNG_LOCAL_KEY = "i18nextLng";

/** Session keys for the extra data used during impersonation. */
const BSPORT_SESSION_IMPERSONATION_EXTRA_KEYS = [
  "bsport:stripe:pk_key",
  "bsport:payment:currency_code",
  "bsport:payment:currency_display",
  "bsport:payment:stripe_region",
  "bsport:payment:company_country",
  "bsport:display:pass_credit_factor",
] as const;

/**
 * True when session storage holds a franchisor origin token (embedded legacy flow / “back to central account”).
 * Mirrors legacy `STORAGE_KEY_BSPORT_IMPERSONATED_ORIGIN_TOKEN`.
 */
export function hasFranchisorNavigationContext(): boolean {
  const value = sessionStorage.getItem(BSPORT_FRANCHISE_ORIGIN_TOKEN_KEY);
  return Boolean(value && value !== "null");
}

/**
 * Clears session keys used during franchise impersonation, matching legacy `navigateBackToFranchise` cleanup.
 * Call only after reading origin token, URL, and language, and after validating the origin token.
 */
export function clearFranchiseImpersonationSession(): void {
  const keys: string[] = [
    BSPORT_FRANCHISE_ORIGIN_TOKEN_KEY,
    BSPORT_I18NEXTLNG_SESSION_KEY,
    ...BSPORT_SESSION_IMPERSONATION_EXTRA_KEYS,
    BSPORT_IMPERSONATION_ORIGIN_URL_KEY,
    BSPORT_IMPERSONATION_AUTH_TOKEN_KEY,
    BSPORT_I18NEXTLNG_ORIGIN_KEY,
  ];
  for (const key of keys) {
    sessionStorage.removeItem(key);
  }
}
