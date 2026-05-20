import { Suspense, lazy } from "react";
import { Navigate, Route, Routes } from "react-router";

import { URLS } from "#src/urls";

const RoleDetailsPage = lazy(() => import("#src/pages/role-details-page"));
const RoleListPage = lazy(() => import("#src/pages/role-list-page"));
const StaffListPage = lazy(() => import("#src/pages/staff-list-page"));
const StaffDetailsPageEntry = lazy(
  () => import("#src/pages/staff-details-page/staff-details-page-entry"),
);

export const AppRoutes = () => {
  return (
    <Suspense>
      <Routes>
        <Route element={<StaffListPage />} path={URLS.STAFF} />
        <Route
          element={<StaffDetailsPageEntry />}
          path={URLS.STAFF_DETAILS_SLUG}
        />
        <Route element={<RoleListPage />} path={URLS.ROLE} />
        <Route element={<RoleDetailsPage />} path={URLS.ROLE_DETAILS_SLUG} />

        {/** Default to staff */}
        <Route element={<Navigate to={URLS.STAFF} />} index />

        {/** Global fallback */}
        <Route element={<Navigate to={URLS.INDEX} />} path="*" />
      </Routes>
    </Suspense>
  );
};
