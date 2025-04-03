import React from "react";
import { BrowserRouter, Route, Routes } from "react-router";

import { LOGIN_URL } from "@bsport/store-auth";

import DevLoginPage from "#src/dev-utils/DevLoginPage";

import { AuthWrapper, type AuthWrapperProps } from "./AuthWrapper";

type RoutesWrapperProps = {
  baseUrl: string;
  children: React.ReactNode;
  isStandalone?: boolean;
  LoginApp?: React.ReactNode;
  loginUrl?: string;
} & Omit<AuthWrapperProps, "loginUrl">;

/**
 * Wrapper for application Router.
 * Children should be one or several react-router Route.
 * In standalone mode, the wrapper handles the authentication.
 *
 * @param baseUrl Base URL of the running application
 * @param isStandalone Whether the application consuming the Wrapper is run in standalone
 * @param LoginApp React application to be displayed in place of the Login Page
 * @param LoginUrl
 * @param NavigationApp Lazy loading of the NavigationSidebar application
 *
 * @description
 * Use cases :
 * - you are running locally an application => isStandalone=`true`
 * - you are running or building an host app => isStandalone=`true` (you can provide the `LoginApp` as well)
 * - you are federating an application into an host app => isStandalone=`false`
 */
export const RoutesWrapper: React.FC<RoutesWrapperProps> = ({
  baseUrl,
  children,
  isStandalone,
  LoginApp,
  loginUrl = LOGIN_URL,
  NavigationApp,
}) => {
  // Retrieve the relative URL path
  const urlPath = baseUrl.startsWith("/")
    ? // baseUrl is already a relative pathname
      baseUrl
    : //  Get the `pathname` from the URL and remove any trailing slashes
      new URL(baseUrl).pathname.replace(/\/+$/, "");

  return (
    <BrowserRouter basename={urlPath}>
      <Routes>
        {isStandalone ? (
          <>
            <Route
              path="/"
              element={
                <AuthWrapper
                  loginUrl={loginUrl}
                  NavigationApp={NavigationApp}
                />
              }
            >
              <Route element={children} path="/*" />
            </Route>
            <Route element={LoginApp ?? <DevLoginPage />} path={LOGIN_URL} />
          </>
        ) : (
          <Route element={children} path="/*" />
        )}
      </Routes>
    </BrowserRouter>
  );
};
