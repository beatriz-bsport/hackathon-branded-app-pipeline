import type { PaginatedResponse } from "@bsport/store-base";

import type { CommunicationKind } from "#src/automated-campaign/types";
import type {
  CommunicationChannel,
  CommunicationRecipientStatus,
  CommunicationStatus,
} from "#src/smartlist/constants";

import { BackgroundTaskStatus } from "./constants";

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

export type CampaignSentPerformanceReport = {
  delivery_count: number;
  last_open: string;
  top_links: { [key: string]: number };
  planned_resends: number;
  resent_on: string;
};

export type CampaignScheduled = {
  id: number;
  company: number | null;
  smartlist: number | null;
  communication_kind: CommunicationKind;
  text: string | null;
  email_design: number | null;
  title: string | null;
  datetime_scheduled: string;
  datetime_sent: string | null;
  disabled: boolean;
  email_resend_delay: number;
  email_resend_count: number;
};

export type FetchCampaignSentParams = {
  smartlist: number;
  only_automated_campaign?: boolean;
  automated_campaign_id?: number;
  no_automated_campaign?: boolean;
  without_member_info?: boolean;
  page_size?: number;
  page?: number;
};

export type FetchCampaignScheduledParams = {
  smartlist_id__in?: number[];
  id__in?: number[];
  page_size?: number;
  page?: number;
};

export type SendCampaignBasePayload = {
  context_identifier: number;
  context_object_id: number;
  member_filters: {
    smartlist: number;
  };
  subject: string;
};

export type SendEmailCampaignPayload =
  | (SendCampaignBasePayload & {
      email_template: number;
      body?: never;
    })
  | (SendCampaignBasePayload & {
      body: string;
      email_template?: never;
    });

export type SendPushCampaignPayload = {
  notification_title: string;
  notification_content: string;
  context_identifier: number;
  context_object_id: number;
  member_filters: {
    smartlist: number;
  };
};

export type SendSmsCampaignPayload = {
  sms: string;
  context_identifier: number;
  context_object_id: number;
  member_filters: {
    smartlist: number;
  };
};

export type SendCampaignPayload =
  | SendEmailCampaignPayload
  | SendPushCampaignPayload
  | SendSmsCampaignPayload;

export type ScheduleEmailCampaignPayload = ScheduleCampaignPayload;

export type LegacySendCampaignPayload = {
  context_identifier: number;
  context_object_id: number;
  member_filters: { smartlist: number };
  subject?: string;
  body?: string;
  email_template?: number;
  notification_title?: string;
  notification_content?: string;
  sms?: string;
};

export type ScheduleCampaignPayload = {
  smartlist: number;
  communication_kind: CommunicationKind;
  title: string;
  datetime_scheduled: string;
  email_design?: number;
  text?: string;
};

export type UpdateScheduledEmailCampaignPayload = ScheduleCampaignPayload;

export type FetchCampaignRecipientParams = {
  campaign: string;
  page?: number;
  page_size?: number;
};

export type CampaignRecipientWithMemberData = {
  avatar: string;
  campaign: string;
  full_name: string;
  id: number;
  communication_sent: number;
  member: number;
  email: string;
  phonenumber: string;
  last_read: number;
  links_opened_count: number;
  read_count: number;
  status: CommunicationRecipientStatus;
};

export type CommunicationPreviewRecipientsRequest =
  | {
      channel: CommunicationChannel;
      is_marketing: boolean;
      target: { type: "smartlist"; smartlist_id: number };
    }
  | {
      channel: CommunicationChannel;
      is_marketing: boolean;
      target: {
        type: "offer";
        offer_id: number;
        booking_status: "confirmed" | "cancelled" | "waitlist";
      };
    }
  | {
      channel: CommunicationChannel;
      is_marketing: boolean;
      target: { type: "members"; member_ids: number[] };
    }
  | {
      channel: CommunicationChannel;
      is_marketing: boolean;
      target: {
        type: "communication_scheduled";
        communication_scheduled_id: number;
      };
    };

export type FetchCommunicationRecipientsPreviewParams = {
  page?: number;
  page_size?: number;
} & CommunicationPreviewRecipientsRequest;

export type CommunicationRecipientCount = {
  count: number;
};

export type CommunicationRecipientMinimal = {
  id: number;
  name: string;
  email: string;
  phone: string | null;
  photo: string | null;
};

export type PaginatedCampaignSent = PaginatedResponse<CampaignSent>;
export type PaginatedCampaignRecipients =
  PaginatedResponse<CampaignRecipientWithMemberData>;
export type PaginatedCommunicationRecipients =
  PaginatedResponse<CommunicationRecipientMinimal>;

export type CampaignSummary = {
  total_recipients: number;
  total_read: number;
  total_click: number;
};

export type FetchCampaignSummaryByAutomatedCampaignIdPayload = {
  key: "automated_campaign_id";
  value: number;
};

export type BackgroundTaskStatusResponse = {
  return_value: string | object;
  status: BackgroundTaskStatus;
  task_name: string;
  uuid: string;
};

export type GenerateReportParams = {
  smartlistId: string;
  startDate: string; // format yyyy-MM-dd
  endDate: string; // format yyyy-MM-dd
};

export type GenerateReportResult = {
  backgroundTaskUuid: string; // Id that should be used for the polling of the background task result
};
