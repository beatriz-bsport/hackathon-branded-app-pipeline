import {
  FlagProvider,
  IMutableContext,
  useUnleashClient,
} from "@unleash/proxy-client-react";
import React, { useCallback, useEffect, useMemo, useState } from "react";

import { getEnv } from "@bsport/envs";
import { captureException } from "@bsport/sentry";

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
  const CONTEXT_TIMEOUT = 3000; // 3 seconds

  const client = useUnleashClient();
  const [isClientStarted, setIsClientStarted] = useState(false);
  const companyTheme = dataAccessLayer.useCompanyTheme();
  const user = dataAccessLayer.useUserAccess();

  const startWithContext = useCallback(
    (context: IMutableContext) => {
      client.updateContext(context);
      client.start();
      setIsClientStarted(true);
    },
    [client],
  );

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

    if (user?.id) {
      properties.userId = String(user.id);
    }

    return {
      properties,
    };
  }, [companyTheme?.company, companyTheme?.franchisor, user?.id]);

  useEffect(() => {
    /* Function to start client with default context
    if required context is not available within timeout
    This ensures the client always starts */
    const startWithDefault = () => {
      if (isClientStarted) return;
      startWithContext({
        properties: {
          currentTime: new Date().toISOString(),
        },
      });
      console.warn(
        "[FeatureFlags] Starting Unleash client with default context after timeout",
      );
      const error = new Error("Unleash started with default context");
      captureException(error, {
        extra: {
          feature: "unleash",
          issue: "context-timeout",
        },
      });
    };

    if (isClientStarted || !client) {
      return;
    }

    let timeoutId: NodeJS.Timeout | undefined;

    const hasRequiredContext =
      context.properties?.companyId || context.properties?.franchiseId;

    if (!hasRequiredContext) {
      timeoutId = setTimeout(startWithDefault, CONTEXT_TIMEOUT);
    }

    if (hasRequiredContext) {
      try {
        startWithContext(context);
      } catch (error) {
        console.error("[FeatureFlags] Failed to start Unleash client:", error);
      }
    }
    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [context, client, isClientStarted, startWithContext]);

  return null;
};

export default FeatureFlagsProvider;
