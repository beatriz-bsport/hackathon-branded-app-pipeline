import { BSPORT_AUTH_TOKEN_KEY, LOGIN_URL, fetch } from "#src/auth/constants";

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
 * Remove the authentication token from localStorage and redirect to the login page.
 */
export const removeAuthToken = () => {
  localStorage.removeItem(BSPORT_AUTH_TOKEN_KEY);
};

/**
 * Try to log in with the provided email and password.
 * If the login is successful, the token is stored in localStorage.
 * @param email
 * @param password
 */
export const login = async (email: string, password: string) => {
  // Hardcoded on dev API for now
  const { data } = await fetch<{ token: string }>(
    "api/v1/authentication/signin/with-login/",
    {
      method: "POST",
      body: JSON.stringify({
        email,
        password,
      }),
    },
  );

  const token = data.token;

  if (token) {
    setAuthToken(token);
  } else {
    throw new Error("Token not found in response.");
  }
};

/**
 * Remove the authentication token from localStorage and redirect to the login page.
 */
export const logout = () => {
  removeAuthToken();
  window.location.href = LOGIN_URL;
};
