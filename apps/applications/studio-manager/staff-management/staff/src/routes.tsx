import { lazy } from "react";
import { Navigate, Route, Routes } from "react-router";

import { URLS } from "#src/urls";

const ListPage = lazy(() => import("#src/pages/list-page"));

export const AppRoutes = () => {
  return (
    <Routes>
      <Route element={<ListPage />} index />
      <Route element={<Navigate to={URLS.INDEX} />} path="*" />
    </Routes>
  );
};
