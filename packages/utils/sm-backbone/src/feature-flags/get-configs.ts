type RuntimeFeatureFlagsConfig = {
  UNLEASH_PROXY_URL?: string;
  UNLEASH_CLIENT_KEY?: string;
  UNLEASH_ENVIRONMENT?: string;
};

export type FeatureFlagConfig = {
  proxyUrl: string;
  clientKey: string;
  environment: string;
};

const DEFAULT_UNLEASH_ENVIRONMENT = "default";

const getRuntimeFeatureFlagConfig = () => {
  if (typeof window === "undefined") {
    return {};
  }

  const runtimeConfig = (
    window as Window & { __SM_RUNTIME__?: RuntimeFeatureFlagsConfig }
  ).__SM_RUNTIME__;

  if (!runtimeConfig) {
    return {};
  }

  const proxyUrl = runtimeConfig.UNLEASH_PROXY_URL?.trim();
  const clientKey = runtimeConfig.UNLEASH_CLIENT_KEY?.trim();
  const environment = runtimeConfig.UNLEASH_ENVIRONMENT?.trim();

  return {
    proxyUrl: proxyUrl || undefined,
    clientKey: clientKey || undefined,
    environment: environment || undefined,
  };
};

export const getFeatureFlagConfig = (): FeatureFlagConfig | undefined => {
  const { proxyUrl, clientKey, environment } = getRuntimeFeatureFlagConfig();

  if ((proxyUrl && !clientKey) || (!proxyUrl && clientKey)) {
    console.warn(
      "[UNLEASH] Partial runtime config detected.",
      "Both window.__SM_RUNTIME__.UNLEASH_PROXY_URL and window.__SM_RUNTIME__.UNLEASH_CLIENT_KEY must be set.",
      "Feature flags will be disabled.",
    );
    return undefined;
  }

  if (!proxyUrl || !clientKey) {
    return undefined;
  }

  return {
    proxyUrl,
    clientKey,
    environment: environment || DEFAULT_UNLEASH_ENVIRONMENT,
  };
};

export function buildUnleashConfig() {
  const featureFlagConfig = getFeatureFlagConfig();

  if (!featureFlagConfig) {
    return undefined;
  }

  return {
    url: featureFlagConfig.proxyUrl,
    clientKey: featureFlagConfig.clientKey,
    appName: "studio-manager",
    environment: featureFlagConfig.environment,
    refreshInterval: 0,
    metricsInterval: 240,
    customHeaders: {
      "Cache-Control": "no-cache, no-store, must-revalidate",
      Pragma: "no-cache",
    },
  } as const;
}
