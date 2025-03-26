import { lazy, Suspense } from "react";
import { Route } from "react-router";
import { RoutesWrapper } from "@bsport/b2b-backbone";
import { GiftcardListPage } from "#src/pages/GiftcardList";
import { GiftcardArchivedListPage } from "#src/pages/GiftcardArchivedList";

const NavigationSidebar = lazy(() => import("sm-navigation-sidebar/App"));

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
      <Route element={<GiftcardListPage />} index />
      <Route element={<GiftcardArchivedListPage />} path="archived" />
    </RoutesWrapper>
  );
};

export default AppRoutes;
