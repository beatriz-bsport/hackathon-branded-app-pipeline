import { lazy } from "react";
import { Route, Routes } from "react-router";

import { URLS } from "#src/urls";

import { DetailsPage } from "./pages/details-page";

const ListPage = lazy(() => import("#src/pages/ListPage"));

export const AppRoutes = () => {
  return (
    <Routes>
      <Route element={<ListPage />} index />
      <Route element={<DetailsPage />} path={URLS.DETAILS_SLUG} />
    </Routes>
  );
};
