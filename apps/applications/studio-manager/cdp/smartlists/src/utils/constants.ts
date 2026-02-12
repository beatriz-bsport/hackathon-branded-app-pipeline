import { IconName } from "@bsport/kaizen-primitive-core";

import { CommunicationKind } from "#src/api/constants";

export const COMMUNICATION_KIND_ICON_MAP: Record<CommunicationKind, IconName> =
  {
    [CommunicationKind.EMAIL]: "mail-01",
    [CommunicationKind.SMS]: "message-dots-circle",
    [CommunicationKind.PUSH]: "notification-message",
  };
