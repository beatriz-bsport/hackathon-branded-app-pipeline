import { Suspense, lazy } from "react";
import { Navigate, Route, Routes } from "react-router";

import { URLS } from "#src/urls";

const CollectionsListPage = lazy(
  () => import("#src/pages/collections-list-page"),
);
const CollectionDetailsPage = lazy(
  () => import("#src/pages/collection-details"),
);
const MediaListPage = lazy(() => import("#src/pages/media-list-page"));

export const AppRoutes = () => {
  return (
    <Suspense>
      <Routes>
        <Route element={<CollectionsListPage />} path={URLS.COLLECTION} />
        <Route
          element={<CollectionDetailsPage />}
          path={URLS.COLLECTION_DETAILS_SLUG}
        />
        <Route element={<MediaListPage />} path={URLS.MEDIA} />

        {/** Default to collections */}
        <Route element={<Navigate to={URLS.COLLECTION} />} index />

        {/** Global fallback */}
        <Route element={<Navigate to={URLS.INDEX} />} path="*" />
      </Routes>
    </Suspense>
  );
};
