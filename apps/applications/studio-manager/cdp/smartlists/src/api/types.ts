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
 *
 * event_kind values:
 *   0 = SEND_COMMUNICATION_ON_JOIN (when member enters smartlist)
 *   1 = SEND_COMMUNICATION_ON_LEFT (when member leaves smartlist)
 *
 * communication_kind values:
 *   0 = EMAIL
 *   1 = SMS
 *   2 = PUSH_NOTIFICATION
 */
export type AutomatedCampaign = {
  id: number;
  company: number;
  smartlist: number;
  event_kind: number;
  communication_kind: number;
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
