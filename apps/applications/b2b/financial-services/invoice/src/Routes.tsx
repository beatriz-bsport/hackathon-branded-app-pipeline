import { lazy } from "react";
import { Route } from "react-router";

import { RoutesWrapper } from "@bsport/b2b-backbone";

import { InvoiceListPage } from "#src/pages/InvoiceLisPage";

const NavigationSidebar = lazy(() => import("sm-navigation-sidebar/App"));

const IS_LOCAL_DEVELOPMENT = import.meta.env.DEV;

const AppRoutes = () => {
  return (
    <RoutesWrapper
      isStandalone={IS_LOCAL_DEVELOPMENT}
      NavigationApp={NavigationSidebar}
      baseUrl=""
    >
      <Route element={<InvoiceListPage />} index />
    </RoutesWrapper>
  );
};

export default AppRoutes;
