export type KnownEnvironment = "local" | "dev" | "staging" | "production";
export type Environment = KnownEnvironment | (string & {});

export function getEnv(url?: string): Environment {
  const targetUrl =
    url || (typeof window !== "undefined" ? window.location.href : "");

  if (!targetUrl) {
    return "local";
  }

  try {
    const urlObj = new URL(targetUrl);
    const hostname = urlObj.hostname;

    // localhost:3000 -> local (any port is allowed)
    if (hostname === "localhost" || hostname === "127.0.0.1") {
      return "local";
    }

    // backoffice.dev.bsport.io -> dev
    if (hostname === "backoffice.dev.bsport.io") {
      return "dev";
    }

    // backoffice.staging.bsport.io -> staging
    if (hostname === "backoffice.staging.bsport.io") {
      return "staging";
    }

    // backoffice.bsport.io -> production
    if (hostname === "backoffice.bsport.io") {
      return "production";
    }

    // docs.infra.bsport.io/storybook -> storybook
    if (
      hostname === "docs.infra.bsport.io" &&
      urlObj.pathname.startsWith("/storybook")
    ) {
      return "storybook" as Environment;
    }

    // backoffice-{name}.chaos.bsport.io -> {name} (feature branch deployments)
    // Pattern: backoffice-{name}.chaos.bsport.io
    if (
      hostname.endsWith(".chaos.bsport.io") &&
      hostname.startsWith("backoffice-")
    ) {
      const name = hostname.slice(
        "backoffice-".length,
        hostname.length - ".chaos.bsport.io".length,
      );
      return name as Environment;
    }

    // Default to production for any other bsport.io domain
    if (hostname.endsWith(".bsport.io")) {
      return "production";
    }

    // Default fallback
    return "local";
  } catch (error) {
    // If URL parsing fails, return local
    return "local";
  }
}

/**
 * Check if the current environment is a feature branch deployment.
 * Feature branches are any environment that's not one of the standard environments.
 *
 * @param url Optional URL to check. If not provided, uses current window.location.href
 * @returns true if current environment is a feature branch, false otherwise
 */
export function isFeatureBranch(url?: string): boolean {
  const env = getEnv(url);
  return isEnvFeatureBranch(env);
}

/**
 * Check if the provided environment is a feature branch deployment.
 *
 * @param env Env to check
 * @returns true if provided environment is a feature branch, false otherwise
 */
export function isEnvFeatureBranch(env: Environment): boolean {
  const knownEnvironments: KnownEnvironment[] = [
    "local",
    "dev",
    "staging",
    "production",
  ];
  return !knownEnvironments.includes(env as KnownEnvironment);
}
