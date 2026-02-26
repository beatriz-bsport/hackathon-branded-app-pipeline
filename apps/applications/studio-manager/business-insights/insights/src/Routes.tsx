import { lazy } from "react";
import { Navigate, Route, Routes } from "react-router";

import { URLS } from "#src/urls";

const InsightsPage = lazy(() => import("#src/pages/InsightsPage"));
const TrialAnalysisPage = lazy(() => import("#src/pages/TrialAnalysisPage"));
const CommunityHealthPage = lazy(
  () => import("#src/pages/CommunityHealthPage"),
);
const RecurringRevenuePage = lazy(
  () => import("#src/pages/RecurringRevenuePage"),
);
const BookingsInsightPage = lazy(
  () => import("#src/pages/BookingsInsightPage"),
);
const ScheduleAnalysisPage = lazy(
  () => import("#src/pages/ScheduleAnalysisPage"),
);

export const AppRoutes = () => {
  return (
    <Routes>
      <Route element={<InsightsPage />} index />
      <Route element={<TrialAnalysisPage />} path={URLS.TRIAL_ANALYSIS} />
      <Route element={<CommunityHealthPage />} path={URLS.COMMUNITY_HEALTH} />
      <Route element={<RecurringRevenuePage />} path={URLS.RECURRING_REVENUE} />
      <Route element={<BookingsInsightPage />} path={URLS.BOOKING_INSIGHT} />
      <Route element={<ScheduleAnalysisPage />} path={URLS.SCHEDULE_ANALYSIS} />
      <Route element={<Navigate to=".." />} path="*" />
    </Routes>
  );
};
