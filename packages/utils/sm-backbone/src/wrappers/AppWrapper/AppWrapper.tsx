import React from "react";
import { BrowserRouter } from "react-router";

import { instanciateAppI18n } from "@bsport/i18n";
import {
  KaizenI18nProvider,
  ThemeProvider,
  i18nNamespacePrefix,
  i18nNamespaces,
  inMemoryTranslationsLoader,
} from "@bsport/kaizen-primitive-core";
import { initSentry } from "@bsport/sentry";

import DevTools from "#src/dev-utils/DevTools";
import FeatureFlagsProvider from "#src/feature-flags/FeatureFlagsProvider";

import { RoutesWrapper, type RoutesWrapperProps } from "../RoutesWrapper";

type AppWrapperProps = {
  children: React.ReactNode;
  basename?: string;
  switchAnalyticsDebug?: (debug: boolean) => void;
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
initSentry();

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
 *
 * @description
 * ```tsx
 * const NavigationApp = lazy(() => import("sm-navigation-sidebar/NavigationSidebar"));
 * const basename = __YOUR_APP__.__BASENAME__;
 *
 * const StandaloneApp = () => (
 *  <AppWrapper
 *    basename={basename}
 *    NavigationApp={NavigationApp}
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
  ...routesWrapperProps
}) => {
  return (
    <BrowserRouter basename={basename}>
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
              <RoutesWrapper {...routesWrapperProps}>{children}</RoutesWrapper>
            </>
          </FeatureFlagsProvider>
        </KaizenI18nProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
};
