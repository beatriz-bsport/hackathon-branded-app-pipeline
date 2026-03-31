const MISSING_RUNTIME_API_BASE_URL_MESSAGE =
  "[Fetch] Missing runtime API base URL. Configure window.runtime.env.VITE_API_BASE_URL in env.js.";

const getRuntimeFetchEnvValue = (key: keyof RuntimeFetchEnv) => {
  if (typeof window === "undefined") {
    return undefined;
  }

  return window.runtimeBsport?.env?.[key] ?? window.runtime?.env?.[key];
};

export const getRuntimeAPIBaseUrl = () => {
  const apiBaseUrl =
    getRuntimeFetchEnvValue("VITE_API_BASE_URL") ??
    getRuntimeFetchEnvValue("API_BASE_URL");

  if (typeof apiBaseUrl !== "string") {
    return undefined;
  }

  const normalizedApiBaseUrl = apiBaseUrl.trim();
  return normalizedApiBaseUrl || undefined;
};

const getRequiredRuntimeAPIBaseUrl = () => {
  const apiBaseUrl = getRuntimeAPIBaseUrl();

  if (!apiBaseUrl) {
    throw new Error(MISSING_RUNTIME_API_BASE_URL_MESSAGE);
  }

  return apiBaseUrl;
};

const normalizeRelativeUri = (uri: string) => {
  return uri.startsWith("/") ? uri.slice(1) : uri;
};

const buildFullUriFromBaseUrl = ({
  apiBaseUrl,
  uri,
}: {
  apiBaseUrl: string;
  uri: string;
}) => {
  return `${apiBaseUrl}/${normalizeRelativeUri(uri)}`;
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
      apiBaseUrl: getRequiredRuntimeAPIBaseUrl(),
      uri,
    });
  }
}
