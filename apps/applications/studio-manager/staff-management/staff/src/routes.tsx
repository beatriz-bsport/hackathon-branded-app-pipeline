import { lazy } from "react";
import { Navigate, Route, Routes } from "react-router";

import { URLS } from "#src/urls";

const ListPage = lazy(() => import("#src/pages/staff-list-page"));
const RoleListPage = lazy(() => import("#src/pages/role-list-page"));

export const AppRoutes = () => {
  return (
    <Routes>
      <Route element={<ListPage />} index />
      <Route element={<RoleListPage />} path={URLS.ROLE} />
      <Route element={<Navigate to={URLS.INDEX} />} path="*" />
    </Routes>
  );
};
