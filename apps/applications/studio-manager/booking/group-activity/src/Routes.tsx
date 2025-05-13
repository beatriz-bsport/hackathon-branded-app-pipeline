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
      <Route index element={<GroupActivitiesList />} />
      <Route path={ROUTES.ARCHIVED} element={<ArchivedGroupActivitiesList />} />
    </Routes>
  );
};

export default AppRoutes;
