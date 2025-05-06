import { lazy } from "react";
import { Route, Routes } from "react-router";

import { URLS } from "#src/urls";

const ListPage = lazy(() => import("#src/pages/ListPage"));

export const AppRoutes = () => {
  return (
    <Routes>
      <Route element={<ListPage />} path={URLS.INDEX} />
    </Routes>
  );
};
