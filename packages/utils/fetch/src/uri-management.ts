const DEFAULT_RUNTIME_API_BASE_URL = "https://api.production.bsport.io";

const getRuntimeFetchEnvValue = (key: keyof StudioManagerRuntime) => {
  if (typeof window === "undefined") {
    return undefined;
  }

  return window.__SM_RUNTIME__?.[key];
};

export const getRuntimeAPIBaseUrl = () => {
  const apiBaseUrl = getRuntimeFetchEnvValue("API_BASE_URL");

  if (typeof apiBaseUrl !== "string") {
    return DEFAULT_RUNTIME_API_BASE_URL;
  }

  const normalizedApiBaseUrl = apiBaseUrl.trim();
  return normalizedApiBaseUrl || DEFAULT_RUNTIME_API_BASE_URL;
};

const normalizeRelativeUri = (uri: string) => {
  return uri.startsWith("/") ? uri.slice(1) : uri;
};

const normalizeApiBaseUrl = (apiBaseUrl: string) => {
  return apiBaseUrl.replace(/\/+$/, "");
};

const buildFullUriFromBaseUrl = ({
  apiBaseUrl,
  uri,
}: {
  apiBaseUrl: string;
  uri: string;
}) => {
  return `${normalizeApiBaseUrl(apiBaseUrl)}/${normalizeRelativeUri(uri)}`;
};

/**
 * Build final URI of a request by combining the request URL with the backend domain
 */
export function getFullUri(uri: string) {
  try {
    new URL(uri);
    return uri; // If parsing succeeds, it's a complete URL, return as is
  } catch (_) {
    return buildFullUriFromBaseUrl({
      apiBaseUrl: getRuntimeAPIBaseUrl(),
      uri,
    });
  }
}
