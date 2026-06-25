import { lazy, useEffect } from "react";
import { Navigate, Route, Routes, generatePath, useParams } from "react-router";

import {
  ABSOLUTE_ROUTES,
  LEGACY_URLS,
  URLS,
  flags,
  useBookingManagementFlag,
} from "#src/urls";

const CalendarPage = lazy(() => import("#src/pages/CalendarPage"));
const DetailsPage = lazy(() => import("#src/pages/details-page"));
const SeriesClassesPage = lazy(() => import("#src/pages/series-classes-page"));
const SeriesEditorPage = lazy(() => import("#src/pages/series-editor-page"));
const SessionOverviewPage = lazy(
  () => import("#src/pages/session-overview-page"),
);
const SessionAllOccurrencesPage = lazy(
  () => import("#src/pages/session-all-occurrences-page"),
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

const SeriesEditorPageRedirect = () => {
  const { seriesId } = useParams<{ seriesId: string }>();

  return (
    <Navigate
      to={generatePath(ABSOLUTE_ROUTES.SERIES_EDIT, {
        seriesId: seriesId ?? "",
      })}
      replace
    />
  );
};

export const AppRoutes = () => {
  const isSessionManagementRevampEnabled = useBookingManagementFlag(
    flags.BOOKINGS_MANAGEMENT_REVAMP,
  );
  const isCalendarSeriesTabEnabled = useBookingManagementFlag(
    flags.CALENDAR_SERIES_TAB,
  );

  return (
    <Routes>
      <Route element={<CalendarPage />} index />
      <Route
        element={
          <Navigate
            to={
              isCalendarSeriesTabEnabled
                ? ABSOLUTE_ROUTES.SERIES_LIST
                : ABSOLUTE_ROUTES.INDEX
            }
            replace
          />
        }
        path={URLS.SERIES_ROOT_SLUG}
      />
      <Route
        element={
          isCalendarSeriesTabEnabled ? (
            <SeriesEditorPageRedirect />
          ) : (
            <Navigate to={ABSOLUTE_ROUTES.INDEX} replace />
          )
        }
        path={URLS.SERIES_SLUG}
      />
      <Route
        element={
          isCalendarSeriesTabEnabled ? (
            <SeriesEditorPage />
          ) : (
            <Navigate to={ABSOLUTE_ROUTES.INDEX} replace />
          )
        }
        path={URLS.SERIES_EDIT_SLUG}
      />
      <Route
        element={
          isCalendarSeriesTabEnabled ? (
            <SeriesClassesPage />
          ) : (
            <Navigate to={ABSOLUTE_ROUTES.INDEX} replace />
          )
        }
        path={URLS.SERIES_CLASSES_SLUG}
      />
      <Route
        element={
          isSessionManagementRevampEnabled ? (
            <SessionOverviewPage />
          ) : (
            <LegacyOfferPageRedirect />
          )
        }
        path={URLS.BOOKINGS_MANAGEMENT_REVAMP}
      />
      <Route
        element={
          isSessionManagementRevampEnabled ? (
            <SessionAllOccurrencesPage />
          ) : (
            <LegacyOfferPageRedirect />
          )
        }
        path={URLS.ALL_OCCURRENCES_SLUG}
      />
      <Route element={<DetailsPage />} path={URLS.EDIT_SLUG} />
    </Routes>
  );
};
