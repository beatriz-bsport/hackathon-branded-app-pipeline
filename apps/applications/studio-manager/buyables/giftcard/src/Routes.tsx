import { lazy } from "react";
import { Route, Routes } from "react-router";

import { ROUTES } from "./pages/routes";

const GiftcardArchivedListPage = lazy(
  () => import("#src/pages/GiftcardArchivedList"),
);
const GiftcardListPage = lazy(() => import("#src/pages/GiftcardList"));

export const AppRoutes = () => {
  return (
    <Routes>
      <Route element={<GiftcardListPage />} path={ROUTES.ACTIVE} />
      <Route element={<GiftcardArchivedListPage />} path={ROUTES.ARCHIVED} />
    </Routes>
  );
};
