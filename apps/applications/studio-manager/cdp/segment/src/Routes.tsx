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
  PREBUILT_CAMPAIGNS_TAB_PATH,
  PREBUILT_SEGMENT_TAB_PATH,
} from "./utils/constants";

const ListPage = lazy(() => import("#src/pages/ListPage"));
const TabbedIndexPage = lazy(() => import("#src/pages/tabbed-index-page"));
const DetailsPage = lazy(() => import("#src/pages/DetailsPage"));
const PrebuiltSegmentDetailPage = lazy(
  () => import("#src/pages/prebuilt-segment-detail"),
);
const PrebuiltSegmentPage = lazy(
  () => import("#src/pages/prebuilt-segment-detail/prebuilt-segment-page"),
);
const PrebuiltCampaignsPage = lazy(
  () => import("#src/pages/prebuilt-segment-detail/prebuilt-campaigns-page"),
);
const ParameterPage = lazy(() => import("#src/pages/ParameterPage"));
const CampaignPage = lazy(() => import("#src/pages/CampaignPage"));
const CampaignSentDetailPage = lazy(
  () => import("#src/pages/CampaignSentDetailPage"),
);
const CampaignScheduledDetailPage = lazy(
  () => import("#src/pages/CampaignScheduledDetailPage"),
);
const AutomationPage = lazy(() => import("#src/pages/AutomationPage"));
const AutomationTagRuleCreationPage = lazy(
  () => import("#src/pages/AutomationTagRuleCreationPage"),
);
const AutomationTagRuleEditPage = lazy(
  () => import("#src/pages/AutomationTagRuleEditPage"),
);

export const AppRoutes = () => {
  const renderCustomIndexPage = () => (
    <FeatureFlag flag={flags.prebuiltSegments} fallback={<ListPage />}>
      <TabbedIndexPage activeTab="custom" />
    </FeatureFlag>
  );

  const renderSmartlistDetailsRoutes = () => (
    <>
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
        <Route path={AUTOMATION_TAB_PATH} element={<AutomationPage />}>
          <Route
            path="tag-rule/new"
            element={<AutomationTagRuleCreationPage />}
          />
          <Route
            path="tag-rule/:tagRuleId/edit"
            element={<AutomationTagRuleEditPage />}
          />
        </Route>
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
    </>
  );

  return (
    <Routes>
      <Route
        element={
          <FeatureFlag flag={flags.prebuiltSegments} fallback={<ListPage />}>
            <Navigate to={SMARTLIST_APP_LINKS.prebuiltIndex()} replace />
          </FeatureFlag>
        }
        index
      />
      <Route
        path={SMARTLIST_ROUTE_PATTERNS.PREBUILT_INDEX}
        element={
          <FeatureFlag
            flag={flags.prebuiltSegments}
            fallback={<Navigate to={SMARTLIST_APP_LINKS.root()} replace />}
          >
            <TabbedIndexPage activeTab="prebuilt" />
          </FeatureFlag>
        }
      />
      <Route
        path={SMARTLIST_ROUTE_PATTERNS.PREBUILT_DETAILS}
        element={
          <FeatureFlag
            flag={flags.prebuiltSegments}
            fallback={<Navigate to={SMARTLIST_APP_LINKS.root()} replace />}
          >
            <PrebuiltSegmentDetailPage />
          </FeatureFlag>
        }
      >
        <Route
          index
          element={<Navigate to={PREBUILT_SEGMENT_TAB_PATH} replace />}
        />
        <Route
          path={PREBUILT_SEGMENT_TAB_PATH}
          element={<PrebuiltSegmentPage />}
        />
        <Route
          path={PREBUILT_CAMPAIGNS_TAB_PATH}
          element={<PrebuiltCampaignsPage />}
        />
      </Route>
      <Route path={SMARTLIST_ROUTE_PATTERNS.CUSTOM_INDEX}>
        <Route index element={renderCustomIndexPage()} />
        {renderSmartlistDetailsRoutes()}
      </Route>
      <Route element={<Navigate to={SMARTLIST_APP_LINKS.index()} />} path="*" />
    </Routes>
  );
};
