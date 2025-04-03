import { lazy } from "react";
import { Route } from "react-router";

import { RoutesWrapper } from "@bsport/b2b-backbone";

import {
  ARCHIVED_GROUP_ACTIVITIES_PATH,
  GROUP_ACTIVITIES_PATH,
} from "#src/constants";
import ArchivedGroupActivitiesList from "#src/pages/ArchivedGroupActivitiesList/ArchivedGroupActivitiesList";
import GroupActivitiesList from "#src/pages/GroupActivitiesList/GroupActivitiesList";

const NavigationSidebar = lazy(() => import("sm-navigation-sidebar/App"));
const IS_LOCAL_DEVELOPMENT = import.meta.env.DEV;

const AppRoutes = () => {
  return (
    <RoutesWrapper
      isStandalone={IS_LOCAL_DEVELOPMENT}
      NavigationApp={NavigationSidebar}
      baseUrl=""
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
