import { lazy } from "react";
import { Navigate, Route, Routes } from "react-router";

import { ROUTES } from "#src/urls";

const ListPage = lazy(() => import("./pages/classes-list"));
const ArchivedListPage = lazy(() => import("./pages/archived-classes-list"));
const ClassDetailPage = lazy(() => import("./pages/class-detail"));

export const AppRoutes = () => {
  return (
    <Routes>
      <Route element={<Navigate to={ROUTES.ACTIVE} replace />} path="/" />
      <Route element={<ListPage />} path={ROUTES.ACTIVE} />
      <Route element={<ArchivedListPage />} path={ROUTES.ARCHIVED} />
      <Route element={<ClassDetailPage />} path={ROUTES.DETAIL} />
      <Route element={<ClassDetailPage />} path={ROUTES.ARCHIVED_DETAIL} />
      <Route element={<Navigate to={ROUTES.ACTIVE} replace />} path="*" />
    </Routes>
  );
};
