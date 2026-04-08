import { lazy, useEffect } from "react";
import { Route, Routes, generatePath, useParams } from "react-router";

import { LEGACY_URLS, URLS, flags, useBookingManagementFlag } from "#src/urls";

const CalendarPage = lazy(() => import("#src/pages/CalendarPage"));
const DetailsPage = lazy(() => import("#src/pages/details-page"));
const SessionManagementPage = lazy(
  () => import("#src/pages/session-management-page"),
);

const LegacyOfferPageRedirect = () => {
  const { sessionId } = useParams<{ sessionId: string }>();
  useEffect(() => {
    if (sessionId) {
      window.location.assign(
        generatePath(LEGACY_URLS.BOOKINGS_MANAGEMENT_REVAMP, { sessionId }),
      );
    }
  }, [sessionId]);

  return null;
};

export const AppRoutes = () => {
  const isSessionManagementRevampEnabled = useBookingManagementFlag(
    flags.BOOKINGS_MANAGEMENT_REVAMP,
  );

  return (
    <Routes>
      <Route element={<CalendarPage />} index />
      <Route
        element={
          isSessionManagementRevampEnabled ? (
            <SessionManagementPage />
          ) : (
            <LegacyOfferPageRedirect />
          )
        }
        path={URLS.BOOKINGS_MANAGEMENT_REVAMP}
      />
      <Route element={<DetailsPage />} path={URLS.EDIT_SLUG} />
    </Routes>
  );
};
