import { lazy } from "react";
import { Navigate, Route, Routes, useParams } from "react-router";

import { URLS } from "#src/urls";

const PackListPage = lazy(() => import("#src/pages/PackList"));
const PackDetailsPage = lazy(() => import("#src/pages/PackDetails"));
const PackOverviewPage = lazy(() => import("#src/pages/PackOverview"));

const RedirectToDetails = () => {
  const { id } = useParams();
  return <Navigate to={`${URLS.INDEX}/${id}`} replace />;
};

export const AppRoutes = () => {
  return (
    <Routes>
      <Route element={<PackListPage />} index />
      <Route element={<PackDetailsPage />} path={URLS.DETAILS_SLUG} />
      <Route element={<PackOverviewPage />} path={URLS.OVERVIEW_SLUG} />
      {/** Fallback to details page */}
      <Route element={<RedirectToDetails />} path={`${URLS.DETAILS_SLUG}/*`} />
      {/** Global fallback */}
      <Route element={<Navigate to={URLS.INDEX} />} path="*" />
    </Routes>
  );
};
