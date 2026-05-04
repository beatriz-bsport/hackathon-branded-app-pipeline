import { type KnownEnvironment, getEnv } from "@bsport/envs";

export type Environment = KnownEnvironment;

export const DEFAULT_ENVS_MAP = {
  production: false,
  staging: false,
  dev: false,
  local: false,
};

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
    };
  } catch (error) {
    console.error(error);

    return DEFAULT_ENVS_MAP;
  }
}
