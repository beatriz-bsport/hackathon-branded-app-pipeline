export const CommunicationKind = {
  EMAIL: 0,
  SMS: 1,
  PUSH: 2,
} as const;

export type CommunicationKind =
  (typeof CommunicationKind)[keyof typeof CommunicationKind];

export const EventKind = {
  JOIN: 0,
  LEAVE: 1,
} as const;

export type EventKind = (typeof EventKind)[keyof typeof EventKind];

/**
 * Automated Campaign type from the API.
 * Endpoint: GET customer-data-platform/v1/smartlist/automated_campaign/
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

export type CreateAutomatedCampaignParams = {
  smartlist: number;
  event_kind: EventKind;
  communication_kind: CommunicationKind;
  title: string;
  text: string;
  max_communications_sent_per_member: number | null;
};

export type UpdateAutomatedCampaignParams = {
  id: number;
} & Omit<CreateAutomatedCampaignParams, "smartlist" | "communication_kind">;

export type FetchAutomatedCampaignsParams = {
  smartlist_id: string;
  exclude_disabled?: boolean;
};
