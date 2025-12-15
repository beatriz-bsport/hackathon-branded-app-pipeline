import {
  type Environment,
  type KnownEnvironment,
  getEnv,
  isEnvFeatureBranch,
} from "@bsport/envs";

// ----- Constants -----

const API_LOCAL = "http://localhost:8000";
const API_SUFFIX_FEATURE_BRANCH = "chaos.bsport.io";

const DEPLOYED_ENVIRONMENTS = [
  "dev",
  "staging",
  "production",
] as const satisfies Array<KnownEnvironment>;

type DeployedEnvironment = (typeof DEPLOYED_ENVIRONMENTS)[number];

export const MAP_ENV_TO_API_URL: Record<DeployedEnvironment, string> = {
  dev: "https://api.dev.bsport.io",
  staging: "https://api.staging.bsport.io",
  production: "https://api.production.bsport.io",
} as const;

export const LEGACY_API = {
  v0: "api-v0",
  v1: "api/v1",
} as const;

// ----- Helpers -----

/**
 * Return the API Base url to be used in local runtime
 */
export const getLocalAPIBaseUrl = () => {
  /**
   * @todo Replace in next PR to rely on window runtime variables
   */
  return import.meta.env.VITE_API_BASE_URL ?? MAP_ENV_TO_API_URL.dev;
};

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
 * @returns
 */
const getApiFeatureBranchUrl = (featureBranch: string): string => {
  return `https://api-${featureBranch}.chaos.bsport.io`;
};

// ----- Core functions -----

/**
 * For backend feature branch and local backend, by default only one Pod api is running.
 * For these cases, replace the domain prefix with api
 * -> if v0 (e.g. platform/v0) -> replace with api-v0
 * -> if v1 (e.g. platform/v1) -> replace with api/v1
 */
export const getLegacyUri = (uri: string) => {
  const cleanedUri = uri.startsWith("/") ? uri.slice(1, uri.length) : uri;
  if (
    cleanedUri.startsWith(LEGACY_API.v0) ||
    cleanedUri.startsWith(LEGACY_API.v1)
  ) {
    // Nothing to change
    return cleanedUri;
  }

  // Parse the version: {domain}/{version}/...
  const [version, ...otherParts] = cleanedUri.split("/").slice(1);

  // Validate that we have a recognized version segment
  if (!version || (version !== "v0" && version !== "v1")) {
    console.warn(`Unexpected URI structure for local/feature API: ${uri}`);
    return cleanedUri;
  }

  return `${version === "v0" ? LEGACY_API.v0 : LEGACY_API.v1}/${otherParts.join("/")}`;
};

/**
 * Build final URI of a request by combining the request URL with the backend domain
 */
export function getFullUri(uri: string) {
  const env = getEnv();

  if (isEnvDeployedEnvironment(env)) {
    const apiBaseUrl = MAP_ENV_TO_API_URL[env];
    return `${apiBaseUrl}/${uri}`;
  }

  if (isEnvFeatureBranch(env)) {
    const isFrontendOnly = getIsFrontendOnly();
    const apiBaseUrl = isFrontendOnly
      ? MAP_ENV_TO_API_URL.dev
      : getApiFeatureBranchUrl(env);

    const versionizedUri = isFrontendOnly
      ? uri // Aligned with dev
      : getLegacyUri(uri);

    return `${apiBaseUrl}/${versionizedUri}`;
  }

  const apiBaseUrl = getLocalAPIBaseUrl();
  const isLegacyAPI =
    apiBaseUrl.includes(API_SUFFIX_FEATURE_BRANCH) ||
    apiBaseUrl.includes(API_LOCAL);

  const versionizedUri = isLegacyAPI ? getLegacyUri(uri) : uri;

  return `${apiBaseUrl}/${versionizedUri}`;
}
