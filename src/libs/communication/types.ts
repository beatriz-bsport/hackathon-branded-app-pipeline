import { ErrorAndLoading } from '../types';
import type { AutomatedCampaign } from '#libs/smart-list/types';

export type MemberMailData = {
  members: Array<number>;
  subject: string;
  body: string;
  email_resend_count?: number;
  email_resend_delay?: number;
  member_blacklist?: number[];
  sms?: string;
  email_template?: number;
  notification_title?: string;
  notification_content?: string;
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
  has_been_read: boolean;
  is_answer: boolean;
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
  delivery_count?: number;
  last_open?: string;
  top_links: { [key: string]: number };
};

export type MailState = {
  recipient: {
    byId: { [id: number]: Recipient };
    bulk: ErrorAndLoading;
    byCampaign: {
      allIds: Array<number>;
      page?: number;
      count: number;
    } & ErrorAndLoading;
  } & ErrorAndLoading;
  marketingNotification: ErrorAndLoading & {
    byId: { [key: string]: MarketingNotificationMailStat };
  };
  campaign: {
    byId: { [uuid: string]: Campaign };
    report: {
      data?: Report;
    } & ErrorAndLoading;
    bySmartlist: {
      allIds: Array<string>;
      page?: number;
      next_page?: number;
      count: number;
    } & ErrorAndLoading;
    byMember: {
      allIds: Array<string>;
      page?: number;
      next_page?: number;
      count: number;
    } & ErrorAndLoading;
    export: {
      link: string | null;
    } & ErrorAndLoading;
  };
  automatedCampaign: {
    byId: { [uuid: string]: Campaign };
    bySmartlist: {
      allIds: Array<string>;
      page?: number;
      next_page?: number;
      count: number;
    } & ErrorAndLoading;
  };
  availablePushNotificationRecipient: {
    allIds: number[];
  } & ErrorAndLoading;
  reportExport: {
    recipientsCount?: number;
    isExportable?: boolean;
    exportLink?: string;
    exportDate?: string;
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

export type CommunicationSentGroupConfigFormValues = {
  sendToAllMembers: boolean;
  companiesWithSmartLists: CompanyWithSmartList[];
};

export type CompanyWithSmartList = {
  companyId: number;
  companyName: string;
  smartListId: number | null;
  toggleSend: boolean;
};

export type CommunicationSentGroupConfig = {
  id?: number;
  name: string;
  description?: string;
  to_all_members?: boolean;
  smartlists?: number[];
};

export type SendGroupedCommunicationData = {
  send_communication_data: {
    subject: string;
    body?: string;
    email_template?: number;
    context_identifier: number;
    context_object_id: number;
  };
  from_address?: string;
  communication_sent_group_config: number;
};

export type CommunicationSentGroup = {
  id: number;
  communication_sent_group_config: CommunicationSentGroupConfig & {
    created_at: string;
    updated_at: string;
    franchisor: number;
  };
  total_recipients: number;
  total_read: number;
  total_click: string;
  date_created: string;
  data?: {
    subject: string;
    body: string;
    uuid: string;
    recipient_list: Array<[number, string, string]>;
    tags_groups: Array<{ [key: string]: string }>;
  };
  kind: number;
};

export type CommunicationSentGroupConfigState = {
  communicationSentGroupConfig: {
    byId: { [id: number]: CommunicationSentGroupConfig };
    allIds: number[];
    loading: boolean;
    error: boolean;
    createOrUpdate: { loading: boolean; error: Error | null };
    delete: { loading: boolean; error: Error | null };
  };
  mail: { loading: boolean; error: Error | null };
  communicationSentGroup: {
    byId: { [id: number]: CommunicationSentGroup };
    allIds: number[];
    page: number;
    next_page: number;
    count: number;
    loading: boolean;
    error: boolean;
    report: {
      data: CommunicationSentGroupReport;
      loading: boolean;
      error: Error | null;
    };
    export: {
      loading: boolean;
      error: Error | null;
      link: string | null;
    };
  };
  recipient: {
    byId: { [memberId: number]: Recipient };
    allIds: number[];
    params: {
      ordering: string;
    };
    page: number;
    next_page: number;
    count: number;
    loading: boolean;
    error: Error | null;
  };
};

export type FetchCommunicationSentGroupConfigCommunicationSentGroupParams = {
  page: number;
  communication_sent_group_config_id: number;
};

export type FetchRecipientListByCommunicationSentGroupParams = {
  page: number;
  communication_sent_group_id: number;
  params: { ordering?: string };
};

export type FetchRecipientListByCommunicationSentGroupRealParams = {
  page: number;
  communication_sent_group_id: number;
  ordering?: string;
};

export type CommunicationSentGroupReport = {
  last_open?: string;
  top_links: { [key: string]: number };
};

export type CampaignExportStartEndDates = {
  start_date: string;
  end_date: string;
};

export type RecipientsNumberAndExportable = {
  recipient_count: number;
  xlsx_exportable: boolean;
};
