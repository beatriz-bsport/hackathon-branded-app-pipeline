import { type FC, type LazyExoticComponent, Suspense, useEffect } from "react";
import { Navigate, Outlet, useLocation } from "react-router";

import { getAuthToken } from "@bsport/local-storage-auth-token";

import { fetchSharedData } from "#src/api";

export type AuthWrapperProps = {
  NavigationApp?: LazyExoticComponent<FC>;
  loginUrl: string;
};

/**
 * Check authentication.
 * If authenticated, render the Layout with
 * -> Navigation sidebar on the left
 * -> the application via the Outlet component
 * If not authenticated, navigate to the Login page
 *
 * @param NavigationApp Navigation Sidebar to display on the left
 * @param loginUrl URL path to the login page
 */
export const AuthWrapper: FC<AuthWrapperProps> = ({
  NavigationApp,
  loginUrl,
}) => {
  const location = useLocation();

  const token = getAuthToken();

  // Check authentication
  if (!token) {
    // Check if loginUrl is absolute (contains protocol) or relative
    const isAbsoluteUrl = /^https?:\/\//.test(loginUrl);

    if (isAbsoluteUrl) {
      // For absolute URLs, use window.location.replace for proper redirect
      window.location.replace(loginUrl);
      // Return null to prevent rendering while redirect happens
      return null;
    } else {
      // For relative URLs, use React Router Navigate
      return <Navigate to={loginUrl} state={{ from: location }} replace />;
    }
  }

  return (
    <div className="flex">
      <Suspense
        fallback={
          <div className="h-screen w-[240px] bg-surface-page-navigation" />
        }
      >
        {NavigationApp ? <NavigationApp /> : undefined}
      </Suspense>
      <DataLayerWrapper />
      {/** react-router will map Route.Element to Outlet
       * https://reactrouter.com/start/library/routing#nested-routes
       */}
      <Outlet />
    </div>
  );
};

function DataLayerWrapper() {
  /**
   * here we fetch shared data
   */
  useEffect(() => {
    fetchSharedData();
  }, []);

  return null;
}
