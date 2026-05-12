import { lazy } from "react";
import { Navigate, Route, Routes } from "react-router";

import { ABSOLUTE_ROUTES, ROUTES } from "#src/urls";
import { ClassFlags, useClassFlag } from "#src/utils/featureFlags";

const ListPage = lazy(() => import("./pages/classes-list"));
const ArchivedListPage = lazy(() => import("./pages/archived-classes-list"));
const ClassDetailPage = lazy(() => import("./pages/class-detail"));

export const AppRoutes = () => {
  const detailEnabled = useClassFlag(ClassFlags.CLASSES_DETAIL_PAGE);

  return (
    <Routes>
      <Route
        element={<Navigate to={ABSOLUTE_ROUTES.ACTIVE} replace />}
        path="/"
      />
      <Route element={<ListPage />} path={ROUTES.ACTIVE} />
      <Route element={<ArchivedListPage />} path={ROUTES.ARCHIVED} />
      {detailEnabled && (
        <>
          <Route element={<ClassDetailPage />} path={ROUTES.DETAIL} />
          <Route element={<ClassDetailPage />} path={ROUTES.ARCHIVED_DETAIL} />
        </>
      )}
      <Route
        element={<Navigate to={ABSOLUTE_ROUTES.ACTIVE} replace />}
        path="*"
      />
    </Routes>
  );
};
