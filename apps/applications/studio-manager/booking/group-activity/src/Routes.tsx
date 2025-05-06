import { lazy } from "react";
import { Route, Routes } from "react-router";

import { ROUTES } from "#src/urls";

const GroupActivitiesList = lazy(
  () => import("#src/pages/GroupActivitiesList"),
);
const ArchivedGroupActivitiesList = lazy(
  () => import("#src/pages/ArchivedGroupActivitiesList"),
);

const AppRoutes = () => {
  return (
    <Routes>
      <Route index element={<ArchivedGroupActivitiesList />} />
      <Route path={ROUTES.ARCHIVED} element={<GroupActivitiesList />} />
    </Routes>
  );
};

export default AppRoutes;
