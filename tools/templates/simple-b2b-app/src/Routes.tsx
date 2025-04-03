import { lazy } from "react";
import { Route } from "react-router";

import { RoutesWrapper } from "@bsport/b2b-backbone";

import App from "#src/pages/Home";
import ListPage from "#src/pages/ListPage";

const NavigationSidebar = lazy(() => import("sm-navigation-sidebar/App"));

const IS_LOCAL_DEVELOPMENT = import.meta.env.DEV;

const AppRoutes = () => {
  return (
    <RoutesWrapper
      isStandalone={IS_LOCAL_DEVELOPMENT}
      NavigationApp={NavigationSidebar}
      baseUrl=""
    >
      <Route element={<App />} index />
      <Route element={<ListPage />} path="list-example" />
    </RoutesWrapper>
  );
};

export default AppRoutes;
