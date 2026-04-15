import { lazy } from "react";
import { Navigate, Route, Routes } from "react-router";

import { URLS } from "#src/urls";

const CollectionsListPage = lazy(
  () => import("#src/pages/collections-list-page"),
);
const MediasListPage = lazy(() => import("#src/pages/medias-list-page"));

export const AppRoutes = () => {
  return (
    <Routes>
      <Route element={<CollectionsListPage />} path={URLS.COLLECTIONS} />
      <Route element={<MediasListPage />} path={URLS.MEDIAS} />

      {/** Default to collections */}
      <Route element={<Navigate to={URLS.COLLECTIONS} />} index />

      {/** Global fallback */}
      <Route element={<Navigate to={URLS.INDEX} />} path="*" />
    </Routes>
  );
};
