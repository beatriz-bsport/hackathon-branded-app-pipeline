import { lazy, Suspense } from "react";
import { Route } from "react-router";
import { RoutesWrapper } from "@bsport/b2b-backbone";

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
      <Route index />
      <Route path="list-example" />
    </RoutesWrapper>
  );
};

export default AppRoutes;
