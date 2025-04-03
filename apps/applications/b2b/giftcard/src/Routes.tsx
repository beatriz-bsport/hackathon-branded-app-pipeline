import { lazy } from "react";
import { Route } from "react-router";

import { RoutesWrapper } from "@bsport/b2b-backbone";

import { GiftcardArchivedListPage } from "#src/pages/GiftcardArchivedList";
import { GiftcardListPage } from "#src/pages/GiftcardList";

const NavigationSidebar = lazy(() => import("sm-navigation-sidebar/App"));

const IS_LOCAL_DEVELOPMENT = import.meta.env.DEV;

const AppRoutes = () => {
  return (
    <RoutesWrapper
      isStandalone={IS_LOCAL_DEVELOPMENT}
      NavigationApp={NavigationSidebar}
      baseUrl=""
    >
      <Route element={<GiftcardListPage />} index />
      <Route element={<GiftcardArchivedListPage />} path="archived" />
    </RoutesWrapper>
  );
};

export default AppRoutes;
