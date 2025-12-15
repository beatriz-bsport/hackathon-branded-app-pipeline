import { type Environment, getEnv, isEnvFeatureBranch } from "@bsport/envs";

import {
  ENVS,
  FEATURE_FLAG_CONFIGS,
  type FeatureFlagConfig,
} from "./constants";

export const getFeatureFlagConfig = (
  environment: Environment,
): FeatureFlagConfig => {
  if (isEnvFeatureBranch(environment)) {
    return FEATURE_FLAG_CONFIGS["feature-branch"];
  }

  if (environment === ENVS.local) {
    const unleashProxyUrl = import.meta.env.VITE_UNLEASH_PROXY_URL;
    const unleashClientKeyOverride = import.meta.env.VITE_UNLEASH_CLIENT_KEY;

    if (
      (unleashProxyUrl && !unleashClientKeyOverride) ||
      (!unleashProxyUrl && unleashClientKeyOverride)
    ) {
      console.warn(
        "[UNLEASH] Partial override detected.",
        "Both VITE_UNLEASH_PROXY_URL and VITE_UNLEASH_CLIENT_KEY must be set.",
        "Falling back to dev config.",
      );
    }

    /**
     * @todo Use runtime window variable to provide the override
     * instead of env variables
     */
    if (unleashProxyUrl && unleashClientKeyOverride) {
      return {
        proxyUrl: unleashProxyUrl,
        clientKey: unleashClientKeyOverride,
      };
    }
    return FEATURE_FLAG_CONFIGS.dev;
  }

  if (["dev", "staging", "production"].includes(environment)) {
    return FEATURE_FLAG_CONFIGS[
      environment as "dev" | "staging" | "production"
    ];
  }

  return FEATURE_FLAG_CONFIGS.dev;
};

export function buildUnleashConfig() {
  const env = getEnv();
  const { clientKey, proxyUrl } = getFeatureFlagConfig(env);

  const finalEnvironment = isEnvFeatureBranch(env)
    ? ENVS["feature-branch"]
    : env;

  return {
    url: proxyUrl,
    clientKey,
    appName: "studio-manager",
    environment: finalEnvironment,
    refreshInterval: 0,
    metricsInterval: 240,
    customHeaders: {
      "Cache-Control": "no-cache, no-store, must-revalidate",
      Pragma: "no-cache",
    },
  } as const;
}
