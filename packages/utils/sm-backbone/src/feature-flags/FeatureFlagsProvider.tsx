import { FlagProvider, useUnleashClient } from "@unleash/proxy-client-react";
import React, { useEffect } from "react";

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
    customHeaders: {
      "Cache-Control": "no-cache, no-store, must-revalidate",
      Pragma: "no-cache",
    },
  } as const;
}

const FeatureFlagsProvider: React.FC<{ children?: React.ReactNode }> = ({
  children,
}) => {
  const config = buildUnleashConfig();

  return (
    <FlagProvider config={config} startClient={true}>
      <ContextUpdater />
      {children}
    </FlagProvider>
  );
};

// Component to update context when companyId becomes available
const ContextUpdater: React.FC = () => {
  const client = useUnleashClient();
  const companyTheme = dataAccessLayer.useCompanyTheme();
  const user = dataAccessLayer.useUserAccess();

  useEffect(() => {
    if (!client || (!companyTheme?.company && !companyTheme?.franchisor)) {
      return;
    }

    const properties: Record<string, string> = {
      currentTime: new Date().toISOString(),
    };

    if (companyTheme?.company) {
      properties.companyId = String(companyTheme.company);
    }
    if (companyTheme?.franchisor) {
      properties.franchiseId = String(companyTheme.franchisor);
    }
    if (user?.id) {
      properties.userId = String(user.id);
    }

    client.updateContext({ properties });
  }, [client, companyTheme?.company, companyTheme?.franchisor, user?.id]);

  return null;
};

export default FeatureFlagsProvider;
