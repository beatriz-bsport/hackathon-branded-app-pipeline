import { lazy, Suspense } from "react";
import { Route } from "react-router";
import { RoutesWrapper } from "@bsport/b2b-backbone";
import GroupActivitiesList from "#src/pages/GroupActivitiesList/GroupActivitiesList";
import {
  ARCHIVED_GROUP_ACTIVITIES_PATH,
  GROUP_ACTIVITIES_PATH,
} from "#src/constants";

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
      <Route path={ARCHIVED_GROUP_ACTIVITIES_PATH} />
      <Route element={<GroupActivitiesList />} path={GROUP_ACTIVITIES_PATH} />
    </RoutesWrapper>
  );
};

export default AppRoutes;
