import React, { Suspense, useEffect, useCallback, memo } from 'react';
import { createRemoteComponent } from '@module-federation/bridge-react';
import { loadRemote, init } from '@module-federation/runtime';
import { useHistory } from 'react-router-dom';
import { clsx } from 'clsx';
import { resetAnalyticsB2B } from '#src/components/analytics/mixpanel';
import { REVAMPED_BO_DOMAIN } from './constants';

import './compat-drawer.css';

const isDev = process.env.NODE_ENV === 'development';
const entry = isDev
  ? 'http://localhost:4050/remoteEntry.js'
  : `${REVAMPED_BO_DOMAIN}/apps/navigation-sidebar/remoteEntry.js`;

init({
  name: 'saas-legacy',
  remotes: [
    {
      name: 'sm-navigation-sidebar',
      entry,
      type: 'module',
    },
  ],
});

type NavigationSidebarProps = {
  className?: string;
  navigate: (path: string) => void;
  disableRevampOnLegacyStore?: () => void;
  onLogoutCallback?: () => void;
};

const NavigationSidebarFallback = () => (
  <div
    className={clsx(
      'navigation-sidebar-container',
      'backoffice-drawer-shared-container',
      'navigation-sidebar-fallback',
    )}
  />
);

const NavigationSidebar = createRemoteComponent<
  React.ComponentType<NavigationSidebarProps>
>({
  loader: async (): Promise<React.ComponentType<NavigationSidebarProps>> => {
    try {
      const remote = (await loadRemote(
        'sm-navigation-sidebar/BridgedSidebar',
      )) as React.ComponentType<NavigationSidebarProps>;
      return remote;
    } catch (error) {
      // Re-throw the error to trigger the error boundary if needed
      throw error;
    }
  },
  fallback: (): null => null,
  loading: <NavigationSidebarFallback />,
});

export const Navigation: React.FC<{
  updateRevampedBackofficeEnabled: (nextValue: boolean) => void;
}> = ({ updateRevampedBackofficeEnabled }) => {
  const navigate = useHistory().push;

  useEffect(() => {
    //@ts-expect-error
    import('@bsport/sm-navigation-sidebar/styles');
  }, []);

  const disableRevampOnLegacyStore = useCallback(() => {
    updateRevampedBackofficeEnabled(false);
  }, [updateRevampedBackofficeEnabled]);

  return (
    <Suspense fallback={null}>
      <NavigationSidebar
        className={clsx(
          'navigation-sidebar-container',
          'backoffice-drawer-shared-container',
        )}
        disableRevampOnLegacyStore={disableRevampOnLegacyStore}
        navigate={navigate}
        onLogoutCallback={resetAnalyticsB2B}
      />
    </Suspense>
  );
};

export default memo(Navigation);
