import React, { Suspense, useEffect, useCallback } from 'react';
import { createRemoteComponent } from '@module-federation/bridge-react';
import { loadRemote, init } from '@module-federation/runtime';
import { useHistory } from 'react-router-dom';

const isDev = process.env.NODE_ENV === 'development';
const entry = isDev
  ? 'http://localhost:4050/remoteEntry.js'
  : '/studio/apps/navigation-sidebar/remoteEntry.js';

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
};

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
  loading: (): null => null,
});

export const Navigation: React.FC<{
  className?: string;
  updateRevampedBackofficeEnabled: (nextValue: boolean) => void;
}> = ({ className, updateRevampedBackofficeEnabled }) => {
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
        className={className}
        disableRevampOnLegacyStore={disableRevampOnLegacyStore}
        navigate={navigate}
      />
    </Suspense>
  );
};

export default Navigation;
