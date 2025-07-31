export const BSPORT_AUTH_TOKEN_KEY = "bsport:http:token";
export const BSPORT_IMPERSONATION_AUTH_TOKEN_KEY = "http:token";

/**
 * Set the authentication token in localStorage.
 * @param token - The token to store.
 */
export const setAuthToken = (token: string) => {
  localStorage.setItem(BSPORT_AUTH_TOKEN_KEY, token);
};

/**
 * Get the authentication token from localStorage.
 * @returns The stored token, or null if not found.
 */
export const getAuthToken = (): string | null => {
  // On the old backoffice if we impersonate a user, the correct token to use is the one that
  // we are storing in the sessionStorage, thus if there is a token in sessionStorage, we
  // should always use it instead of the one in localStorage as this mean that we are currently
  // impersonating a user. This is a temporary solution until we have a better way to handle impersonation.
  // This is also the reason why we are using sessionStorage instead of localStorage.
  // In the future, we should consider using a more robust solution for handling impersonation tokens.
  const impersonatedToken = sessionStorage.getItem(
    BSPORT_IMPERSONATION_AUTH_TOKEN_KEY,
  );
  const token =
    impersonatedToken || localStorage.getItem(BSPORT_AUTH_TOKEN_KEY);
  return token;
};

/**
 * Remove the authentication token from localStorage.
 */
export const removeAuthToken = () => {
  localStorage.removeItem(BSPORT_AUTH_TOKEN_KEY);
};
