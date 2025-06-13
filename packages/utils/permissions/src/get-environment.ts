import { type KnownEnvironment, getEnv, isFeatureBranch } from "@bsport/envs";

export type Environment = KnownEnvironment | "featureBranch";

/**
 * Return, for each known environment, whether it is the current environment, based on the URL.
 */
export function getEnvironment(): Record<Environment, boolean> {
  try {
    const currentEnv = getEnv();

    return {
      production: currentEnv === "production",
      staging: currentEnv === "staging",
      dev: currentEnv === "dev",
      local: currentEnv === "local",
      featureBranch: isFeatureBranch(),
    };
  } catch (error) {
    console.error(error);

    return {
      production: false,
      staging: false,
      dev: false,
      local: false,
      featureBranch: false,
    };
  }
}
