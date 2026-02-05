/**
 * Helper to authenticate with dev credentials in Storybook
 * This stores the auth token in localStorage using the same key as @bsport/local-storage-auth-token
 * so it can be used by @bsport/fetch
 */
import { getAuthToken, setAuthToken } from "@bsport/local-storage-auth-token";

const AUTH_EMAIL = "dev@bsport.io";
const AUTH_PASSWORD = "dev";
const AUTH_API_URL =
  "https://api.dev.bsport.io/api/v1/authentication/signin/with-login/";

let authPromise: Promise<string> | null = null;

/**
 * Authenticate with dev credentials and store token in localStorage
 * Returns the token if authentication is successful
 */
export async function authenticateDev(): Promise<string> {
  // If we already have a token in localStorage, return it
  const existingToken = getAuthToken();
  if (existingToken) {
    return existingToken;
  }

  // If authentication is already in progress, wait for it
  if (authPromise) {
    return authPromise;
  }

  // Start authentication
  authPromise = (async () => {
    try {
      const authResponse = await fetch(AUTH_API_URL, {
        credentials: "omit",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          "X-React-Referrer": "https://backoffice.dev.bsport.io/login",
        },
        referrer: "https://backoffice.dev.bsport.io/",
        body: JSON.stringify({
          email: AUTH_EMAIL,
          password: AUTH_PASSWORD,
        }),
        method: "POST",
      });

      if (!authResponse.ok) {
        throw new Error(`Authentication failed: ${authResponse.status}`);
      }

      const responseData = await authResponse.json();
      const token = responseData.token;

      if (!token) {
        throw new Error("No token in authentication response");
      }

      // Store token in localStorage using the same key as @bsport/local-storage-auth-token
      setAuthToken(token);

      return token;
    } catch (error) {
      authPromise = null; // Reset on error so we can retry
      throw error;
    }
  })();

  return authPromise;
}
