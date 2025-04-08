import { Route, Routes } from "react-router";

// TODO: wait for b2b-backbone to be fixed
// import { RoutesWrapper } from "@bsport/b2b-backbone";

import {
  ARCHIVED_GROUP_ACTIVITIES_PATH,
  GROUP_ACTIVITIES_PATH,
} from "#src/constants";
import ArchivedGroupActivitiesList from "#src/pages/ArchivedGroupActivitiesList/ArchivedGroupActivitiesList";
import GroupActivitiesList from "#src/pages/GroupActivitiesList/GroupActivitiesList";

const AppRoutes = () => {
  return (
    <Routes>
      <Route
        path={ARCHIVED_GROUP_ACTIVITIES_PATH}
        element={<ArchivedGroupActivitiesList />}
      />
      <Route path={GROUP_ACTIVITIES_PATH} element={<GroupActivitiesList />} />
    </Routes>
  );
};

export default AppRoutes;
