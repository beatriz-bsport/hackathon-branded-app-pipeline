import { lazy } from "react";
import { Navigate, Route, Routes } from "react-router";

import { URLS } from "#src/urls";
import { useSmartlistFlag } from "#src/utils/feature-flags/use-smartlist-flag";

const ListPage = lazy(() => import("#src/pages/ListPage"));
const DetailsPage = lazy(() => import("#src/pages/DetailsPage"));
const ParameterPage = lazy(() => import("#src/pages/ParameterPage"));
const CampaignPage = lazy(() => import("#src/pages/CampaignPage"));
const AutomationPage = lazy(() => import("#src/pages/AutomationPage"));

const FeatureFlaggedDetailsRoute = () => {
  const isEnabled = useSmartlistFlag();

  if (!isEnabled) {
    return <Navigate to={URLS.INDEX} replace />;
  }

  return <DetailsPage />;
};

export const AppRoutes = () => {
  return (
    <Routes>
      <Route element={<ListPage />} path={URLS.INDEX} />
      <Route
        element={<FeatureFlaggedDetailsRoute />}
        path={`${URLS.DETAILS}/*`}
      >
        <Route path="parameter" element={<ParameterPage />} />
        <Route path="campaign" element={<CampaignPage />} />
        <Route path="automation" element={<AutomationPage />} />
      </Route>
    </Routes>
  );
};
