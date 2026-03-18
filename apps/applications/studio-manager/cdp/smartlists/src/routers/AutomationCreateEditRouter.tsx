import { lazy, useMemo } from "react";
import { Navigate, Route, Routes, useParams } from "react-router";

import { FeatureFlag } from "#src/components/FeatureFlag";
import {
  CAMPAIGN_CHANNEL_PUSH,
  type CampaignChannel,
  SMARTLIST_APP_LINKS,
  SMARTLIST_ROUTE_PATTERNS,
} from "#src/urls";
import { flags } from "#src/utils/feature-flags";

const AutomationPushCreationPage = lazy(
  () => import("#src/pages/AutomationPushCreationPage"),
);

function isValidAutomationChannel(channel: string): channel is CampaignChannel {
  return channel === CAMPAIGN_CHANNEL_PUSH;
}

/**
 * Resolves to the parent automation segment (e.g. /:id/automation) so we can
 * redirect there when channel is invalid or no route matches.
 */
function useAutomationBasePath(): string {
  const { id } = useParams<{ id: string }>();
  return id ? SMARTLIST_APP_LINKS.automation(id) : SMARTLIST_APP_LINKS.index();
}

function CreateRouteByChannel() {
  const { channel } = useParams<{ channel: string }>();
  const basePath = useAutomationBasePath();

  const element = useMemo(() => {
    switch (channel) {
      case CAMPAIGN_CHANNEL_PUSH:
        return <AutomationPushCreationPage />;
      default:
        return <Navigate to={basePath} replace />;
    }
  }, [channel, basePath]);

  if (!channel || !isValidAutomationChannel(channel)) {
    return <Navigate to={basePath} replace />;
  }

  return <FeatureFlag flag={flags.smartlist}>{element}</FeatureFlag>;
}

function EditRouteByChannel() {
  const { channel, entityId } = useParams<{
    channel: string;
    entityId: string;
  }>();
  const basePath = useAutomationBasePath();

  if (!channel || !entityId || !isValidAutomationChannel(channel)) {
    return <Navigate to={basePath} replace />;
  }

  // No automation edit page exists yet – redirect to the automation tab.
  return <Navigate to={basePath} replace />;
}

/**
 * Sub-router for automation create/edit. Mount at /:id/automation/messages/*.
 * Handles:
 *   - messages/:channel/new → create flow (push, …)
 *   - messages/:channel/:entityId/edit → edit flow (push, …)
 */
export function AutomationCreateEditRouter() {
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
