import { ErrorAndLoading, GenericListReducerI } from '#libs/types';
import { Member } from '#libs/member/types';

export type CommunicationState = {
  recipient: {
    byId: { [id: number]: Recipient<number> };
    byCommunicationSent: {
      allIds: number[];
    } & ErrorAndLoading;
  };
  sent: {
    byId: { [id: number]: Communication };
    thread: GenericListReducerI;
  };
  send: ErrorAndLoading & {
    selectedMemberList: {
      allMembers: Array<Member>;
    } & ErrorAndLoading;
  };
  memberIdLists: {
    allIds: number[];
    allIdsWithoutPhone: number[];
    allIdsWithoutEmail: number[];
  } & ErrorAndLoading;
};

export type Recipient<MemberType = number> = {
  member: MemberType;
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

export type RecipientCompact = {
  accept_marketing_email: boolean;
  accept_marketing_sms: boolean;
  email: string;
  phone_number: string;
  member_id: number;
  user_id: number;
  name: string;
};

export type Communication = {
  id: number;
  uuid: string;
  campaign_id: string;
  data: {
    subject: string;
    body: string;
    uuid: string;
    recipient_list: Array<RecipientCompact>;
    tags_group: Array<any>;
  };
  total_recipients: number;
  date_created: string;
  total_read: number;
  total_click: number;
  text: string; // this has always the content ...
  sms_text: string; // and maybe this too ...
  title: string;
  kind: number;
  metadata: FormatedContext;
  recipient_member_id_list: number[];
  is_answer?: boolean;
};

export type ThreadCommunication = {
  channel: number; // channel identifier
  communication: Communication;
  photos: string[];
};

export type FormatedContext = {
  offer_id?: number;
  smartlist_id?: number;
  member_id?: number;
  notification_id?: number;
  automated_campaign_id?: number;
};

export type SelectFieldItem = {
  value: number;
  label: string;
};

export type MessageParams = MessageData & {
  context: FormatedContext;
};

export type MessageData = {
  subject?: string; // mail title
  email_template?: number; // mail template id
  body?: string; // mail content if no template
  sms?: string; // sms content
  notification_title?: string;
  notification_content?: string;
  members: number[]; // recipients
};

export type FilterParams = {
  filter_kind?: number[];
  filter_channel?: [
    'offer_id' | 'marketing_notification_id' | 'smartlist_id' | 'member_id',
  ];
  filter_recipient?: number[];
  filter_send_parameter?: number;
  filter_date_start?: number;
  filter_date_end?: number;
};

export type FetchCommunicationParams = {
  page: number;
  filter_kind?: number[];
  filter_channel?: string[];
  filter_recipient?: number[];
  filter_send_parameter: number;
  filter_date_start?: number;
  filter_date_end?: number;
  context: string;
};

export type DrawerProps = {
  onDrawerClose: () => void;
  openDrawer: boolean;
  contextIdentifier: number; // see in constants
  contextMember?: Member; // if we are on a member page
  contextTitle?: string; // notification/smarlist/session name
  contextObjectId?: number; // for hoc
  allMemberCategoryList?: FilteringMemberIdsByGenericCategories;
  communicationKindToWrite?: number;
};

export type FilteringMemberIdsByGenericCategories = {
  categories: Array<{
    categoryMemberIdList: number[];
    categoryIdentifier: number;
    categoryLabel: string;
  }>;
  filterPlaceholder: string;
};
