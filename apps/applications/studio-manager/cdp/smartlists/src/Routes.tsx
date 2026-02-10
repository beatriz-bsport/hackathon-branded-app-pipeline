import { lazy } from "react";
import { Route, Routes } from "react-router";

import { FeatureFlag } from "#src/components/FeatureFlag";
import { URLS } from "#src/urls";
import { flags } from "#src/utils/feature-flags";

const ListPage = lazy(() => import("#src/pages/ListPage"));
const DetailsPage = lazy(() => import("#src/pages/DetailsPage"));
const ParameterPage = lazy(() => import("#src/pages/ParameterPage"));
const CampaignPage = lazy(() => import("#src/pages/CampaignPage"));
const AutomationPage = lazy(() => import("#src/pages/AutomationPage"));
const AutomationMessagePage = lazy(
  () => import("#src/pages/AutomationMessagePage"),
);
const PopupCreationPage = lazy(() => import("#src/pages/PopupCreationPage"));
const PopupEditPage = lazy(() => import("#src/pages/PopupEditPage"));

export const AppRoutes = () => {
  return (
    <Routes>
      <Route element={<ListPage />} path={URLS.INDEX} />
      <Route
        path={URLS.AUTOMATION_MESSAGE}
        element={
          <FeatureFlag flag={flags.smartlist}>
            <AutomationMessagePage />
          </FeatureFlag>
        }
      />
      <Route
        path={URLS.DETAILS}
        element={
          <FeatureFlag flag={flags.smartlist}>
            <DetailsPage />
          </FeatureFlag>
        }
      >
        <Route path="parameter" element={<ParameterPage />} />
        <Route path="campaign" element={<CampaignPage />} />
        <Route path="automation" element={<AutomationPage />} />
      </Route>
      <Route
        path={URLS.POPUP_CREATION}
        element={
          <FeatureFlag flag={flags.smartlist}>
            <PopupCreationPage />
          </FeatureFlag>
        }
      />
      <Route
        path={URLS.POPUP_EDIT}
        element={
          <FeatureFlag flag={flags.smartlist}>
            <PopupEditPage />
          </FeatureFlag>
        }
      />
    </Routes>
  );
};
