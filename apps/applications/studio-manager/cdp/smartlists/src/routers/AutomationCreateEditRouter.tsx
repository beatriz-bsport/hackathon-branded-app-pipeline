import { type ReactNode, lazy } from "react";
import { Navigate, Route, Routes, useParams } from "react-router";

import {
  CAMPAIGN_CHANNEL_PUSH,
  SMARTLIST_APP_LINKS,
  SMARTLIST_ROUTE_PATTERNS,
} from "#src/urls";

const AutomationPushCreationPage = lazy(
  () => import("#src/pages/AutomationPushCreationPage"),
);
const AutomationPushEditPage = lazy(
  () => import("#src/pages/AutomationPushEditPage"),
);

type AutomationChannel = typeof CAMPAIGN_CHANNEL_PUSH;

function isValidAutomationChannel(
  channel: string,
): channel is AutomationChannel {
  return channel === CAMPAIGN_CHANNEL_PUSH;
}

function useAutomationBasePath(): string {
  const { id } = useParams<{ id: string }>();
  return id ? SMARTLIST_APP_LINKS.automation(id) : SMARTLIST_APP_LINKS.index();
}

type GateAutomationChannelProps = {
  readonly children: ReactNode;
  readonly action?: "create" | "edit";
};

function GateAutomationChannel({
  children,
  action = "create",
}: GateAutomationChannelProps) {
  const { channel, entityId } = useParams<{
    channel: string;
    entityId: string;
  }>();
  const basePath = useAutomationBasePath();

  const hasRequiredEntityId = action === "create" || Boolean(entityId);

  if (!channel || !hasRequiredEntityId || !isValidAutomationChannel(channel)) {
    return <Navigate to={basePath} replace />;
  }

  return children;
}

function CreateRouteByChannel() {
  return (
    <GateAutomationChannel>
      <AutomationPushCreationPage />
    </GateAutomationChannel>
  );
}

function EditRouteByChannel() {
  return (
    <GateAutomationChannel action="edit">
      <AutomationPushEditPage />
    </GateAutomationChannel>
  );
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
