import {
  AUTOMATION_TAB_PATH,
  CAMPAIGN_TAB_PATH,
  PARAMETER_TAB_PATH,
} from "./utils/constants";

/** Channel segment for campaign create/edit routes. Single source of truth. */
export const CAMPAIGN_CHANNEL_EMAIL = "email";
export const CAMPAIGN_CHANNEL_POPUP = "popup";
export const CAMPAIGN_CHANNEL_SMS = "sms";
export const CAMPAIGN_CHANNEL_PUSH = "push";
export const CAMPAIGN_CHANNELS = [
  CAMPAIGN_CHANNEL_EMAIL,
  CAMPAIGN_CHANNEL_POPUP,
  CAMPAIGN_CHANNEL_SMS,
  CAMPAIGN_CHANNEL_PUSH,
] as const;
export type CampaignChannel = (typeof CAMPAIGN_CHANNELS)[number];

export const SMARTLIST_APP_ROOT_PATH = "/smartlist";

const SEGMENTS = {
  campaign: CAMPAIGN_TAB_PATH,
  automation: AUTOMATION_TAB_PATH,
  parameter: PARAMETER_TAB_PATH,
  messages: "messages",
  message: "message",
  tagRule: "tag-rule",
  sent: "sent",
  scheduled: "scheduled",
  create: "new",
  edit: "edit",
  legacySmartlist: "smart-list",
  legacyMember: "member",
  legacyAudience: "audience",
} as const;

export const PARAMS = {
  smartlistId: ":id",
  uuid: ":uuid",
  messageId: ":messageId",
  tagRuleId: ":tagRuleId",
  channel: ":channel",
  entityId: ":entityId",
} as const;

const trimSlashes = (value: string) => value.replace(/^\/+|\/+$/g, "");

const joinPath = (...segments: Array<string | number>) => {
  const normalizedSegments = segments
    .map((segment) => trimSlashes(String(segment)))
    .filter((segment) => segment.length > 0);

  return `/${normalizedSegments.join("/")}`;
};

const buildSmartlistLink = (...segments: Array<string | number>) =>
  joinPath(SMARTLIST_APP_ROOT_PATH, ...segments);

export type SmartlistDetailsTabPath =
  | typeof PARAMETER_TAB_PATH
  | typeof CAMPAIGN_TAB_PATH
  | typeof AUTOMATION_TAB_PATH;

export const SMARTLIST_ROUTE_PATTERNS = {
  DETAILS: PARAMS.smartlistId,
  PARAMETER: `${PARAMS.smartlistId}/${SEGMENTS.parameter}`,
  AUTOMATION: `${PARAMS.smartlistId}/${SEGMENTS.automation}`,
  AUTOMATION_MESSAGES: `${PARAMS.smartlistId}/${SEGMENTS.automation}/${SEGMENTS.messages}`,
  CAMPAIGN: `${PARAMS.smartlistId}/${SEGMENTS.campaign}`,
  CAMPAIGN_SCHEDULED_DETAILS: `${PARAMS.smartlistId}/${SEGMENTS.campaign}/${SEGMENTS.scheduled}/${PARAMS.uuid}`,
  CAMPAIGN_SENT_DETAILS: `${PARAMS.smartlistId}/${SEGMENTS.campaign}/${SEGMENTS.sent}/${PARAMS.uuid}`,
  AUTOMATION_PUSH_CREATE: `${PARAMS.smartlistId}/${SEGMENTS.automation}/${SEGMENTS.messages}/${CAMPAIGN_CHANNEL_PUSH}/${SEGMENTS.create}`,
  AUTOMATION_SMS_CREATE: `${PARAMS.smartlistId}/${SEGMENTS.automation}/${SEGMENTS.messages}/${CAMPAIGN_CHANNEL_SMS}/${SEGMENTS.create}`,
  AUTOMATION_PUSH_EDIT: `${PARAMS.smartlistId}/${SEGMENTS.automation}/${SEGMENTS.messages}/${CAMPAIGN_CHANNEL_PUSH}/${PARAMS.entityId}/${SEGMENTS.edit}`,
  AUTOMATION_PUSH_MESSAGE: `${PARAMS.smartlistId}/${SEGMENTS.automation}/${SEGMENTS.messages}/${CAMPAIGN_CHANNEL_PUSH}/${PARAMS.messageId}`,
  AUTOMATION_TAG_RULE: `${PARAMS.smartlistId}/${SEGMENTS.automation}/${SEGMENTS.tagRule}/${PARAMS.tagRuleId}`,
  COMMUNICATION_CREATE: `${PARAMS.channel}/${SEGMENTS.create}`,
  COMMUNICATION_EDIT: `${PARAMS.channel}/${PARAMS.entityId}/${SEGMENTS.edit}`,
  COMMUNICATION_DETAIL: `${PARAMS.channel}/${PARAMS.messageId}`,
} as const;

export const SMARTLIST_APP_LINKS = {
  index: () => SMARTLIST_APP_ROOT_PATH,
  details: (smartlistId: string) => buildSmartlistLink(smartlistId),
  detailsTab: (smartlistId: string, tab: SmartlistDetailsTabPath) =>
    buildSmartlistLink(smartlistId, tab),
  parameter: (smartlistId: string) =>
    buildSmartlistLink(smartlistId, SEGMENTS.parameter),
  automation: (smartlistId: string) =>
    buildSmartlistLink(smartlistId, SEGMENTS.automation),
  automationPushCreation: (smartlistId: string) =>
    buildSmartlistLink(
      smartlistId,
      SEGMENTS.automation,
      SEGMENTS.messages,
      CAMPAIGN_CHANNEL_PUSH,
      SEGMENTS.create,
    ),
  automationSmsCreation: (smartlistId: string) =>
    buildSmartlistLink(
      smartlistId,
      SEGMENTS.automation,
      SEGMENTS.messages,
      CAMPAIGN_CHANNEL_SMS,
      SEGMENTS.create,
    ),
  automationPushEdit: (smartlistId: string, entityId: string) =>
    buildSmartlistLink(
      smartlistId,
      SEGMENTS.automation,
      SEGMENTS.messages,
      CAMPAIGN_CHANNEL_PUSH,
      entityId,
      SEGMENTS.edit,
    ),
  automationPushMessage: (smartlistId: string, messageId: string | number) =>
    buildSmartlistLink(
      smartlistId,
      SEGMENTS.automation,
      SEGMENTS.messages,
      CAMPAIGN_CHANNEL_PUSH,
      messageId,
    ),
  campaign: (smartlistId: string) =>
    buildSmartlistLink(smartlistId, SEGMENTS.campaign),
  campaignSentDetails: (smartlistId: string, campaignUuid: string) =>
    buildSmartlistLink(
      smartlistId,
      SEGMENTS.campaign,
      SEGMENTS.sent,
      campaignUuid,
    ),
  campaignScheduledDetails: (smartlistId: string, campaignId: number) =>
    buildSmartlistLink(
      smartlistId,
      SEGMENTS.campaign,
      SEGMENTS.scheduled,
      campaignId,
    ),
  campaignCreate: (smartlistId: string, channel: CampaignChannel) =>
    buildSmartlistLink(
      smartlistId,
      SEGMENTS.campaign,
      channel,
      SEGMENTS.create,
    ),
  campaignEdit: (
    smartlistId: string,
    channel: CampaignChannel,
    entityId: string,
  ) =>
    buildSmartlistLink(
      smartlistId,
      SEGMENTS.campaign,
      channel,
      entityId,
      SEGMENTS.edit,
    ),
} as const;

export const SMARTLIST_APP_ABSOLUTE_URLS = {
  fromOrigin: (origin: string, appLink: string) => `${origin}${appLink}`,
} as const;

export const SMARTLIST_LEGACY_URLS = {
  audience: joinPath(SEGMENTS.legacyAudience),
  smartlistMember: (smartlistId: number) =>
    joinPath(SEGMENTS.legacySmartlist, smartlistId, SEGMENTS.legacyMember),
} as const;
