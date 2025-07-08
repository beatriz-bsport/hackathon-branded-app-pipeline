import { lazy } from "react";
import { Navigate, Route, Routes } from "react-router";

import { ROUTES } from "#src/urls";

const GiftcardArchivedListPage = lazy(
  () => import("#src/pages/GiftcardArchivedList"),
);
const GiftcardListPage = lazy(() => import("#src/pages/GiftcardList"));

export const AppRoutes = () => {
  return (
    <Routes>
      <Route element={<GiftcardListPage />} index />
      <Route element={<GiftcardArchivedListPage />} path={ROUTES.ARCHIVED} />
      <Route element={<Navigate to={ROUTES.ACTIVE} />} path="*" />
    </Routes>
  );
};
