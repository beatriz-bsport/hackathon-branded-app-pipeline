import type { DateTime } from 'luxon';
import type { Immutable } from 'seamless-immutable';
import { ChatThreadKinds } from '@bsport/common/lib/master-data/communication-inbox.js';
import type {
  ErrorAndLoading,
  GenericListReducerI,
  GenericPaginationResults,
} from '#src/libs/types';
import type {
  Member,
  MemberFilter,
  MemberMinimal,
} from '#src/libs/member/types';
import type { CustomMobilePopup } from '#src/libs/settings/types';
import type { AutomatedCampaign, SmartList } from '#src/libs/smart-list/types';

export type CommunicationProviderState = {
  provider?: CommunicationProvider | null;
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
    messageList: GenericListReducerI;
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
  inboxThread: {
    byId: { [id: number]: CommunicationThread };
    member: GenericListReducerI;
    smartlist: GenericListReducerI;
    offer: GenericListReducerI;
    unreadAnswersCountsById: { [id: number]: number };
    allUnreadAnswersCount: number;
    currentThread: ErrorAndLoading;
  } & ErrorAndLoading;
  communicationScheduled: {
    byId: { [id: number]: CommunicationScheduled };
    allIds: number[];
    page: number;
    next_page: number | null;
    count: number | null;
    bySmartlistId: {
      all: {
        [smartlistId: number]: {
          allIds: number[];
          page: number;
          next_page: number | null;
          count: number | null;
        };
      };
    } & ErrorAndLoading;
  } & ErrorAndLoading;
  communicationSMSProviderVerification: {
    isVerified: boolean;
  } & ErrorAndLoading;
  firstReachedRecipients: {
    byKind: MemberListDataByCommunicationKind;
  } & ErrorAndLoading;
};

export type Recipient<MemberType = number> = {
  member: MemberType;
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
  sender_member_id?: number;
  is_answer?: boolean;
  status: number;
  error_code: number | null;
};

export type CommunicationMessage = {
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
  communication_sent_group_config_id?: number;
  cadence_marketing_action_id?: number;
};

export type CommunicationContext = {
  context_identifier?: number;
  context_object_id?: number;
  thread_id?: number;
};

export type SelectFieldItem = {
  value: number;
  label: string;
};

export type MessageParams = MessageData &
  CommunicationContext & {
    member_filters?: MemberFilter | Immutable<MemberFilter>;
    members?: number[];
  };

export type MessageData = {
  subject?: string; // mail title
  email_template?: number; // mail template id
  body?: string; // mail content if no template
  sms?: string; // sms content
  notification_title?: string;
  notification_content?: string;
  member_blacklist?: number[]; // recipients to blacklist
  email_resend_delay?: number;
  email_resend_count?: number;
};

export type CommunicationChannelsList =
  | 'offer_id'
  | 'marketing_notification_id'
  | 'smartlist_id'
  | 'member_id'
  | 'notification_rule';

export type CommunicationFilterParams = {
  filter_kind?: number[];
  filter_channel?: CommunicationChannelsList;
  filter_recipient?: number[];
  filter_send_parameter?: number;
  filter_src_or_dst?: number;
  filter_date_start?: number;
  filter_date_end?: number;
};

export type FilterState = {
  dateStart: DateTime;
  dateEnd: DateTime;
  communicationKinds: SelectFieldItem[];
  recipientTypes: SelectFieldItem[];
  messageChannels?: SelectFieldItem[];
  automatedMessages: SelectFieldItem[];
  messagesOrigin: SelectFieldItem[];
  showFilterModal: boolean;
  allPreviousFilters: { filters: number[]; dateStart: number; dateEnd: number };
};

export type FetchCommunicationParams = {
  page: number;
  page_size?: number;
} & CommunicationContext &
  CommunicationFilterParams;

export type CommunicationDrawerMode = 'write-only' | 'read-only' | 'read-write';

export type SmartlistOptions = {
  scheduledCommunicationDraft?: CommunicationScheduled | null;
  automatedCommunicationDraft?: AutomatedCampaign | null;
  automatedCampaignKind?: number;
  usedAutoCampaignCommMethods?: number[];
};

export type DrawerProps = {
  onDrawerClose: () => void;
  openDrawer: boolean;
  communicationIdentifier: number;
  communicationObjectId: number;
  communicationMember?: Member;
  communicationTitle?: string;
  allMemberCategoryList?: FilteringMemberIdsByGenericCategories;
  mode?: CommunicationDrawerMode;
  smartlistOptions?: SmartlistOptions;
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

// --------INBOX THREAD--------

export type CommunicationThread = {
  id: number;
  title: string;
  cover?: string;
  subtitle?: string;
  last_communication: number;
  last_communication_datetime: string;
  last_communication_content: string;
  last_communication_has_been_read: boolean;
  muted: boolean;
  favorite: boolean;
  disabled: boolean;
  related_object_kind: ChatThreadKinds;
  related_object_id: number;
};

export type CommunicationThreadWithUnreadAnswersCount = CommunicationThread & {
  numberOfUnreadAnswers: number;
};

export type InboxThreadListParams = {
  page?: number;
  related_object_kind?: ChatThreadKinds;
  last_communication_has_been_read?: boolean;
  favorite?: boolean;
  muted?: boolean;
  disabled?: boolean;
  current_item_id?: number;
  search?: string;
};

export type UnreadAnswersCount = {
  communication_thread_id: number;
  unread_answers_count: number;
};

export type FetchInboxThreadListPayload = {
  related_object_kind: ChatThreadKinds;
  fetchedPage: number;
} & GenericPaginationResults<CommunicationThread>;

export type FetchInboxThreadPayload = {
  related_object_kind: ChatThreadKinds;
} & CommunicationThread;

export type InboxThreadRouterProps = {
  contextSelected?: ChatThreadKinds;
  setContextSelected?: (context: ChatThreadKinds, options?: () => void) => void;
  thread?: CommunicationThread;
};

export type SmartListSelectOption = {
  value: number;
  label: string;
  smartlist: SmartList;
};

// COMMUNICATION SCHEDULED

export type CommunicationScheduled = {
  id: number;
  company?: number;
  smartlist: number;
  communication_kind: number;
  text: string;
  email_design?: number;
  title?: string;
  datetime_scheduled: string;
  datetime_sent?: string;
  disabled?: boolean;
  email_resend_delay?: number;
  email_resend_count?: number;
};

export type CommunicationScheduledCreate = {
  smartlist: number;
  communication_kind?: number;
  text?: string;
  email_design?: number;
  title?: string;
  datetime_scheduled: string;
  email_resend_delay?: number;
  email_resend_count?: number;
};

export type CommunicationScheduledFilters = {
  id__in?: number[];
  smartlist_id__in?: number[];
  page?: number;
};

export type CommunicationScheduledFiltersForUniqueSmartlist = {
  smartlistId: number;
  page?: number;
};

export type MemberListIdsByCommunicationKind = {
  email: number[];
  phone: number[];
  notification: number[];
};

export type MemberListDataByCommunicationKind = {
  email: MemberMinimal[];
  phone: MemberMinimal[];
  notification: MemberMinimal[];
};

export type CommunicationIdentifiers = {
  communicationIdentifier: number;
  communicationObjectId: number;
};

export type CommunicationContextQueryParams = {
  id__in?: number[];
  offer_with_selected_categories?: string;
  smartlist?: number;
};

export type FetchFirstReachedRecipientsParams = {
  blacklist_email: number[];
  blacklist_phone: number[];
  blacklist_notification: number[];
} & CommunicationContextQueryParams;

export type AuhtorizedFiltersList = {
  hasDatesFilter: boolean;
  hasRecipientTypesFilter: boolean;
  hasMessageChannelsFilter: boolean;
  hasMessagesOriginFilter: boolean;
  hasAutomatedMessagesFilter: boolean;
  hasCommunicationKindsFilter: boolean;
};
