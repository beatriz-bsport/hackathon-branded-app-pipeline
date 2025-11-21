import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import {
  FlagProvider,
  IMutableContext,
  useUnleashClient,
} from '@unleash/proxy-client-react';
import type { RootState } from '#src/reducers';
import { getFranchiseId } from '#src/libs/franchise/selectors';
import themeSelectors from '#src/libs/theme/selectors';
import Config from '#src/config';
import { captureException as sentryCaptureException } from '@sentry/react';

function buildUnleashConfig() {
  return {
    url: Config.REACT_APP_UNLEASH_PROXY_URL,
    clientKey: Config.REACT_APP_UNLEASH_CLIENT_KEY,
    appName: 'saas-legacy',
    environment: Config.REACT_APP_SENTRY_ENVIRONMENT,
    refreshInterval: 0,
    metricsInterval: 240,
  } as const;
}

// Component to start the client when companyId is available
const ClientStarter: React.FC = () => {
  const CONTEXT_TIMEOUT = 5000; // 5 seconds

  const client = useUnleashClient();

  const [isClientStarted, setIsClientStarted] = useState(false);

  const startWithContext = useCallback(
    (context: IMutableContext) => {
      client.updateContext(context);
      client.start();
      setIsClientStarted(true);
    },
    [client],
  );

  const companyId = useSelector(
    (s: RootState) => themeSelectors.getTheme(s)?.company,
  );

  const franchiseId = useSelector((s: RootState) => getFranchiseId(s));

  const userId = useSelector((s: RootState) => s.auth?.id);

  const context = useMemo<IMutableContext>(() => {
    const properties: Record<string, string> = {
      currentTime: new Date().toISOString(),
    };

    if (companyId) {
      properties.companyId = String(companyId);
    }
    if (franchiseId) {
      properties.franchiseId = String(franchiseId);
    }
    if (userId) {
      properties.userId = String(userId);
    }

    return { properties };
  }, [companyId, franchiseId, userId]);

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
        '[FeatureFlags] Starting Unleash client with default context after timeout',
      );
      const error = new Error('Unleash started with default context');
      sentryCaptureException(error, {
        extra: {
          feature: 'unleash',
          issue: 'context-timeout',
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
        console.error('[FeatureFlags] Failed to start Unleash client:', error);
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

const FeatureFlagsProvider: React.FC<{ children?: React.ReactNode }> = ({
  children,
}) => {
  const config = buildUnleashConfig();

  if (!config.url || !config.clientKey) {
    console.warn(
      '[FeatureFlags] Missing Unleash config, running without feature flags',
    );
    const error = new Error('Missing Unleash config');
    sentryCaptureException(error, {
      extra: {
        feature: 'unleash',
        issue: 'provider-initialization',
        config: config,
      },
    });
    return <>{children}</>;
  }

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

export default FeatureFlagsProvider;
