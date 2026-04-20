import { lazy } from "react";
import { Navigate, Route, Routes } from "react-router";

import { URLS } from "#src/urls";

const CollectionsListPage = lazy(
  () => import("#src/pages/collections-list-page"),
);
const CollectionDetailsPage = lazy(
  () => import("#src/pages/collection-details-page"),
);
const MediasListPage = lazy(() => import("#src/pages/medias-list-page"));

export const AppRoutes = () => {
  return (
    <Routes>
      <Route element={<CollectionsListPage />} path={URLS.COLLECTION} />
      <Route
        element={<CollectionDetailsPage />}
        path={URLS.COLLECTION_DETAILS_SLUG}
      />
      <Route element={<MediasListPage />} path={URLS.MEDIA} />

      {/** Default to collections */}
      <Route element={<Navigate to={URLS.COLLECTION} />} index />

      {/** Global fallback */}
      <Route element={<Navigate to={URLS.INDEX} />} path="*" />
    </Routes>
  );
};
