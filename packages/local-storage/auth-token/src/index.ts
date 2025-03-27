export const BSPORT_AUTH_TOKEN_KEY = "bsport_auth_token";

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
  return localStorage.getItem(BSPORT_AUTH_TOKEN_KEY);
};

/**
 * Remove the authentication token from localStorage.
 */
export const removeAuthToken = () => {
  localStorage.removeItem(BSPORT_AUTH_TOKEN_KEY);
};
