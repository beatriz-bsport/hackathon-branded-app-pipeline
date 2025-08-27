import {
  FlagProvider,
  IMutableContext,
  useUnleashClient,
} from "@unleash/proxy-client-react";
import React, { useEffect, useMemo, useState } from "react";

import { getEnv } from "@bsport/envs";

import { dataAccessLayer } from "#src/data-access-layer";

import { UNLEASH_CLIENT_KEY, UNLEASH_PROXY_URL } from "./constants";

function buildUnleashConfig() {
  return {
    url: UNLEASH_PROXY_URL || "http://localhost:4242/api/frontend", // Default for local dev,
    clientKey:
      UNLEASH_CLIENT_KEY ||
      "default:development.unleash-insecure-frontend-api-token", // Default for local dev
    appName: "studio-manager",
    environment: getEnv(),
    refreshInterval: 0,
    metricsInterval: 240,
  } as const;
}

const FeatureFlagsProvider: React.FC<{ children?: React.ReactNode }> = ({
  children,
}) => {
  const config = useMemo(() => buildUnleashConfig(), []);

  return (
    <FlagProvider
      config={config}
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
  const [isClientStarted, setIsClientStarted] = useState(false);
  const companyTheme = dataAccessLayer.useCompanyTheme();
  const user = dataAccessLayer.useUserAccess();

  const context = useMemo<IMutableContext>(() => {
    const properties: Record<string, string> = {
      currentTime: new Date().toISOString(),
    };

    if (companyTheme?.company) {
      properties.companyId = String(companyTheme.company);
    }
    if (companyTheme?.franchisor) {
      properties.franchiseId = String(companyTheme.franchisor);
    }

    return {
      ...(user?.username ? { userId: user.username } : {}),
      properties,
    };
  }, [companyTheme?.company, companyTheme?.franchisor, user?.username]);

  useEffect(() => {
    if (isClientStarted || !client) {
      return;
    }

    const hasRequiredContext =
      (context.properties?.companyId || context.properties?.franchiseId) &&
      "userId" in context;

    if (hasRequiredContext) {
      try {
        client.updateContext(context);
        client.start();
        setIsClientStarted(true);
      } catch (error) {
        console.error("[FeatureFlags] Failed to start Unleash client:", error);
      }
    }
  }, [context, client, isClientStarted]);

  return null;
};

export default FeatureFlagsProvider;
