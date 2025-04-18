import React from "react";
import { Route, Routes } from "react-router";

import { LOGIN_URL } from "@bsport/store-auth";

import DevLoginPage from "#src/dev-utils/DevLoginPage";

import { AuthWrapper, type AuthWrapperProps } from "./AuthWrapper";

export type RoutesWrapperProps = {
  children: React.ReactNode;
  LoginApp?: React.ReactNode;
  loginUrl?: string;
} & Omit<AuthWrapperProps, "loginUrl">;

/**
 * Wrapper for application Router.
 * Children should be one or several react-router Route.
 *
 * @param LoginApp [Optional] React application to be displayed on the login page. Default to DevLoginPage.
 * @param loginUrl [Optional] URL to redirect to when user is not authenticated. Default to `/login`.
 * @param NavigationApp [Optional] Lazy loading of the NavigationSidebar application.
 */
export const RoutesWrapper: React.FC<RoutesWrapperProps> = ({
  children,
  LoginApp,
  loginUrl = LOGIN_URL,
  NavigationApp,
}) => {
  return (
    <Routes>
      <Route
        path="*"
        element={
          <AuthWrapper loginUrl={loginUrl} NavigationApp={NavigationApp} />
        }
      >
        <Route element={children} path="*" />
      </Route>
      <Route element={LoginApp ?? <DevLoginPage />} path={LOGIN_URL} />
    </Routes>
  );
};
