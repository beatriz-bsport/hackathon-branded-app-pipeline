import { lazy } from "react";
import { Route, Routes } from "react-router";

import { URLS } from "#src/urls";

const ListPage = lazy(() => import("#src/pages/ListPage"));
const DetailsPage = lazy(() => import("#src/pages/details-page"));

export const AppRoutes = () => {
  return (
    <Routes>
      <Route element={<ListPage />} index />
      <Route element={<DetailsPage />} path={URLS.DETAILS_SLUG} />
      <Route element={<DetailsPage />} path={URLS.EDIT_SLUG} />
    </Routes>
  );
};
