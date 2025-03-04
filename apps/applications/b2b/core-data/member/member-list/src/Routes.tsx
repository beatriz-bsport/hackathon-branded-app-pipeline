import { lazy, Suspense } from "react";
import { Route } from "react-router";
import { RoutesWrapper } from "@bsport/b2b-backbone";
import { MemberListPage } from "#src/pages/MemberListPage";

const NavigationSidebar = lazy(() => import("navigation-sidebar/App"));

const IS_LOCAL_DEVELOPMENT = import.meta.env.DEV;

const AppRoutes = () => {
  return (
    <RoutesWrapper
      isDevelopmentMode={IS_LOCAL_DEVELOPMENT}
      NavigationApp={
        <Suspense
          fallback={
            <div className="h-screen w-[240px] bg-surface-page-navigation" />
          }
        >
          <NavigationSidebar />
        </Suspense>
      }
    >
      <Route element={<MemberListPage />} index />
    </RoutesWrapper>
  );
};

export default AppRoutes;
