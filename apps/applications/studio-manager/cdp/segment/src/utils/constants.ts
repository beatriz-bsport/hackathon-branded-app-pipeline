import { CommunicationKind } from "@bsport/api-cdp/automated-campaign";
import { CommunicationChannel } from "@bsport/api-cdp/smartlist";
import { IconName } from "@bsport/kaizen-primitive-core";

export const PARAMETER_TAB_PATH = "parameter";
export const CAMPAIGN_TAB_PATH = "campaign";
export const AUTOMATION_TAB_PATH = "automation";
export const PREBUILT_SEGMENT_TAB_PATH = "segment";
export const PREBUILT_CAMPAIGNS_TAB_PATH = "campaigns";

export const COMMUNICATION_KIND_ICON_MAP: Record<CommunicationKind, IconName> =
  {
    [CommunicationKind.EMAIL]: "mail-01",
    [CommunicationKind.SMS]: "message-dots-circle",
    [CommunicationKind.PUSH]: "notification-message",
  };

export const COMMUNICATION_CHANNEL_BY_KIND_MAP: Record<
  CommunicationKind,
  CommunicationChannel
> = {
  [CommunicationKind.EMAIL]: CommunicationChannel.EMAIL,
  [CommunicationKind.SMS]: CommunicationChannel.SMS,
  [CommunicationKind.PUSH]: CommunicationChannel.PUSH,
};

export const CAMPAIGN_SCHEDULED_DELETE_INLINE_ACTION =
  "delete-scheduled-communication";
export const CAMPAIGN_SCHEDULED_EDIT_INLINE_ACTION =
  "edit-scheduled-communication";

export type CampaignScheduledInlineActions =
  | typeof CAMPAIGN_SCHEDULED_DELETE_INLINE_ACTION
  | typeof CAMPAIGN_SCHEDULED_EDIT_INLINE_ACTION;

export const CONTEXT_SMARTLIST = 202;
export const CONTEXT_PREBUILT_SEGMENT = 207;
