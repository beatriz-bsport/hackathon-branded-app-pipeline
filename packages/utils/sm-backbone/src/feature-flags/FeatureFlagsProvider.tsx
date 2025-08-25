import { FlagProvider, useUnleashClient } from "@unleash/proxy-client-react";
import React, { useEffect, useRef } from "react";

import { type Environment, getEnv } from "@bsport/envs";
import { companyThemeStore } from "@bsport/store-core-data-company-theme";

import { UNLEASH_CLIENT_KEY, UNLEASH_PROXY_URL } from "./constants";

function mapEnvToUnleashEnvironment(env: Environment) {
  if (env === "production") return "production" as const;
  return "development" as const;
}

function buildUnleashConfig() {
  const unleashEnv = mapEnvToUnleashEnvironment(getEnv());

  return {
    url: UNLEASH_PROXY_URL || "http://localhost:4242/api/frontend", // Default for local dev,
    clientKey:
      UNLEASH_CLIENT_KEY ||
      "default:development.unleash-insecure-frontend-api-token", // Default for local dev
    appName: "studio-manager",
    environment: unleashEnv,
    refreshInterval: 0,
    metricsInterval: 240,
  } as const;
}

const FeatureFlagsProvider: React.FC<{ children?: React.ReactNode }> = ({
  children,
}) => {
  const getConfig = () => {
    const baseConfig = buildUnleashConfig();

    return {
      ...baseConfig,
      context: {
        currentTime: new Date().toISOString(),
      },
    };
  };

  return (
    <FlagProvider
      config={getConfig()}
      startClient={false} // Don't start immediately
    >
      <ClientStarter />
      {children}
    </FlagProvider>
  );
};

// Component to start the client when companyId is available
const ClientStarter: React.FC = () => {
  const client = useUnleashClient();
  const clientStartedRef = useRef(false);

  useEffect(() => {
    // Subscribe to company theme store changes to detect when companyId becomes available
    const unsubscribe = companyThemeStore.subscribe((state) => {
      const currentCompanyId = state.companyTheme?.company;

      if (currentCompanyId && client && !clientStartedRef.current) {
        // Update context with companyId (keep it simple for now)
        const contextUpdate = {
          currentTime: new Date().toISOString(),
          companyId: String(currentCompanyId),
        };
        client.updateContext(contextUpdate as Record<string, unknown>);
        client.start();
        clientStartedRef.current = true;
      }
    });

    return unsubscribe;
  }, [client]);

  return null;
};

export default FeatureFlagsProvider;
