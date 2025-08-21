import { FlagProvider } from "@unleash/proxy-client-react";
import React from "react";

import { type Environment, getEnv } from "@bsport/envs";

import { dataAccessLayer } from "../data-access-layer";
import { UNLEASH_CLIENT_KEY, UNLEASH_PROXY_URL } from "./constants";

function mapEnvToUnleashEnvironment(env: Environment) {
  if (env === "production") return "production" as const;
  return "development" as const;
}

function buildUnleashConfig() {
  const unleashEnv = mapEnvToUnleashEnvironment(getEnv());
  const url = UNLEASH_PROXY_URL;
  const clientKey = UNLEASH_CLIENT_KEY;
  if (!url || !clientKey) return null;

  return {
    url,
    clientKey,
    appName: "studio-manager",
    environment: unleashEnv,
    refreshInterval: 0,
    metricsInterval: 240,
  } as const;
}

const FeatureFlagsProvider: React.FC<{ children?: React.ReactNode }> = ({
  children,
}) => {
  // Context sources from shared Zustand stores
  const companyTheme = dataAccessLayer.useCompanyTheme();
  const userAccess = dataAccessLayer.useUserAccess();

  const companyId = companyTheme?.company;
  const userEmail = userAccess?.username;

  // Best-effort franchiseId: only send when clearly scoped to a single franchise
  const franchiseId = (() => {
    if (
      userAccess?.is_franchisor &&
      Array.isArray(userAccess.allowed_franchisees)
    ) {
      return userAccess.allowed_franchisees.length === 1
        ? userAccess.allowed_franchisees[0]
        : undefined;
    }
    return undefined;
  })();

  if (!companyId && !franchiseId) {
    return <>{children}</>;
  }

  const config = buildUnleashConfig();
  if (config == null) {
    return <>{children}</>;
  }

  return (
    <FlagProvider
      config={{
        ...config,
        context: {
          // Standard Unleash context fields
          ...(userEmail ? { userId: userEmail } : {}),
          currentTime: new Date().toISOString(),
          // Custom properties
          properties: {
            ...(companyId ? { companyId: String(companyId) } : {}),
            ...(franchiseId ? { franchiseId: String(franchiseId) } : {}),
          },
        },
      }}
    >
      {children}
    </FlagProvider>
  );
};

export default FeatureFlagsProvider;
