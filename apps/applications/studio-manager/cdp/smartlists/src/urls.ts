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

const SMARTLIST_ROUTE = "/";

/** Route path patterns for <Route path={...} />. App-relative (basename handled by Router). */
export const URLS = {
  INDEX: SMARTLIST_ROUTE,
  DETAILS: "/:id",
  PARAMETER: "/:id/parameter",
  AUTOMATION: "/:id/automation",
  AUTOMATION_MESSAGES: "/:id/automation/messages",
  CAMPAIGN: "/:id/campaign",
  CAMPAIGN_SCHEDULED_DETAILS: "/:id/campaign/scheduled/:uuid",
  CAMPAIGN_SENT_DETAILS: "/:id/campaign/sent/:uuid",
  AUTOMATION_MESSAGE: "/:id/automation/message/:messageId",
  AUTOMATION_TAG_RULE: "/:id/automation/tag-rule/:tagRuleId",

  /** Path builders for navigation and links (same pattern as giftcard URLS.EDITOR, etc.). */
  detailsPath: (id: string) => `/${id}`,
  parameterPath: (id: string) => `/${id}/${PARAMETER_TAB_PATH}`,
  automationPath: (id: string) => `/${id}/${AUTOMATION_TAB_PATH}`,
  campaignPath: (id: string) => `/${id}/${CAMPAIGN_TAB_PATH}`,
  campaignSentDetailsPath: (smartlistId: string, campaignUuid: string) =>
    `/${smartlistId}/campaign/sent/${campaignUuid}`,
  campaignScheduledDetailsPath: (smartlistId: string, campaignId: number) =>
    `/${smartlistId}/campaign/scheduled/${campaignId}`,
} as const;

export const SMARTLIST_COMMUNICATION_URLS = {
  SMARTLIST_ROUTE_FROM_SUBNAV: SMARTLIST_ROUTE,
  CAMPAIGN_CREATE: "/:channel/new",
  CAMPAIGN_EDIT: "/:channel/:entityId/edit",
  AUTOMATION_CREATION: "/:channel/new",
  AUTOMATION_EDIT: "/:channel/:entityId/edit",

  campaignCreatePath: (smartlistId: string, channel: CampaignChannel) =>
    `/${smartlistId}/campaign/${channel}/new`,
  campaignEditPath: (
    smartlistId: string,
    channel: CampaignChannel,
    entityId: string,
  ) => `/${smartlistId}/campaign/${channel}/${entityId}/edit`,
  automationCreationPath: (smartlistId: string, channel: CampaignChannel) =>
    `/${smartlistId}/automation/messages/${channel}/new`,
  automationEditPath: (
    smartlistId: string,
    channel: CampaignChannel,
    entityId: string,
  ) => `/${smartlistId}/automation/messages/${channel}/${entityId}/edit`,
} as const;

export const LEGACY_URLS = {
  AUDIENCE: "/audience",
  SMARTLIST_MEMBER: (smartlistId: number) =>
    `/smart-list/${smartlistId}/member`,
} as const;
