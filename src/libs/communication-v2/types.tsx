import { ChatThreadKinds } from '@bsport/common/lib/master-data/communication-inbox';
import { ErrorAndLoading, GenericListReducerI } from '#libs/types';
import { Member, MemberFilter } from '#libs/member/types';
import { CustomMobilePopup } from '#libs/settings/types';

export type CommunicationProviderState = {
  provider?: CommunicationProvider;
  update: ErrorAndLoading;
} & ErrorAndLoading;

export type SmartListPopupSending = {
  id: number;
  custom_app_popup_link: CustomMobilePopup;
  member_ids: Array<number>;
  smartlist?: number;
};

export type CommunicationState = {
  recipient: {
    byId: { [id: number]: Recipient<number> };
    allPageIds: number[];
    count: number;
  } & ErrorAndLoading;
  sent: {
    byId: { [id: number]: Communication };
    thread: GenericListReducerI;
  };
  send: ErrorAndLoading;
  flagAsReadByContext: ErrorAndLoading;
  unreadAnswers: { count: number } & ErrorAndLoading;
  company_communication_provider: {
    email: CommunicationProviderState;
    sms: CommunicationProviderState;
    push_notification: CommunicationProviderState;
  };
  smartListPopupSending: ErrorAndLoading & {
    byId: { [id: number]: SmartListPopupSending };
    allIds: Array<number>;
  };
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
    tags_groups: Array<Record<string, string>>;
  };
  total_recipients: number;
  date_created: string;
  total_read: number;
  total_click: number;
  text: string; // this has always the content ...
  sms_text: string; // and maybe this too ...
  title: string;
  kind: number;
  metadata: CommunicationMetadata;
  recipient_member_id_list: number[];
  is_answer?: boolean;
  status: number;
};

export type ThreadCommunication = {
  channel: number; // channel identifier
  communication: Communication;
  photos: string[];
  answerSourceMember: Member;
};

export type CommunicationMetadata = {
  offer_id?: number;
  smartlist_id?: number;
  member_id?: number;
  notification_rule?: number;
  notification_event?: number;
  automated_campaign_id?: number;
  marketing_notification_id?: number;
};

export type CommunicationContext = {
  context_identifier: number;
  context_object_id: number;
};

export type SelectFieldItem = {
  value: number;
  label: string;
};

export type MessageParams = MessageData &
  CommunicationContext & { member_filters: MemberFilter };

export type MessageData = {
  subject?: string; // mail title
  email_template?: number; // mail template id
  body?: string; // mail content if no template
  sms?: string; // sms content
  notification_title?: string;
  notification_content?: string;
  member_blacklist?: number[]; // recipients to blacklist
};

export type CommunicationFilterParams = {
  filter_kind?: number[];
  filter_channel?: [
    | 'offer_id'
    | 'marketing_notification_id'
    | 'smartlist_id'
    | 'member_id'
    | 'notification_rule',
  ];
  filter_recipient?: number[];
  filter_send_parameter?: number;
  filter_src_or_dst?: number;
  filter_date_start?: number;
  filter_date_end?: number;
};

export type FetchCommunicationParams = {
  page: number;
  page_size: number;
} & CommunicationContext &
  CommunicationFilterParams;

export type DrawerProps = {
  onDrawerClose: () => void;
  openDrawer: boolean;
  contextIdentifier: number; // see in constants
  contextMember?: Member; // if we are on a member page
  contextTitle?: string; // notification/smarlist/session name
  contextObjectId?: number; // for hoc
  allMemberCategoryList?: FilteringMemberIdsByGenericCategories;
  communicationKindToWrite?: number;
  propToListenToReloadRecipients?: any; // if this prop changes, refetch data on recipients
};

export type FilteringMemberIdsByGenericCategories = {
  categories: Array<{
    categoryMemberIdList: number[];
    categoryIdentifier: number;
    categoryLabel: string;
  }>;
  filterPlaceholder: string;
};

export type CommunicationProvider = {
  company: number;
  kind: number;
  is_two_way_email_activated: boolean;
};

export type CommunicationProviderSettings = {
  is_two_way_email_activated: boolean;
};

export type CommunicationThread = {
  id: number;
  name: string;
  cover?: string;
  subtitle?: string;
  lastCommunicationDate: string;
  lastCommunicationContent: string;
  hasBeenRead: boolean;
  isMuted: boolean;
  isFavorite: boolean;
  isDisabled: boolean;
  relatedObjectKind: ChatThreadKinds;
  relatedObjectId: number;
  numberOfUnreadAnswers: number;
};
