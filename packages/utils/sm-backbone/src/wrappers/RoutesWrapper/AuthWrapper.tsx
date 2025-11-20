import { type FC, type LazyExoticComponent, Suspense, useEffect } from "react";
import { Navigate, Outlet, useLocation } from "react-router";

import { setCurrencyCode, setCurrencyDisplay } from "@bsport/currency";
import { getAuthToken } from "@bsport/local-storage-auth-token";

import { fetchSharedData } from "#src/api";
import { SidebarLayout } from "#src/components/SidebarLayout";
import { dataAccessLayer } from "#src/data-access-layer";

type NavigationSidebarProps = {
  navigate?: (to: string) => void;
  disableRevampOnLegacyStore?: () => void;
  isLoadingData?: boolean;
  onLogoutCallback?: () => void;
};

export type AuthWrapperProps = {
  NavigationApp?: LazyExoticComponent<FC<NavigationSidebarProps>>;
  navigationProps?: NavigationSidebarProps;
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
 * @param navigationProps Props to provide to the NavigationSidebar
 */
export const AuthWrapper: FC<AuthWrapperProps> = ({
  NavigationApp,
  loginUrl,
  navigationProps = {},
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
    <div className="min-h-screen md:flex bg-surface-page text-onsurface-default">
      <Suspense
        fallback={
          <div className="h-screen w-layout-sidebar bg-surface-page-navigation" />
        }
      >
        {NavigationApp ? <NavigationApp {...navigationProps} /> : undefined}
      </Suspense>
      <DataLayerWrapper />
      {/** react-router will map Route.Element to Outlet
       * https://reactrouter.com/start/library/routing#nested-routes
       */}

      <SidebarLayout>
        <Outlet />
      </SidebarLayout>
    </div>
  );
};

function DataLayerWrapper() {
  const companyTheme = dataAccessLayer.useCompanyTheme();
  const companyCurrencyCode = companyTheme?.currency;
  const companyCurrencyDisplay = companyTheme?.currency_display;

  /**
   * here we fetch shared data
   */
  useEffect(() => {
    fetchSharedData();
  }, []);

  useEffect(() => {
    if (companyCurrencyCode) {
      setCurrencyCode(companyCurrencyCode, "local");
    }
    if (companyCurrencyDisplay) {
      setCurrencyDisplay(companyCurrencyDisplay, "local");
    }
  }, [companyCurrencyCode, companyCurrencyDisplay]);

  return null;
}
