import { lazy, Suspense } from "react";
import { Route } from "react-router";
import { RoutesWrapper } from "@bsport/b2b-backbone";
import GroupActivitiesList from "#src/pages/GroupActivitiesList/GroupActivitiesList";
import ArchivedGroupActivitiesList from "#src/pages/ArchivedGroupActivitiesList/ArchivedGroupActivitiesList";

import {
  ARCHIVED_GROUP_ACTIVITIES_PATH,
  GROUP_ACTIVITIES_PATH,
} from "#src/constants";

const Navigation = lazy(() => import("navigation-sidebar/App"));
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
      <Route
        index
        path={ARCHIVED_GROUP_ACTIVITIES_PATH}
        element={<ArchivedGroupActivitiesList />}
      />
      <Route
        index
        path={GROUP_ACTIVITIES_PATH}
        element={<GroupActivitiesList />}
      />
    </RoutesWrapper>
  );
};

export default AppRoutes;
