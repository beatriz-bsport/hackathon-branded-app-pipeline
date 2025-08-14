import { lazy } from "react";
import { Navigate, Route, Routes } from "react-router";

import { URLS } from "#src/urls";

const InsightsPage = lazy(() => import("#src/pages/InsightsPage"));
const TrialAnalysisPage = lazy(() => import("#src/pages/TrialAnalysisPage"));
const RecurringRevenuePage = lazy(
  () => import("#src/pages/RecurringRevenuePage"),
);

export const AppRoutes = () => {
  return (
    <Routes>
      <Route element={<InsightsPage />} index />
      <Route element={<TrialAnalysisPage />} path={URLS.TRIAL_ANALYSIS} />
      <Route element={<RecurringRevenuePage />} path={URLS.RECURRING_REVENUE} />
      <Route element={<Navigate to=".." />} path="*" />
    </Routes>
  );
};
