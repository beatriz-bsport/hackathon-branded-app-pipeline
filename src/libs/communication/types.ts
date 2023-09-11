import { ErrorAndLoading } from '../types';
import type { AutomatedCampaign } from '#libs/smart-list/types';

export type MemberMailData = {
  members: Array<number>;
  subject: string;
  body: string;
};

export type MarketingNotificationMailStat = {
  id: string;
  total_recipients: number;
  total_read: number;
  total_click: number;
};

export type Recipient = {
  member: number;
  email_sent: number;
  campaign: string;
  communication_sent: string;
  read_count: number;
  last_read?: string;
  links_opened: string;
  links_opened_count: number;
  status: number;
  spam_report: boolean;
  email: string;
  id: number;
  sms_num_segments?: number | null;
  sms_extra_segments_billed: boolean;
  sms_error_code?: number | null;
  sms_message_sid: string;
};

export type Campaign = {
  uuid: string;
  data: {
    subject: string;
    body: string;
    uuid: string;
    recipient_list: Array<[number, string, string]>;
    tags_groups: Array<{ [key: string]: string }>;
  };
  total_recipients: number;
  date_created: string;
  total_read: number;
  total_click: number;
  sms_text: string;
  kind: number;
  metadata: {
    smartlist_id?: number;
    automated_campaign_id?: number;
  };
  automated_campaign?: AutomatedCampaign;
};

export type Report = {
  delivery_count: number;
  last_open?: string;
  top_links: { [key: string]: number };
  resent_on: string[];
  planned_resends: string[];
};

export type MailState = {
  recipient: {
    isloading: boolean;
    error?: Error;
    byId: { [id: number]: Recipient };
    bulk: {
      loading: boolean;
      error?: Error;
    };
    byCampaign: {
      allIds: Array<number>;
      loading: boolean;
      error?: Error;
      page?: number;
      count: number;
    };
  };
  marketingNotification: ErrorAndLoading & {
    byId: { [key: string]: MarketingNotificationMailStat };
  };
  campaign: {
    byId: { [uuid: string]: Campaign };
    report: {
      data?: Report;
      loading: boolean;
      error?: Error;
    };
    bySmartlist: {
      allIds: Array<string>;
      loading: boolean;
      error?: Error;
      page?: number;
      next_page?: number;
      count: number;
    };
    byMember: {
      allIds: Array<string>;
      loading: boolean;
      error?: Error;
      page?: number;
      next_page?: number;
      count: number;
    };
    export: {
      link: string | null;
    } & ErrorAndLoading;
  };
  automatedCampaign: {
    byId: { [uuid: string]: Campaign };
    bySmartlist: {
      allIds: Array<string>;
      loading: boolean;
      error?: Error;
      page?: number;
      next_page?: number;
      count: number;
    };
  };
  availablePushNotificationRecipient: {
    allIds: number[];
  } & ErrorAndLoading;
};

export type SendDirectCommunicationType = {
  email_temaplte?: number | null;
  body: string;
  kind: string;
  subject: string;
  notification_title?: string;
  members: Array<number>;
};
