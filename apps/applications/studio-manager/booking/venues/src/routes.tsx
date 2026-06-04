import { lazy, useEffect } from "react";
import { Navigate, Route, Routes, useParams } from "react-router";

import { ABSOLUTE_ROUTES, LEGACY_URLS, ROUTES } from "#src/urls";
import { flags, useFlag } from "#src/utils/feature-flags";

const ListPage = lazy(() => import("#src/pages/list-page"));
const ArchivedListPage = lazy(() => import("#src/pages/archived-list-page"));
const DetailPage = lazy(() => import("#src/pages/detail-page"));

const LegacyVenueDetailRedirect = () => {
  const { venueId } = useParams<{ venueId: string }>();

  useEffect(() => {
    if (venueId) {
      window.location.assign(LEGACY_URLS.DETAIL(Number(venueId)));
    }
  }, [venueId]);

  return null;
};

export const AppRoutes = () => {
  const detailsEnabled = useFlag(flags.venuesDetailsPage);

  return (
    <Routes>
      <Route element={<ListPage />} path={ROUTES.ACTIVE} />
      <Route element={<ArchivedListPage />} path={ROUTES.ARCHIVED} />
      <Route
        path={ROUTES.DETAIL}
        element={
          detailsEnabled ? <DetailPage /> : <LegacyVenueDetailRedirect />
        }
      />
      <Route
        path="*"
        element={<Navigate to={ABSOLUTE_ROUTES.ACTIVE} replace />}
      />
    </Routes>
  );
};
