import { Member } from '../member/types';

export type SelectFieldItem = {
  value: number;
  label: string;
};

export type RecipientWithMember = {
  member: Member;
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

export type Communication = {
  uuid: string;
  campaign_id: string;
  data: {
    subject: string;
    body: string;
    uuid: string;
    recipient_list: Array<any>;
    tags_group: Array<any>;
  };
  total_recipients: number;
  date_created: string;
  total_read: number;
  total_click: number;
  text: string;
  sms_text: string;
  title: string;
  kind: number;
};
