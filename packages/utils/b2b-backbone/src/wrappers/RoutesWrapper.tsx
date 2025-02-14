import React from "react";
import { Route, Routes } from "react-router";
import DevLoginPage from "#src/dev-utils/DevLoginPage";
import { AuthenticatedAppWrapper } from "./AuthenticatedAppWrapper";
import { LOGIN_URL } from "#src/auth/constants";

type RoutesWrapperProps = {
  children: React.ReactNode;
  isDevelopmentMode?: boolean;
  NavigationApp?: React.ReactNode;
};

/**
 * Wrapper for application Router.
 * Children should be one or several react-router Route.
 * In development mode, the wrapper handles the redirection to the login page
 * In deployment mode, this is handled by the Host page.
 */
const RoutesWrapper: React.FC<RoutesWrapperProps> = ({
  children,
  isDevelopmentMode,
  NavigationApp,
}) => {
  return (
    <Routes>
      {/* Grouped authenticated routes */}
      <Route
        path="/"
        element={
          <AuthenticatedAppWrapper
            isLocalDevelopment={isDevelopmentMode}
            NavigationApp={NavigationApp}
          />
        }
      >
        {children}
      </Route>
      {/* Unauthenticated routes */}
      {isDevelopmentMode && (
        <Route element={<DevLoginPage />} path={LOGIN_URL} />
      )}
    </Routes>
  );
};

export default RoutesWrapper;
