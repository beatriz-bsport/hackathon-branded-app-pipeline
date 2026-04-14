import {
  BSPORT_FRANCHISE_ORIGIN_TOKEN_KEY,
  BSPORT_I18NEXTLNG_LOCAL_KEY,
  BSPORT_I18NEXTLNG_ORIGIN_KEY,
  BSPORT_IMPERSONATION_ORIGIN_URL_KEY,
  clearFranchiseImpersonationSession,
  setAuthToken,
} from "@bsport/local-storage-auth-token";

/**
 * Restore the franchisor session and navigate to the URL stored when entering franchise navigation.
 */
export async function navigateBackToFranchisorHost(): Promise<void> {
  const originToken = sessionStorage.getItem(BSPORT_FRANCHISE_ORIGIN_TOKEN_KEY);
  const originUrl = sessionStorage.getItem(BSPORT_IMPERSONATION_ORIGIN_URL_KEY);
  const originLang = sessionStorage.getItem(BSPORT_I18NEXTLNG_ORIGIN_KEY);

  if (!originToken || originToken === "null" || !originUrl) {
    return;
  }

  setAuthToken(originToken);

  if (originLang && originLang !== "null") {
    localStorage.setItem(BSPORT_I18NEXTLNG_LOCAL_KEY, originLang);
  }

  clearFranchiseImpersonationSession();

  window.location.assign(originUrl);
}
