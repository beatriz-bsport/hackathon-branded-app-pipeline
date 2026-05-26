import { lazy } from "react";
import { Navigate, Route, Routes } from "react-router";

import { ABSOLUTE_ROUTES, ROUTES } from "#src/urls";

const ListPage = lazy(() => import("#src/pages/list-page"));
const ArchivedListPage = lazy(() => import("#src/pages/archived-list-page"));

export const AppRoutes = () => {
  return (
    <Routes>
      <Route element={<ListPage />} path={ROUTES.ACTIVE} />
      <Route element={<ArchivedListPage />} path={ROUTES.ARCHIVED} />
      <Route
        path="*"
        element={<Navigate to={ABSOLUTE_ROUTES.ACTIVE} replace />}
      />
    </Routes>
  );
};
