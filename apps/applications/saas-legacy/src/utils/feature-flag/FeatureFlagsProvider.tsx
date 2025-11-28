import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { FlagProvider, useUnleashClient } from '@unleash/proxy-client-react';
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
    customHeaders: {
      'Cache-Control': 'no-cache, no-store, must-revalidate',
      Pragma: 'no-cache',
    },
  } as const;
}

// Component to update context when companyId becomes available
const ContextUpdater: React.FC = () => {
  const client = useUnleashClient();
  const companyId = useSelector(
    (s: RootState) => themeSelectors.getTheme(s)?.company,
  );
  const franchiseId = useSelector((s: RootState) => getFranchiseId(s));
  const userId = useSelector((s: RootState) => s.auth?.id);

  useEffect(() => {
    if (!client || (!companyId && !franchiseId)) {
      return;
    }

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

    client.updateContext({ properties });
  }, [client, companyId, franchiseId, userId]);

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
    <FlagProvider config={config} startClient={true}>
      <ContextUpdater />
      {children}
    </FlagProvider>
  );
};

export default FeatureFlagsProvider;
