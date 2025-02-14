import { lazy, Suspense } from "react";
import { Route } from "react-router";
import { RoutesWrapper } from "@bsport/b2b-backbone";
import App from "#src/pages/Home";
import ListPage from "#src/pages/ListPage";

const Navigation = lazy(() => import("navigation-sidebar/Navigation"));
const IS_LOCAL_DEVELOPMENT = import.meta.env.DEV;

const AppRoutes = () => {
  return (
    <RoutesWrapper
      isDevelopmentMode={IS_LOCAL_DEVELOPMENT}
      NavigationApp={
        <Suspense>
          <Navigation />
        </Suspense>
      }
    >
      <Route element={<App />} index />
      <Route element={<ListPage />} path="list-example" />
    </RoutesWrapper>
  );
};

export default AppRoutes;
