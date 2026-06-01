import { lazy } from "react";
import { Navigate, Route, Routes } from "react-router";

import { INSIGHT_REGISTRY } from "#src/constants";
import { InsightPage } from "#src/pages/insight-page";
import type { InsightId } from "#src/utils/access";

const InsightsPage = lazy(() => import("#src/pages/insights-list-page"));

export const AppRoutes = () => {
  return (
    <Routes>
      <Route element={<InsightsPage />} index />
      {INSIGHT_REGISTRY.map(({ id, dashboardType, link, titleKey }) => (
        <Route
          key={id}
          path={link}
          element={
            <InsightPage
              id={id as InsightId}
              dashboardType={dashboardType}
              titleKey={titleKey}
            />
          }
        />
      ))}
      <Route element={<Navigate to=".." />} path="*" />
    </Routes>
  );
};
