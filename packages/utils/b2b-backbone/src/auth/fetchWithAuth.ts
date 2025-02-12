import { EXCLUDED_URLS, LOGIN_URL, fetch } from "#src/auth/constants";
import { getAuthToken, logout } from "#src/auth/tokenUtils";

/**
 * A wrapper around the fetch API that adds the Authorization header if a token is present.
 * @param slug - The API slug.
 * @param options - Additional fetch options.
 * @returns The fetch response.
 */
export const fetchWithAuth = async (
  slug: string,
  options: RequestInit = {},
) => {
  // Check if the URL is in the list of excluded URLs
  if (EXCLUDED_URLS.some((excludedUrl) => slug.includes(excludedUrl))) {
    return fetch(slug, options); // Just make the request without adding the auth token
  }

  const token = getAuthToken();

  if (!token && window.location.pathname !== LOGIN_URL) {
    window.location.href = LOGIN_URL;
    throw new Error("No authentication token found");
  }

  const response = await fetch(slug, {
    ...options,
    headers: {
      Authorization: `Token ${token}`,
      ...options.headers,
    },
  });

  if (response.status === 401) {
    logout();
    throw new Error("Invalid auth token");
  }

  return response;
};

export default fetchWithAuth;
