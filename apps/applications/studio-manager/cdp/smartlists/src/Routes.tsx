import { lazy } from "react";
import { Navigate, Route, Routes } from "react-router";

import { FeatureFlag } from "#src/components/FeatureFlag";
import { CampaignCreateEditRouter } from "#src/routers/CampaignCreateEditRouter";
import { SMARTLIST_APP_LINKS, SMARTLIST_ROUTE_PATTERNS } from "#src/urls";
import { flags } from "#src/utils/feature-flags";

import { AutomationCreateEditRouter } from "./routers/AutomationCreateEditRouter";
import {
  AUTOMATION_TAB_PATH,
  CAMPAIGN_TAB_PATH,
  PARAMETER_TAB_PATH,
} from "./utils/constants";

const ListPage = lazy(() => import("#src/pages/ListPage"));
const DetailsPage = lazy(() => import("#src/pages/DetailsPage"));
const ParameterPage = lazy(() => import("#src/pages/ParameterPage"));
const CampaignPage = lazy(() => import("#src/pages/CampaignPage"));
const CampaignSentDetailPage = lazy(
  () => import("#src/pages/CampaignSentDetailPage"),
);
const CampaignScheduledDetailPage = lazy(
  () => import("#src/pages/CampaignScheduledDetailPage"),
);
const AutomationPage = lazy(() => import("#src/pages/AutomationPage"));

export const AppRoutes = () => {
  return (
    <Routes>
      <Route element={<ListPage />} index />
      <Route
        path={SMARTLIST_ROUTE_PATTERNS.CAMPAIGN_SENT_DETAILS}
        element={
          <FeatureFlag flag={flags.smartlist}>
            <CampaignSentDetailPage />
          </FeatureFlag>
        }
      />
      <Route
        path={SMARTLIST_ROUTE_PATTERNS.CAMPAIGN_SCHEDULED_DETAILS}
        element={
          <FeatureFlag flag={flags.smartlist}>
            <CampaignScheduledDetailPage />
          </FeatureFlag>
        }
      />

      <Route
        path={SMARTLIST_ROUTE_PATTERNS.DETAILS}
        element={
          <FeatureFlag flag={flags.smartlist}>
            <DetailsPage />
          </FeatureFlag>
        }
      >
        <Route path={PARAMETER_TAB_PATH} element={<ParameterPage />} />
        <Route path={CAMPAIGN_TAB_PATH} element={<CampaignPage />} />
        <Route path={AUTOMATION_TAB_PATH} element={<AutomationPage />} />
      </Route>
      {/* Campaign create/edit: single sub-router for all channels */}
      <Route
        path={`${SMARTLIST_ROUTE_PATTERNS.CAMPAIGN}/*`}
        element={
          <FeatureFlag flag={flags.smartlist}>
            <CampaignCreateEditRouter />
          </FeatureFlag>
        }
      />
      <Route
        path={`${SMARTLIST_ROUTE_PATTERNS.AUTOMATION_MESSAGES}/*`}
        element={
          <FeatureFlag flag={flags.smartlist}>
            <AutomationCreateEditRouter />
          </FeatureFlag>
        }
      />

      <Route element={<Navigate to={SMARTLIST_APP_LINKS.index()} />} path="*" />
    </Routes>
  );
};
