import type { CommunicationKind, EventKind } from "./constants";

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
  only_automated_campaign: boolean;
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
