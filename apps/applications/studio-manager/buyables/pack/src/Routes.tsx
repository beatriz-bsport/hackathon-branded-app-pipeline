import { lazy } from "react";
import { Navigate, Route, Routes } from "react-router";

import { URLS } from "#src/urls";

const PackListPage = lazy(() => import("#src/pages/PackList"));
const PackDetailsPage = lazy(() => import("#src/pages/PackDetails"));

export const AppRoutes = () => {
  return (
    <Routes>
      <Route element={<PackListPage />} index />
      <Route element={<PackDetailsPage />} path={URLS.DETAILS_SLUG} />
      <Route element={<Navigate to={URLS.INDEX} />} path="*" />
    </Routes>
  );
};
