import {
  type Environment,
  type KnownEnvironment,
  getEnv,
  isEnvFeatureBranch,
} from "@bsport/envs";

// ----- Constants -----

const FEATURE_BRANCH_API_SUFFIX = "chaos.bsport.io";

const DEPLOYED_ENVIRONMENTS = [
  "dev",
  "staging",
  "production",
] as const satisfies Array<KnownEnvironment>;

type DeployedEnvironment = (typeof DEPLOYED_ENVIRONMENTS)[number];

export const MAP_ENV_TO_API_URL: Record<DeployedEnvironment | "local", string> =
  {
    dev: "https://api.dev.bsport.io",
    staging: "https://api.staging.bsport.io",
    production: "https://api.production.bsport.io",
    local: "http://localhost:8000",
  } as const;

// ----- Helpers -----

/**
 * Return false if VITE_FRONTEND_ONLY (CI env variable FRONTEND_ONLY) is injected as "false"
 * Default behavior: fallback to true
 */
export const getIsFrontendOnly = () => {
  return import.meta.env.VITE_FRONTEND_ONLY !== "false";
};

/**
 * Return with strong typing inference whether the env is dev, staging or production.
 * @param env Current environment
 */
const isEnvDeployedEnvironment = (
  env: Environment,
): env is DeployedEnvironment => {
  return DEPLOYED_ENVIRONMENTS.includes(env as DeployedEnvironment);
};

/**
 * Build the API base url of a feature branch based on its identifier.
 * @param featureBranch Identifier of the feature branch
 */
export const getApiFeatureBranchUrl = (featureBranch: string): string => {
  return `https://api-${featureBranch}.${FEATURE_BRANCH_API_SUFFIX}`;
};

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
    const runtimeApiBaseUrl = getRuntimeAPIBaseUrl();
    if (runtimeApiBaseUrl) {
      return buildFullUriFromBaseUrl({ apiBaseUrl: runtimeApiBaseUrl, uri });
    }

    const env = getEnv();

    if (isEnvDeployedEnvironment(env)) {
      const apiBaseUrl = MAP_ENV_TO_API_URL[env];
      return buildFullUriFromBaseUrl({ apiBaseUrl, uri });
    }

    if (env === "storybook") {
      const apiBaseUrl = MAP_ENV_TO_API_URL.dev;
      return buildFullUriFromBaseUrl({ apiBaseUrl, uri });
    }

    if (isEnvFeatureBranch(env)) {
      const isFrontendOnly = getIsFrontendOnly();
      const apiBaseUrl = isFrontendOnly
        ? MAP_ENV_TO_API_URL.dev
        : getApiFeatureBranchUrl(env);

      return buildFullUriFromBaseUrl({ apiBaseUrl, uri });
    }

    const apiBaseUrl = getLocalAPIBaseUrl();
    return buildFullUriFromBaseUrl({ apiBaseUrl, uri });
  }
}

/**
 * Store in the browser's window the API environment to use at runtime by fetch
 * @param apiEnv Name of the API environment to use
 */
export function setLocalAPIEnv(apiEnv?: string) {
  const frontendEnv = getEnv();
  if (isEnvDeployedEnvironment(frontendEnv)) {
    // Silently do nothing - No console messages
    return;
  }

  if (typeof window === "undefined") {
    console.warn(
      "[Fetch] ⚠️ window is undefined. Could not set runtime API Env. Fallback to Static Env variable.",
    );
    return;
  }

  if (!apiEnv) {
    console.warn(
      "[Fetch] ⚠️ apiEnv is undefined. Could not set runtime API Env. Fallback to Static Env variable.",
    );
    return;
  }

  window.__API_ENV__ = apiEnv;
}

/**
 * Return the API Base url to be used in local runtime.
 * The result of this method will be used by fetch only in local development.
 * For deployed environments and feature branches, cf getFullUri.
 */
export const getLocalAPIBaseUrl = () => {
  if (typeof window === "undefined" || !window.__API_ENV__) {
    return import.meta.env.VITE_API_BASE_URL ?? MAP_ENV_TO_API_URL.dev;
  }

  const apiEnv = window.__API_ENV__;

  if (isEnvDeployedEnvironment(apiEnv)) {
    return MAP_ENV_TO_API_URL[apiEnv];
  }

  if (apiEnv === "local" || apiEnv === "localhost") {
    return MAP_ENV_TO_API_URL.local;
  }

  // Assume it's a feature branch
  return getApiFeatureBranchUrl(apiEnv);
};
