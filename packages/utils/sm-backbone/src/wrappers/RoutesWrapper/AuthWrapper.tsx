import { type FC, type LazyExoticComponent, Suspense } from "react";
import { Navigate, Outlet, useLocation } from "react-router";

import { getAuthToken } from "@bsport/local-storage-auth-token";

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
    return <Navigate to={loginUrl} state={{ from: location }} replace />;
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
      {/** react-router will map Route.Element to Outlet
       * https://reactrouter.com/start/library/routing#nested-routes
       */}
      <Outlet />
    </div>
  );
};
