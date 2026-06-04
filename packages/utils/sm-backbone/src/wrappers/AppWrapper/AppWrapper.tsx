import { type QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import React from "react";
import { BrowserRouter } from "react-router";
import { UnleashClient } from "unleash-proxy-client";

import { instanciateAppI18n } from "@bsport/i18n";
import {
  KaizenI18nProvider,
  ThemeProvider,
  i18nNamespacePrefix,
  i18nNamespaces,
  inMemoryTranslationsLoader,
} from "@bsport/kaizen-primitive-core";
import { initSentry, unleashIntegration } from "@bsport/sentry";

import DevTools from "#src/dev-utils/DevTools";
import FeatureFlagsProvider from "#src/feature-flags/FeatureFlagsProvider";
import { BackgroundTaskHost } from "#src/features/background-task-host";
import { getDefaultQueryClient } from "#src/query-client";
import { initializeStudioRuntimeFromStorage } from "#src/runtime/runtime-config";
import { ErrorBoundaryWrapper } from "#src/wrappers/ErrorBoundaryWrapper";

import { RoutesWrapper, type RoutesWrapperProps } from "../RoutesWrapper";

type AppWrapperProps = {
  children: React.ReactNode;
  basename?: string;
  switchAnalyticsDebug?: (debug: boolean) => void;
  queryClient?: QueryClient;
} & RoutesWrapperProps;

const { i18nInstance: kaizenI18nInstance } = instanciateAppI18n({
  applicationName: i18nNamespacePrefix,
  namespaces: i18nNamespaces,
  inMemoryTranslationsLoader: inMemoryTranslationsLoader,
  debug: process.env.NODE_ENV !== "production",
});

/**
 * Initialize sentry
 */
initializeStudioRuntimeFromStorage();
initSentry({
  integrations: [unleashIntegration({ featureFlagClientClass: UnleashClient })],
});

/**
 * A Wrapper to provide the features required to run an application.
 * This Wrapper should not be included in the federated application, as it wraps the host application.
 * The wrapper provides the following utilities :
 * - Routing system
 * - Theme provider for Kaizen
 * - Translations provider for Kaizen
 * - DevTools
 * - Authentication redirection
 * - Feature flags (Unleash)
 *
 * @param basename [Optional] Relative basename of the running application.
 * @param LoginApp [Optional] React application to be displayed on the login page. Default to DevLoginPage.
 * @param loginUrl [Optional] URL to redirect to when user is not authenticated. Default to `/login`.
 * @param NavigationApp [Optional] Lazy loading of the NavigationSidebar application.
 * @param navigationProps [Optional] Props to provide to the NavigationSidebar
 * @param queryClient [Optional] Custom query client to use in your application
 *
 * @description
 * ```tsx
 * const NavigationApp = lazy(() => import("sm-navigation-sidebar/NavigationSidebar"));
 * const basename = __YOUR_APP__.__BASENAME__;
 *
 * const queryClient = createAppQueryClient();
 *
 * const StandaloneApp = () => (
 *  <AppWrapper
 *    basename={basename}
 *    NavigationApp={NavigationApp}
 *    queryClient={queryClient}
 *  >
 *    <App />
 *  </AppWrapper>
 * );
 *
 * // Where App is the component exposed in your Federation configuration.
 * ```
 */
export const AppWrapper: React.FC<AppWrapperProps> = ({
  children,
  basename = "",
  queryClient,
  ...routesWrapperProps
}) => {
  return (
    <BrowserRouter basename={basename}>
      <QueryClientProvider client={queryClient ?? getDefaultQueryClient()}>
        <ThemeProvider>
          <KaizenI18nProvider kaizenI18nInstance={kaizenI18nInstance}>
            <FeatureFlagsProvider>
              <>
                <DevTools
                  i18nInstance={kaizenI18nInstance}
                  onLogoutCallback={
                    routesWrapperProps?.navigationProps?.onLogoutCallback
                  }
                />
                <ErrorBoundaryWrapper
                  appName="sm-backbone-background-task-host"
                  fallback={<p className="hidden" />}
                >
                  <BackgroundTaskHost />
                </ErrorBoundaryWrapper>

                <ReactQueryDevtools initialIsOpen={false} />
                <RoutesWrapper {...routesWrapperProps}>
                  {children}
                </RoutesWrapper>
              </>
            </FeatureFlagsProvider>
          </KaizenI18nProvider>
        </ThemeProvider>
      </QueryClientProvider>
    </BrowserRouter>
  );
};
