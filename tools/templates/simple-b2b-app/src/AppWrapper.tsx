import React, { lazy, ReactNode, Suspense } from "react";
import { Outlet } from "react-router";
import { ThemeProvider } from "@bsport/kaizen-primitive-core";
import DevTools from "#src/components/dev-tools/DevTools";
import { AuthWrapper } from "@bsport/b2b-backbone";

const Navigation = lazy(() => import("navigation-sidebar/Navigation"));

/**
 * A Wrapper to provide the features required for local development.
 * This should not be federated as it will be define on the Host Page.
 */
export const AppWrapper: React.FC<{ children: ReactNode }> = ({ children }) => {
  return (
    <ThemeProvider>
      <div className="bg-surface-page min-h-screen">
        <DevTools />
        {children}
      </div>
    </ThemeProvider>
  );
};

export const AuthenticatedAppWrapper: React.FC<{
  isLocalDevelopment: boolean;
}> = ({ isLocalDevelopment }) => {
  return (
    <AuthWrapper>
      {isLocalDevelopment ? (
        <div className="flex">
          <Suspense>
            <Navigation />
          </Suspense>
          {/** react-router will map Route.Element to Outlet
           * https://reactrouter.com/start/library/routing#nested-routes
           */}
          <Outlet />
        </div>
      ) : (
        <Outlet />
      )}
    </AuthWrapper>
  );
};
