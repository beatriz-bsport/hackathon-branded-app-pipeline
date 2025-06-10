const ENVIRONMENTS = {
  production: "production",
  staging: "staging",
  featureBranch: "featureBranch",
  dev: "dev",
  local: "local",
} as const;

export type Environment = keyof typeof ENVIRONMENTS;

/**
 * Return, for each known environment, whether it is the current environment, based on the URL.
 */
export function getEnvironment(): Record<Environment, boolean> {
  try {
    const domain = window.location.host;
    return {
      [ENVIRONMENTS.production]: domain === "backoffice.bsport.io",
      [ENVIRONMENTS.staging]: domain === "backoffice.staging.bsport.io",
      [ENVIRONMENTS.featureBranch]: domain.includes("chaos.bsport.io"),
      [ENVIRONMENTS.dev]: domain === "backoffice.dev.bsport.io",
      [ENVIRONMENTS.local]: domain.includes("localhost"),
    };
  } catch (error) {
    console.error(error);
    return {
      [ENVIRONMENTS.production]: false,
      [ENVIRONMENTS.staging]: false,
      [ENVIRONMENTS.featureBranch]: false,
      [ENVIRONMENTS.dev]: false,
      [ENVIRONMENTS.local]: false,
    };
  }
}
