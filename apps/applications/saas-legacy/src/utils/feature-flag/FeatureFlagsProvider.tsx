import React from 'react';
import { useSelector } from 'react-redux';
import { FlagProvider } from '@unleash/proxy-client-react';
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

const FeatureFlagsProvider: React.FC<{ children?: React.ReactNode }> = ({
  children,
}) => {
  const companyId = useSelector(
    (s: RootState) => themeSelectors.getTheme(s)?.company,
  );
  const franchiseId = useSelector((s: RootState) => getFranchiseId(s));
  const userEmail = useSelector((s: RootState) => s.auth?.username);

  if (!companyId && !franchiseId) return <>{children}</>;

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
