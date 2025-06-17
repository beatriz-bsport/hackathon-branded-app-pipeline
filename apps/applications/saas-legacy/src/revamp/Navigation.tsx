import React, { Suspense } from 'react';
import { createRemoteComponent } from '@module-federation/bridge-react';
import { loadRemote, init } from '@module-federation/runtime';
import { useHistory } from 'react-router-dom';

import '@bsport/sm-navigation-sidebar/styles';

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

export const Navigation: React.FC<{ className?: string }> = ({ className }) => {
  const navigate = useHistory().push;

  return (
    <Suspense fallback={null}>
      <NavigationSidebar className={className} navigate={navigate} />
    </Suspense>
  );
};

export default Navigation;
