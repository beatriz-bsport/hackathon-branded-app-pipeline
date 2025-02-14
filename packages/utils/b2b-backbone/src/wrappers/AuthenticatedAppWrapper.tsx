import React from "react";
import AuthWrapper from "#src/auth/AuthWrapper";
import { Outlet } from "react-router";

type AuthenticatedAppWrapperProps = {
  isLocalDevelopment?: boolean;
  NavigationApp?: React.ReactNode;
};

/**
 * A Wrapper provided to authenticated Routes.
 * In development mode, the Navigation Sidebar is added on the left.
 * In deployment mode, this is handled by the Host page.
 *
 * @param isLocalDevelopment Whether the build is in development mode
 * @param NavigationApp Navigation Sidebar to display on the left
 */
export const AuthenticatedAppWrapper: React.FC<
  AuthenticatedAppWrapperProps
> = ({ isLocalDevelopment, NavigationApp }) => {
  return (
    <AuthWrapper>
      {isLocalDevelopment && !!NavigationApp ? (
        <div className="flex">
          {NavigationApp}
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
