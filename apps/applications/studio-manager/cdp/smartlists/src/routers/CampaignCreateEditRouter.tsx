import { lazy, useMemo } from "react";
import { Navigate, Route, Routes, useParams } from "react-router";

import { FeatureFlag } from "#src/components/FeatureFlag";
import { useUpsellChecker } from "#src/hooks/use-upsell-checker";
import {
  CAMPAIGN_CHANNELS,
  CAMPAIGN_CHANNEL_EMAIL,
  CAMPAIGN_CHANNEL_POPUP,
  CAMPAIGN_CHANNEL_PUSH,
  type CampaignChannel,
  SMARTLIST_APP_LINKS,
  SMARTLIST_ROUTE_PATTERNS,
} from "#src/urls";
import { flags } from "#src/utils/feature-flags";

const CreateEmailCampaignPage = lazy(
  () => import("#src/pages/EmailCampaign/CreateEmailCampaign"),
);
const CreatePopupCampaignPage = lazy(
  () => import("#src/pages/PopupCreationPage"),
);
const CreatePushCampaignPage = lazy(
  () => import("#src/pages/push-campaign/create-push-campaign"),
);
const EditPopupCampaignPage = lazy(() => import("#src/pages/PopupEditPage"));

function isValidChannel(channel: string): channel is CampaignChannel {
  return (CAMPAIGN_CHANNELS as readonly string[]).includes(channel);
}

/**
 * Resolves to the parent campaign segment (e.g. /:id/campaign) so we can
 * redirect there when channel is invalid or no route matches.
 */
function useCampaignBasePath(): string {
  const { id } = useParams<{ id: string }>();
  return id ? SMARTLIST_APP_LINKS.campaign(id) : SMARTLIST_APP_LINKS.index();
}

function CreateRouteByChannel() {
  const { channel } = useParams<{ channel: string }>();
  const basePath = useCampaignBasePath();
  const { hasPushNotificationUpsell, hasPopupUpsell } = useUpsellChecker();

  const element = useMemo(() => {
    switch (channel) {
      case CAMPAIGN_CHANNEL_EMAIL:
        return <CreateEmailCampaignPage />;
      case CAMPAIGN_CHANNEL_POPUP:
        if (!hasPopupUpsell) {
          return <Navigate to={basePath} replace />;
        }
        return <CreatePopupCampaignPage />;
      case CAMPAIGN_CHANNEL_PUSH:
        if (!hasPushNotificationUpsell) {
          return <Navigate to={basePath} replace />;
        }
        return <CreatePushCampaignPage />;
      default:
        return <Navigate to={basePath} replace />;
    }
  }, [channel, basePath, hasPushNotificationUpsell, hasPopupUpsell]);

  if (!channel || !isValidChannel(channel)) {
    return <Navigate to={basePath} replace />;
  }

  return <FeatureFlag flag={flags.smartlist}>{element}</FeatureFlag>;
}

function EditRouteByChannel() {
  const { channel, entityId } = useParams<{
    channel: string;
    entityId: string;
  }>();
  const basePath = useCampaignBasePath();

  const element = useMemo(() => {
    switch (channel) {
      case CAMPAIGN_CHANNEL_POPUP:
        return <EditPopupCampaignPage />;
      default:
        return <Navigate to={basePath} replace />;
    }
  }, [channel, basePath]);

  if (!channel || !entityId || !isValidChannel(channel)) {
    return <Navigate to={basePath} replace />;
  }

  return <FeatureFlag flag={flags.smartlist}>{element}</FeatureFlag>;
}

/**
 * Sub-router for campaign create/edit. Mount at /:id/campaign/*.
 * Handles:
 *   - create/:channel  → create flow (email, popup, …)
 *   - :channel/:entityId/edit → edit flow (popup, …)
 */
export function CampaignCreateEditRouter() {
  return (
    <Routes>
      <Route
        path={SMARTLIST_ROUTE_PATTERNS.COMMUNICATION_CREATE}
        element={<CreateRouteByChannel />}
      />
      <Route
        path={SMARTLIST_ROUTE_PATTERNS.COMMUNICATION_EDIT}
        element={<EditRouteByChannel />}
      />
      <Route path="*" element={<Navigate to={".."} replace />} />
    </Routes>
  );
}
