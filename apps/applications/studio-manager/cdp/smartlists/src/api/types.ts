import type {
  BackgroundTaskStatus,
  CommunicationKind,
  CommunicationStatus,
  EventKind,
  TagRuleKind,
} from "./constants";

/**
 * Smartlist type from the API
 * Endpoint: GET /api/v1/smartlist/group/{id}
 */
export type Smartlist = {
  id: number;
  name: string;
  company: number;
  description: string;
  member_base: number;
  has_active_communication_group_configs: boolean;
};

/**
 * Automated Campaign type from the API
 * Endpoint: GET /api/v1/smartlist/automated_campaign/
 */
export type AutomatedCampaign = {
  id: number;
  company: number;
  smartlist: number;
  event_kind: EventKind;
  communication_kind: CommunicationKind;
  text: string | null;
  email_design: number | null;
  title: string | null;
  disabled: boolean;
  date_created: string;
  max_communications_sent_per_member: number | null;
};

/**
 * Get Popups from the API
 * Endpoint for lists: GET member-experience/v1/mobile_app/manager/custom_popup_links/
 * Endpoint for individual popups: GET member-experience/v1/mobile_app/manager/custom_popup_links/{id}
 * Backend serializer: AppPopupLinkSerializer
 */
export type Popup = {
  custom_popup_id: number;
  name: string;
  link: string;
  image: string;
  date_created: string; // ISO 8601 datetime string
  smartlist_popup_id?: number;
  smartlist_id?: number;
  smartlist_name?: string;
};

/**
 * Query params for fetching automated campaigns
 */
export type FetchAutomatedCampaignsParams = {
  smartlist_id: string;
  exclude_disabled?: boolean;
};

/**
 * Campaign Sent type (with analytics) from the API
 * Endpoint: GET /api/v1/communication/communication_sent/
 *
 * This contains the analytics data for campaigns that have been sent,
 * including automated campaigns.
 */
export type CampaignSent = {
  uuid: string;
  total_recipients: number;
  total_read: number;
  total_click: number;
  date_created: string;
  kind: CommunicationKind;
  status: CommunicationStatus;
  has_been_read: boolean;
  title?: string;
  text?: string;
  sms_text?: string;
  data: {
    subject?: string;
    body?: string;
    provider_id?: string;
  };
  metadata: {
    smartlist_id?: number;
    automated_campaign_id?: number;
  };
};

/**
 * Query params for fetching campaign sent data
 */
export type FetchCampaignSentParams = {
  smartlist: number;
  only_automated_campaign?: boolean;
  no_automated_campaign?: boolean;
  without_member_info?: boolean;
  page_size?: number;
  page?: number;
};

/**
 * Combined type that includes automated campaign config + analytics
 */
export type AutomatedCampaignWithAnalytics = {
  id: number;
  event_kind: EventKind;
  communication_kind: CommunicationKind;
  date_created: string;
  title: string | null;
  total_recipients: number;
  total_read: number;
  total_click: number;
};

/**
 * Tag Rule type from the API
 * Endpoint: GET /api/v1/smartlist/auto_tag_rules/
 */
export type TagRule = {
  id: number;
  company_id: number;
  smartlist: number;
  tag: number;
  kind: TagRuleKind;
  date_created: string;
};

/**
 * Tag type from the API
 * Endpoint: GET /api/v1/tag/
 */
export type Tag = {
  id: number;
  name: string;
  group: number;
  color: string;
  icon: string;
  tag_template: number | null;
};

/**
 * TagGroup type from the API
 * Endpoint: GET /customer-data-platform/v0/tagging/tag-group/
 */
export type TagGroup = {
  id: number;
  name: string;
  tags: number[];
  kind: number;
  tag_group_template: number | null;
  is_created_for_zoho: boolean;
};

/**
 * Combined type that includes tag rule + resolved tag name
 */
export type TagRuleWithTag = TagRule & {
  tagName: string;
  tagGroupName?: string;
  tagColor?: string;
};

/**
 * Query params for fetching tag rules
 */
export type FetchTagRulesParams = { smartlist_id: string };

/**
 * Parameters for fetching scheduled campaigns.
 */
export type FetchCampaignScheduledParams = {
  /** List of smartlists ids where you want to fetch the different scheduled communications linked to them. */
  smartlist_id__in?: number[];

  /** List of communication scheduled ids. */
  id__in?: number[];

  /** Number of items per page (for pagination). */
  page_size?: number;

  /** Page number of the results (for pagination). */
  page?: number;
};

/**
 * CommunicationScheduled type from the API
 * Model: CommunicationScheduled
 * Serializer: CommunicationScheduledSerializer
 * Endpoint: GET /communicate/v1/communication/communication_scheduled/
 */
export type CampaignScheduled = {
  id: number;
  company: number | null;
  smartlist: number | null;
  communication_kind: CommunicationKind;
  text: string | null;
  email_design: number | null;
  title: string | null;
  datetime_scheduled: string; // ISO 8601 datetime
  datetime_sent: string | null; // ISO 8601 or null
  disabled: boolean;
  // Deprecated but present in API
  email_resend_delay: number;
  email_resend_count: number;
};

export type GenerateReportParams = {
  smartlistId: string;
  startDate: string; // format yyyy-MM-dd
  endDate: string; // format yyyy-MM-dd
};

export type GenerateReportResult = {
  backgroundTaskUuid: string; // Id that should be used for the polling of the background task result
};

export type BackgroundTaskStatusResponse = {
  return_value: string | object;
  status: BackgroundTaskStatus;
  task_name: string;
  uuid: string;
};
