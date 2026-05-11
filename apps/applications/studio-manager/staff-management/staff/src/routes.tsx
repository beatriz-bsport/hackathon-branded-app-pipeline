import { lazy } from "react";
import { Navigate, Route, Routes } from "react-router";

import { URLS } from "#src/urls";

const StaffListPage = lazy(() => import("#src/pages/staff-list-page"));
const RoleListPage = lazy(() => import("#src/pages/role-list-page"));
const StaffDetailsPageEntry = lazy(
  () => import("#src/pages/staff-details-page/staff-details-page-entry"),
);

export const AppRoutes = () => {
  return (
    <Routes>
      <Route element={<StaffListPage />} index />
      <Route element={<RoleListPage />} path={URLS.ROLE_LIST} />
      <Route element={<StaffDetailsPageEntry />} path={URLS.DETAILS_SLUG} />
      <Route element={<Navigate to={URLS.INDEX} />} path="*" />
    </Routes>
  );
};
