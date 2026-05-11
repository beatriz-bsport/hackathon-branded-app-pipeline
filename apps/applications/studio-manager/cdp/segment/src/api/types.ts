import type {
  CommunicationKind,
  EventKind,
} from "@bsport/api-cdp/automated-campaign";
import type { TagRule } from "@bsport/api-cdp/smartlist";

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
  campaign_sent_uuid: string | null;
};

/**
 * Combined type that includes tag rule + resolved tag name
 */
export type TagRuleWithTag = TagRule & {
  tagName: string;
  tagGroupName?: string;
  tagColor?: string;
};
