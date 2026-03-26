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
const AutomationMessagePage = lazy(
  () => import("#src/pages/AutomationMessagePage"),
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
  readonly action?: "create" | "edit" | "detail";
};

function GateAutomationChannel({
  children,
  action = "create",
}: GateAutomationChannelProps) {
  const { channel, entityId } = useParams<{
    channel: string;
    entityId: string;
  }>();
  const { messageId } = useParams<{ messageId: string }>();
  const basePath = useAutomationBasePath();

  const isCreate = action === "create";
  const isEdit = action === "edit" && !!entityId;
  const isDetail = action === "detail" && !!messageId;

  const hasRequiredParam = isCreate || isEdit || isDetail;

  if (!channel || !hasRequiredParam || !isValidAutomationChannel(channel)) {
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

function DetailRouteByChannel() {
  return (
    <GateAutomationChannel action="detail">
      <AutomationMessagePage />
    </GateAutomationChannel>
  );
}

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
      <Route
        path={SMARTLIST_ROUTE_PATTERNS.COMMUNICATION_DETAIL}
        element={<DetailRouteByChannel />}
      />
      <Route path="*" element={<Navigate to={".."} replace />} />
    </Routes>
  );
}
