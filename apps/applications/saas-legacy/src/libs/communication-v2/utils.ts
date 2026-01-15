import { TFunction } from 'i18next';
import { DateTime } from 'luxon';
import memoize from 'memoize-one';
import Immutable from 'seamless-immutable';
import {
  COMMUNICATION_KIND_EMAIL,
  COMMUNICATION_KIND_SMS,
  COMMUNICATION_KIND_PUSH_NOTIFICATION,
} from '@bsport/common/lib/master-data/communication-kind.js';
import {
  COMMUNICATION_RECIPIENT_BOOKINGS,
  COMMUNICATION_RECIPIENT_BOOKINGS_CANCELLED,
  COMMUNICATION_RECIPIENT_WAITING_LIST,
  COMMUNICATION_CHANNEL_SESSION,
  COMMUNICATION_CHANNEL_MARKETING_NOTIFICATION,
  COMMUNICATION_CHANNEL_NOTIFICATION_RULE,
  COMMUNICATION_CHANNEL_SMARTLIST,
  COMMUNICATION_CHANNEL_MESSAGE_DIRECT,
  COMMUNICATION_SEND_PARAMETER_AUTO,
  COMMUNICATION_SEND_PARAMETER_MANUAL,
  COMMUNICATION_SRC_OR_DST_SENT,
  COMMUNICATION_SRC_OR_DST_RECEIVED,
  COMMUNICATION_CHANNEL_CADENCE,
  COMMUNICATION_CHANNEL_FRANCHISE,
} from '@bsport/common/lib/master-data/communication-filters.js';
import { BOOKING_STATUS_OK } from '@bsport/common/lib/master-data/booking_status_code.js';
import { ChatThreadKinds } from '@bsport/common/lib/master-data/communication-inbox.js';

import { Booking, BookingOption } from '#src/libs/booking/types';
import { Member } from '#src/libs/member/types';
import { WaitingListBookingOption } from '#src/libs/waiting-list/types';
import { Tag, TagGroupAPI } from '#src/libs/tag/types';
import { OptionCallback } from '#src/state/types';
import {
  SelectFieldItem,
  CommunicationFilterParams,
  CommunicationMetadata,
  Communication,
  FilteringMemberIdsByGenericCategories,
  InboxThreadListParams,
  CommunicationThread,
  CommunicationThreadWithUnreadAnswersCount,
  CommunicationContext,
  CommunicationContextQueryParams,
  AuhtorizedFiltersList,
} from '#src/libs/communication-v2/types';
import {
  COMMUNICATION_FILTER_IDENTIFIER_CHANNEL,
  COMMUNICATION_FILTER_IDENTIFIER_KIND,
  COMMUNICATION_FILTER_IDENTIFIER_RECIPIENT,
  COMMUNICATION_FILTER_IDENTIFIER_SEND_PARAMETER,
  COMMUNICATION_FILTER_CHANNELS,
  COMMUNICATION_FILTER_KINDS,
  COMMUNICATION_FILTER_RECIPIENTS,
  COMMUNICATION_FILTER_SEND_PARAMETERS,
  COMMUNICATION_FILTER_SRC_OR_DST,
  CONTEXT_MEMBER,
  CONTEXT_OFFER,
  CONTEXT_SMARTLIST,
  CONTEXT_NOTIFICATION,
  CAN_NOT_SEND_BECAUSE_MISSING_RECIPIENTS,
  CAN_NOT_SEND_BECAUSE_DIRECT_MEMBER_HAS_NOT_A_PHONE_NUMBER,
  CAN_NOT_SEND_BECAUSE_MISSING_CONTENT,
  CAN_NOT_SEND_BECAUSE_DIRECT_MEMBER_HAS_NOT_AN_EMAIL,
  COMMUNICATION_FILTER_IDENTIFIER_SRC_OR_DST,
  INBOX_ALL_MESSAGES,
  INBOX_UNREAD_MESSAGES,
  INBOX_FAVORITE_MESSAGES,
  INBOX_MUTED_MESSAGES,
  INBOX_DISABLED_MESSAGES,
  INBOX_THREAD_PAGE_SIZE,
  CONTEXT_CADENCE,
} from '#src/libs/communication-v2/constants';

// #region FILTER CONTAINER

export const getFieldChoicesByIdentifier = memoize(
  (identifier: number, t: TFunction) => {
    switch (identifier) {
      case COMMUNICATION_FILTER_IDENTIFIER_KIND:
        return [
          {
            value: COMMUNICATION_KIND_EMAIL,
            label: t(`campaign.kind.${COMMUNICATION_KIND_EMAIL}`),
          },
          {
            value: COMMUNICATION_KIND_SMS,
            label: t(`campaign.kind.${COMMUNICATION_KIND_SMS}`),
          },
          {
            value: COMMUNICATION_KIND_PUSH_NOTIFICATION,
            label: t(`campaign.kind.${COMMUNICATION_KIND_PUSH_NOTIFICATION}`),
          },
        ];
      case COMMUNICATION_FILTER_IDENTIFIER_CHANNEL:
        return [
          {
            value: COMMUNICATION_CHANNEL_SESSION,
            label: t(`filter.choicesLabels.${COMMUNICATION_CHANNEL_SESSION}`),
          },
          {
            value: COMMUNICATION_CHANNEL_MARKETING_NOTIFICATION,
            label: t(
              `filter.choicesLabels.${COMMUNICATION_CHANNEL_MARKETING_NOTIFICATION}`,
            ),
          },
          {
            value: COMMUNICATION_CHANNEL_NOTIFICATION_RULE,
            label: t(
              `filter.choicesLabels.${COMMUNICATION_CHANNEL_NOTIFICATION_RULE}`,
            ),
          },
          {
            value: COMMUNICATION_CHANNEL_SMARTLIST,
            label: t(`filter.choicesLabels.${COMMUNICATION_CHANNEL_SMARTLIST}`),
          },
          {
            value: COMMUNICATION_CHANNEL_MESSAGE_DIRECT,
            label: t(
              `filter.choicesLabels.${COMMUNICATION_CHANNEL_MESSAGE_DIRECT}`,
            ),
          },
          {
            value: COMMUNICATION_CHANNEL_CADENCE,
            label: t(`filter.choicesLabels.${COMMUNICATION_CHANNEL_CADENCE}`),
          },
          {
            value: COMMUNICATION_CHANNEL_FRANCHISE,
            label: t(`filter.choicesLabels.${COMMUNICATION_CHANNEL_FRANCHISE}`),
          },
        ];
      case COMMUNICATION_FILTER_IDENTIFIER_RECIPIENT:
        return [
          {
            value: COMMUNICATION_RECIPIENT_BOOKINGS,
            label: t(
              `filter.choicesLabels.${COMMUNICATION_RECIPIENT_BOOKINGS}`,
            ),
          },
          {
            value: COMMUNICATION_RECIPIENT_BOOKINGS_CANCELLED,
            label: t(
              `filter.choicesLabels.${COMMUNICATION_RECIPIENT_BOOKINGS_CANCELLED}`,
            ),
          },
          {
            value: COMMUNICATION_RECIPIENT_WAITING_LIST,
            label: t(
              `filter.choicesLabels.${COMMUNICATION_RECIPIENT_WAITING_LIST}`,
            ),
          },
        ];
      case COMMUNICATION_FILTER_IDENTIFIER_SEND_PARAMETER:
        return [
          {
            value: COMMUNICATION_SEND_PARAMETER_AUTO,
            label: t(
              `filter.choicesLabels.${COMMUNICATION_SEND_PARAMETER_AUTO}`,
            ),
          },
          {
            value: COMMUNICATION_SEND_PARAMETER_MANUAL,
            label: t(
              `filter.choicesLabels.${COMMUNICATION_SEND_PARAMETER_MANUAL}`,
            ),
          },
        ];
      case COMMUNICATION_FILTER_IDENTIFIER_SRC_OR_DST:
        return [
          {
            value: COMMUNICATION_SRC_OR_DST_SENT,
            label: t(`filter.choicesLabels.${COMMUNICATION_SRC_OR_DST_SENT}`),
          },
          {
            value: COMMUNICATION_SRC_OR_DST_RECEIVED,
            label: t(
              `filter.choicesLabels.${COMMUNICATION_SRC_OR_DST_RECEIVED}`,
            ),
          },
        ];
      default:
        return undefined;
    }
  },
);

export const getPersonnalizedChoicesByIdentifier = memoize(
  (identifiers: Array<number>, t: TFunction) => {
    const choices: SelectFieldItem[] = [];
    identifiers.forEach((identifier) => {
      choices.push({
        value: identifier,
        label: t(`filter.choicesLabels.${identifier}`),
      });
    });
    return choices;
  },
);

export const getFilterOptionsOverride = memoize(
  (communicationIdentifier: number, t: TFunction) => {
    return {
      communicationKindsOptionsOverride:
        communicationIdentifier === CONTEXT_NOTIFICATION
          ? getPersonnalizedChoicesByIdentifier(
              [COMMUNICATION_KIND_EMAIL, COMMUNICATION_KIND_PUSH_NOTIFICATION],
              t,
            )
          : undefined,
      // in case these filters are overriden in the future
      recipientTypesOptionsOverride: undefined,
      messageChannelsOptionsOverride: undefined,
      automatedMessagesOptionsOverride: undefined,
      messagesOriginOptionsOverride: undefined,
    };
  },
);

export const getFiltersToEnable = memoize(
  (communicationIdentifier: number): AuhtorizedFiltersList => {
    const sharedFilters = {
      hasCommunicationKindsFilter: true,
      hasDatesFilter: true,
      hasMessagesOriginFilter: true,
    };
    switch (communicationIdentifier) {
      case CONTEXT_OFFER:
        return {
          ...sharedFilters,
          hasMessageChannelsFilter: false,
          hasRecipientTypesFilter: true,
          hasAutomatedMessagesFilter: false,
        };
      case CONTEXT_SMARTLIST:
        return {
          ...sharedFilters,
          hasMessageChannelsFilter: false,
          hasRecipientTypesFilter: false,
          hasAutomatedMessagesFilter: true,
        };
      case CONTEXT_MEMBER:
        return {
          ...sharedFilters,
          hasMessageChannelsFilter: true,
          hasRecipientTypesFilter: false,
          hasAutomatedMessagesFilter: false,
        };
      default:
        return {
          ...sharedFilters,
          hasMessageChannelsFilter: false,
          hasRecipientTypesFilter: false,
          hasAutomatedMessagesFilter: false,
        };
    }
  },
);

export const getFiltersToEnableForThread = memoize(
  (relatedObjectKind: ChatThreadKinds) => {
    const sharedFilters = {
      hasCommunicationKindsFilter: true,
      hasDatesFilter: true,
      hasMessagesOriginFilter: true,
    };
    switch (relatedObjectKind) {
      case ChatThreadKinds.Offer:
        return {
          ...sharedFilters,
          hasRecipientTypesFilter: true,
          hasAutomatedMessagesFilter: false,
        };
      case ChatThreadKinds.Smartlist:
        return {
          ...sharedFilters,
          hasRecipientTypesFilter: false,
          hasAutomatedMessagesFilter: true,
        };
      default:
        return {
          ...sharedFilters,
          hasRecipientTypesFilter: false,
          hasAutomatedMessagesFilter: false,
        };
    }
  },
);

// #endregion

// #region THREAD CONTAINER

export const getConsentWarning = memoize(
  (member: Member, kind: number, t: TFunction) => {
    if (!member) {
      return '';
    }
    switch (kind) {
      case COMMUNICATION_KIND_EMAIL:
        return member.accept_email
          ? ''
          : `${t('mail.warningConsent1')}
      ${t('mail.warningConsent2')}`;
      case COMMUNICATION_KIND_SMS:
        return member.accept_sms
          ? ''
          : `${t('sms.warningConsent1')}
      ${t('sms.warningConsent2')}`;
      default:
        return '';
    }
  },
);

/**
 * When we send a communication from the communication chat, we would like to see it appears directly in the message list.
 * However, there could be some active filters. To know if the communication that has just been sent (and which is sent back from the backend),
 * We need to check for each current active filter if the communication has to be filtered out.
 *
 * return true if the communication should not be displayed (filtered out)
 */
export const filterCommunicationThread = memoize(
  (
    communication: Communication,
    filters: {
      numberFilters: number[];
      dateStartFilter: number | null;
      dateEndFilter: number | null;
    },
  ) => {
    const { numberFilters, dateStartFilter, dateEndFilter } = filters;
    // Filter by kind
    const formatedFilters = getFormatedFiltersToFetchCommunicationSent(
      numberFilters,
      dateStartFilter,
      dateEndFilter,
    );
    if (
      !!formatedFilters.filter_kind &&
      !formatedFilters.filter_kind.includes(communication.kind)
    )
      return true;
    // Filter by channel
    const channel =
      COMMUNICATION_FILTER_CHANNELS[
        getChannelFromMetadata(communication.metadata)
      ];
    if (
      !!formatedFilters.filter_channel &&
      !formatedFilters.filter_channel.includes(channel)
    )
      return true;
    // Filter by smartlist : we can only send manual messages => only need to filter out if Automatic campaign is selected
    if (
      !!formatedFilters.filter_send_parameter &&
      formatedFilters.filter_send_parameter ===
        COMMUNICATION_SEND_PARAMETER_AUTO
    )
      return true;
    // Filter out if Received messages is selected
    if (
      !!formatedFilters.filter_src_or_dst &&
      formatedFilters.filter_src_or_dst === COMMUNICATION_SRC_OR_DST_RECEIVED
    )
      return true;
    // Filter by dates
    const today = DateTime.now().toISO();
    if (dateStartFilter) {
      const dateStart = DateTime.fromSeconds(dateStartFilter);
      const diffDaysStart = Math.floor(
        DateTime.fromISO(today).diff(dateStart, 'days').as('days'),
      );

      if (diffDaysStart < 0) return true;
    }
    if (dateEndFilter) {
      const dateEnd = DateTime.fromSeconds(dateEndFilter);
      const diffDaysEnd = Math.floor(
        DateTime.fromISO(today).diff(dateEnd, 'days').as('days'),
      );

      if (diffDaysEnd > 0) return true;
    }
    return false;
  },
);

// #endregion

// #region GENERIC FILTERS BY MEMBER CATEGORY (IN RECIPIENT OR INFORMATION MODAL)

export const getOfferCategories = memoize(
  (
    t: TFunction,
    bookings: Array<Booking>,
    bookingOptionsPending: Array<BookingOption | WaitingListBookingOption>,
  ) => {
    const memberCategoriesInOffer = [
      {
        categoryMemberIdList: bookings
          .filter(
            (booking: Booking) =>
              booking.booking_status_code === BOOKING_STATUS_OK.id,
          )
          .map((booking: Booking) => booking.member),
        categoryLabel: t('communication:dialogReceiverChoice.reservation'),
        categoryIdentifier: COMMUNICATION_RECIPIENT_BOOKINGS,
      },
      {
        categoryMemberIdList: bookingOptionsPending.map(
          (booking: BookingOption) => booking.member,
        ),
        categoryLabel: t('communication:dialogReceiverChoice.waitingList'),
        categoryIdentifier: COMMUNICATION_RECIPIENT_WAITING_LIST,
      },
      {
        categoryMemberIdList: bookings
          .filter(
            (booking: Booking) =>
              booking.booking_status_code !== BOOKING_STATUS_OK.id,
          )
          .map((booking: Booking) => booking.member),
        categoryLabel: t(
          'communication:dialogReceiverChoice.canceledReservation',
        ),
        categoryIdentifier: COMMUNICATION_RECIPIENT_BOOKINGS_CANCELLED,
      },
    ];
    return {
      categories: memberCategoriesInOffer.filter(
        (category) => category.categoryMemberIdList.length > 0,
      ),
      filterPlaceholder: t('communication:recipients'),
    };
  },
);

export const getFilterOptionsForFilteringByMemberCategory = memoize(
  (genericMemberCategories: FilteringMemberIdsByGenericCategories) => {
    const choices: SelectFieldItem[] = [];
    genericMemberCategories.categories.forEach((category) => {
      choices.push({
        value: category.categoryIdentifier,
        label: category.categoryLabel,
      });
    });
    return choices;
  },
);

// #endregion

// #region SEND MESSAGE CONTAINER

export const getValidityTooltipMessage = memoize(
  (validityIdentifier: number, t: TFunction) => {
    switch (validityIdentifier) {
      case CAN_NOT_SEND_BECAUSE_DIRECT_MEMBER_HAS_NOT_AN_EMAIL:
        return t('sendMessage.sendDisabled.missingEmailInDirectMember');
      case CAN_NOT_SEND_BECAUSE_DIRECT_MEMBER_HAS_NOT_A_PHONE_NUMBER:
        return t('sendMessage.sendDisabled.missingPhoneInDirectMember');
      case CAN_NOT_SEND_BECAUSE_MISSING_CONTENT:
        return t('sendMessage.sendDisabled.missingContent');
      case CAN_NOT_SEND_BECAUSE_MISSING_RECIPIENTS:
        return t('sendMessage.sendDisabled.missingRecipients');
      default:
        return '';
    }
  },
);

// To send message, we only have user tags available
// The others are not tackled (unlike in email designs)
export const getAvailableTagsFromContext = memoize(
  (communicationIdentifier: number, tags: { [tag_name: string]: string[] }) => {
    const categories = getAvailableTagsCategoriesByContext(
      communicationIdentifier,
    );
    const selectAllTagsCategories = categories.length === 0;
    if (tags) {
      return Object.entries(tags).reduce((acc, [tagCategory, tagList]) => {
        if (selectAllTagsCategories || categories.includes(tagCategory))
          return {
            ...acc,
            [tagCategory]: tagList,
          };
        return acc;
      }, {});
    }
    return {};
  },
);

export const getAvailableTagsFromThread = memoize(
  (tags: { [tag_name: string]: string[] }) => {
    const categories = ['User', 'Company'];
    if (tags) {
      return Object.entries(tags).reduce((acc, [tagCategory, tagList]) => {
        if (categories.includes(tagCategory))
          return Immutable({
            ...acc,
            [tagCategory]: tagList,
          });
        return Immutable(acc);
      }, {});
    }
    return Immutable({});
  },
);

const getAvailableTagsCategoriesByContext = (
  communicationIdentifier: number,
) => {
  // Keep that function in case one day we would like to apply different kinds depending on the context
  switch (communicationIdentifier) {
    case CONTEXT_MEMBER:
    case CONTEXT_SMARTLIST:
    case CONTEXT_OFFER:
    case CONTEXT_CADENCE:
      return ['User', 'Company'];
    default:
      return [];
  }
};

export const getMemberIdListsFromMemberList = memoize(
  (memberList: Member[]) => {
    const allMemberIds = memberList.map((member: Member) => member.id);
    const allMemberIdsWithoutEmail = memberList
      .filter((member: Member) => !member.email || member.email === '')
      .map((member: Member) => member.id);
    const allMemberIdsWithoutPhone = memberList
      .filter((member: Member) => !member.phone_number || member.email === '')
      .map((member: Member) => member.id);
    return [allMemberIds, allMemberIdsWithoutEmail, allMemberIdsWithoutPhone];
  },
);

// #endregion

// #region CONNECTORS

// SELECTORS
export const getChannelFromMetadata = (metadata: CommunicationMetadata) => {
  if (Object.keys(metadata).length > 0) {
    const key = Object.keys(metadata)[0];
    switch (key) {
      case 'offer_id':
        return COMMUNICATION_CHANNEL_SESSION;
      case 'marketing_notification_id':
        return COMMUNICATION_CHANNEL_MARKETING_NOTIFICATION;
      case 'notification_rule':
      case 'notification_event':
        return COMMUNICATION_CHANNEL_NOTIFICATION_RULE;
      case 'smartlist_id':
      case 'automated_campaign_id':
        return COMMUNICATION_CHANNEL_SMARTLIST;
      case 'member_id':
        return COMMUNICATION_CHANNEL_MESSAGE_DIRECT;
      case 'cadence_marketing_action_id':
        return COMMUNICATION_CHANNEL_CADENCE;
      case 'communication_sent_group_config_id':
        return COMMUNICATION_CHANNEL_FRANCHISE;
      default:
        return undefined;
    }
  } else {
    return undefined;
  }
};

export const getSmartlistChannelFromMetadata = (
  metadata: CommunicationMetadata,
) => {
  if (!metadata) return undefined;
  const metadataKeys = Object.keys(metadata) || [];
  if (metadataKeys.length > 0) {
    // Need to check first automated_campaign_id because in that case, medata contains also a smartlist_id key
    if (metadataKeys.includes('automated_campaign_id'))
      return COMMUNICATION_SEND_PARAMETER_AUTO;
    if (metadataKeys.includes('smartlist_id'))
      return COMMUNICATION_SEND_PARAMETER_MANUAL;
  }
  return undefined;
};

// ACTIONS
export const getFormatedFiltersToFetchCommunicationSent = memoize(
  (
    filters: number[],
    dateStart: number | null,
    dateEnd: number | null,
  ): CommunicationFilterParams => {
    const channelIds: string[] = Object.keys(COMMUNICATION_FILTER_CHANNELS);
    const channelList = filters
      .filter((id: number) => channelIds.includes(id.toString()))
      // @ts-expect-error
      .map((id: number) => COMMUNICATION_FILTER_CHANNELS[id]);
    const channel = channelList?.length > 0 ? channelList : undefined;

    const kindList = filters.filter((id: number) =>
      COMMUNICATION_FILTER_KINDS.includes(id),
    );
    const filter_kind = kindList?.length > 0 ? kindList : undefined;

    const recipientList = filters.filter((id: number) =>
      COMMUNICATION_FILTER_RECIPIENTS.includes(id),
    );
    const filter_recipient =
      recipientList?.length > 0 ? recipientList : undefined;

    const filter_send_parameter = filters.find((id: number) =>
      COMMUNICATION_FILTER_SEND_PARAMETERS.includes(id),
    );

    const filter_src_or_dst = filters.find((id: number) =>
      COMMUNICATION_FILTER_SRC_OR_DST.includes(id),
    );

    const filterParams: CommunicationFilterParams = {};
    // @ts-expect-error
    if (channel) filterParams.filter_channel = channel;
    if (filter_kind) filterParams.filter_kind = filter_kind;
    if (filter_recipient) filterParams.filter_recipient = filter_recipient;
    if (filter_send_parameter)
      filterParams.filter_send_parameter = filter_send_parameter;
    if (filter_src_or_dst) filterParams.filter_src_or_dst = filter_src_or_dst;
    if (dateStart) filterParams.filter_date_start = dateStart;
    if (dateEnd) filterParams.filter_date_end = dateEnd;

    return filterParams;
  },
);

// HOC
/*
To use the Member Viewset, we use already existings filter : offer, smartlist
So we need to format differently our query params for the related endpoints
*/
export const getFormattedQueryParamsFromContext = memoize(
  (
    communicationIdentifier: number,
    communicationObjectId: number,
    memberSelectedCategories: number[],
  ): CommunicationContextQueryParams => {
    switch (communicationIdentifier) {
      case CONTEXT_OFFER:
        return {
          offer_with_selected_categories: `${communicationObjectId}::${formatNumberListIntoString(
            memberSelectedCategories,
          )}`,
        };
      case CONTEXT_SMARTLIST:
        return { smartlist: communicationObjectId };
      case CONTEXT_MEMBER:
        return { id__in: [communicationObjectId] };
      default:
        return {};
    }
  },
);

export const getFormattedQueryParamsFromThread = memoize(
  (
    relatedObjectKind: ChatThreadKinds,
    relatedObjectId: number,
    memberSelectedCategories: number[],
  ) => {
    switch (relatedObjectKind) {
      case ChatThreadKinds.Member:
        return Immutable({ id__in: [relatedObjectId].join(',') });
      case ChatThreadKinds.Smartlist:
        return Immutable({ smartlist: relatedObjectId });
      case ChatThreadKinds.Offer:
        return Immutable({
          offer_with_selected_categories: `${relatedObjectId}::${formatNumberListIntoString(
            memberSelectedCategories,
          )}`,
        });
      default:
        return Immutable({});
    }
  },
);

const formatNumberListIntoString = (number_list: number[]) => {
  return number_list?.length
    ? number_list.slice(1).reduce((acc: string, next: number) => {
        return `${acc},${next}`;
      }, `${number_list[0]}`)
    : '';
};

/**
 * When communications have been sent from an offer,
 * it is possible to filter on the Information Modal by the 3 kinds of members :
 * Bookings, Waiting List anf Cancel bookings (1 kind = 1 category).
 */
export const getFormatedQueryParamsToFetchRecipientPaginatedList = (
  communication: Communication,
  memberSelectedCategories: number[],
) => {
  const offer_id = communication?.metadata?.offer_id;
  if (offer_id) {
    return getFormattedQueryParamsFromContext(
      CONTEXT_OFFER,
      offer_id,
      memberSelectedCategories,
    );
  }
  return {};
};

// #endregion

// Filtering for thread list

export const threadFilteringChoices = memoize(
  (t: TFunction): SelectFieldItem[] => {
    return [
      {
        value: INBOX_ALL_MESSAGES,
        label: t('thread.filter.allThreads'),
      },
      {
        value: INBOX_UNREAD_MESSAGES,
        label: t('thread.filter.hasNotBeenRead'),
      },
      {
        value: INBOX_FAVORITE_MESSAGES,
        label: t('thread.filter.favorites'),
      },
      {
        value: INBOX_MUTED_MESSAGES,
        label: t('thread.filter.muted'),
      },
      {
        value: INBOX_DISABLED_MESSAGES,
        label: t('thread.filter.disabled'),
      },
    ];
  },
);

/**
 * Formats the query params in order to fetch the thread list, according to the filtering conditions
 * @param contextSelected Context in the thread list (member/offer/smartlist)
 * @param filterValue Filter value in the thread list (all/unread/favorite/muted/disabled)
 * @param page Current page (ie 15 threads) in the thread list
 * @param threadId Optionnal id of a thread called directly from the URL
 * @returns A json with the query params formatted
 */
export const threadListQueryParamsSetter = (
  contextSelected: ChatThreadKinds,
  filterValue?: SelectFieldItem,
  page?: number,
  threadId?: number,
  search?: string,
): InboxThreadListParams => {
  const params: InboxThreadListParams = {
    related_object_kind: contextSelected,
  };
  if (filterValue) {
    switch (filterValue.value) {
      case INBOX_ALL_MESSAGES:
        params.disabled = false;
        break;
      case INBOX_UNREAD_MESSAGES:
        params.last_communication_has_been_read = false;
        params.disabled = false;
        break;
      case INBOX_FAVORITE_MESSAGES:
        params.favorite = true;
        params.disabled = false;
        break;
      case INBOX_MUTED_MESSAGES:
        params.muted = true;
        params.disabled = false;
        break;
      case INBOX_DISABLED_MESSAGES:
        params.disabled = true;
        break;
      default:
        params.disabled = false;
    }
  } else {
    params.disabled = false;
  }

  if (threadId) {
    params.current_item_id = threadId;
  } else if (page) {
    params.page = page;
  }

  if (search && search?.length > 3) {
    params.search = search;
  }

  return params;
};

/**
 * Checks if a thread is supposed to be displayed in the thread list according to its status,
 * its related object kind and the filtering conditions
 * @param thread Thread checked
 * @param filterValue Filter value in the thread list (all/unread/favorite/muted/disabled)
 * @returns True if the thread must be displayed, else false
 */
export const isThreadDisplayed = (
  thread: CommunicationThread,
  filterValue: SelectFieldItem,
): boolean => {
  switch (filterValue.value) {
    case INBOX_UNREAD_MESSAGES:
      return !thread.disabled && !thread.last_communication_has_been_read;
    case INBOX_FAVORITE_MESSAGES:
      return !thread.disabled && thread.favorite;
    case INBOX_MUTED_MESSAGES:
      return !thread.disabled && thread.muted;
    case INBOX_DISABLED_MESSAGES:
      return thread.disabled;
    default:
      return !thread.disabled;
  }
};

/**
 * Function doing the fetch of the thread list according to the filtering conditions and fetching the count of
 * unread answers for these threads
 * @param contextSelected Current context in the inbox thread list (member/offer/smartlist)
 * @param filterValue Current filter value in the inbox thread list (unread/favorite/muted/disabled)
 * @param fetchInboxThreadList Function doing the fetch of the inbox thread list
 * @param fetchUnreadAnswersCounts Function doing the fetch of the count of unread answers for a batch of threads
 * @param isThreadListReinitialized Boolean indicating if the thread list must b reinitialized before the fetch
 * in case of a change of context or filter
 * @param page Current page of thread (ie 15 threads)
 * @param threadId Id of an optionnal thread called directly from the URL, allowing to display this thread
 * in the thread whatever its context and its disabled status
 */
export const fetchInboxThreadListWithContextParamsAndUpdateUnreadCounts = (
  contextSelected: ChatThreadKinds,
  filterValue: SelectFieldItem,
  fetchInboxThreadList: (
    params: InboxThreadListParams,
    isThreadListReinitialized?: boolean,
    options?: OptionCallback<CommunicationThread[]>,
  ) => void,
  fetchUnreadAnswersCounts: (
    params: { thread_ids: number[] },
    options?: OptionCallback,
  ) => void,
  isThreadListReinitialized?: boolean,
  page?: number,
  threadId?: number,
  search?: string,
) => {
  const params = threadListQueryParamsSetter(
    contextSelected,
    filterValue,
    page,
    threadId,
    search,
  );

  fetchInboxThreadList(params, isThreadListReinitialized, {
    onSuccess: (results: CommunicationThread[]) => {
      const threadIds = [];
      for (const thread of results) {
        threadIds.push(thread.id);
      }
      if (threadIds.length) {
        const queryParams = { thread_ids: threadIds };
        fetchUnreadAnswersCounts(queryParams);
      }
    },
  });
};

/**
 * Function handling the switch of status of the thread, especially in the case in which the thread
 * is not supposed to be displayed anymore in the current filtering conditions (e.g you remove the favorite status of a
 * thread in the favorite filter).
 * If the thread is not displayed anmymore, the current page of the concerned thread is reloaded from the backend.
 * @param switchStatusAction Action switching the status of a thread
 * @param contextSelected Current context in the inbox thread list
 * @param filterValue Current filter value in the inbox thread list
 * @param threadId Id of the thread switched
 * @param threadList Current list displayed (= inboxThread.{contextSelected}.allIds)
 * @param fetchInboxThreadList Function doing the fetch of the thread list
 * @param fetchUnreadAnswersCounts Function doing the fetch of the count of unread answers for a batch of threads
 * @param unselectThread Function unselecting the current selected thread removing its id from the URL
 * @param getUnreadAnswersCountFromThread Function fetching the count of unread answers for only one thread
 */
export const handleSwitchStatus = (
  switchStatusAction: (
    id: number,
    options?: OptionCallback<CommunicationThread>,
  ) => void,
  contextSelected: ChatThreadKinds,
  filterValue: SelectFieldItem,
  threadId: number,
  threadList: CommunicationThreadWithUnreadAnswersCount[],
  fetchInboxThreadList: (
    params: InboxThreadListParams,
    isThreadListReinitialized?: boolean,
    options?: OptionCallback<CommunicationThread[]>,
  ) => void,
  fetchUnreadAnswersCounts: (
    params: { thread_ids: number[] },
    options?: OptionCallback,
  ) => void,
  getUnreadAnswersCountFromThread?: (
    id: number,
    options?: OptionCallback,
  ) => void,
) => {
  switchStatusAction(threadId, {
    onSuccess: (thread: CommunicationThread) => {
      getUnreadAnswersCountFromThread?.(threadId);
      const isDisplayed = isThreadDisplayed(thread, filterValue);
      if (!isDisplayed) {
        // If the thread musn't be displayed in the current filtering conditions anymore,
        // the page of the modified thread is fetched.
        // It is not the best solution because the position of the threads between the pages
        // may have changed (if a thread in the third page receives an answer, it moves directly
        // at the top of the list in the first page).

        const index =
          threadList.findIndex(
            (communicationThread: CommunicationThread) =>
              communicationThread.id === threadId,
          ) + 1;

        const threadPage = Math.ceil(index / INBOX_THREAD_PAGE_SIZE);

        fetchInboxThreadListWithContextParamsAndUpdateUnreadCounts(
          contextSelected,
          filterValue,
          fetchInboxThreadList,
          fetchUnreadAnswersCounts,
          false,
          threadPage,
        );
      }
    },
  });
};

/**
 * Function doing the fetch of the thread list when a thread is called directly from the URL,
 * in order to display the thread concerned in the thread list whatever its related object kind
 * @param thread Thread called directly from the URL
 * @param fetchInboxThreadListWithContextParams Function doing the fetch of the current page of threads
 * with the current context and filters, and fetching the count of unread answers for these threads
 * @param contextSelected Current context selected in the inbox thread list
 * @param setContextSelected Context setter
 */
const handleFetchInboxThreadListWithContext = (
  thread: CommunicationThread,
  fetchInboxThreadListWithContextParams: (
    isThreadListReinitialized?: boolean,
    nextPage?: number,
    threadId?: number,
  ) => void,
  contextSelected: ChatThreadKinds,
  setContextSelected: (context: ChatThreadKinds, options?: () => void) => void,
) => {
  if (contextSelected !== thread.related_object_kind) {
    setContextSelected(thread.related_object_kind, () => {
      fetchInboxThreadListWithContextParams(true, null, thread.id);
    });
  } else {
    fetchInboxThreadListWithContextParams(true, null, thread.id);
  }
};

/**
 * Function doing the fetch of the threads in the list when a thread is called directly from the URL,
 * allowing to display it in the thread list whatever its disabled status and its related object kind
 * @param thread Thread called directly from the URL
 * @param setFilterValue Thread filter value (all/favorite/muted/disabled) setter
 * @param t Translation function
 * @param fetchInboxThreadListWithContextParams Function doing the fetch of the current page of threads
 * with the current context and filters, and fetching the count of unread answers for these threads
 * @param contextSelected Current context selected in the inbox thread list
 * @param setContextSelected Context setter
 */
export const fetchInboxThreadListFromThreadCalledFromURL = (
  thread: CommunicationThread,
  setFilterValue: (filter: SelectFieldItem, options?: () => void) => void,
  t: TFunction,
  fetchInboxThreadListWithContextParams: (
    isThreadListReinitialized?: boolean,
    nextPage?: number,
    threadId?: number,
  ) => void,
  contextSelected: ChatThreadKinds,
  setContextSelected: (context: ChatThreadKinds, options?: () => void) => void,
) => {
  if (thread.disabled) {
    setFilterValue(threadFilteringChoices(t)[INBOX_DISABLED_MESSAGES], () => {
      handleFetchInboxThreadListWithContext(
        thread,
        fetchInboxThreadListWithContextParams,
        contextSelected,
        setContextSelected,
      );
    });
  } else {
    handleFetchInboxThreadListWithContext(
      thread,
      fetchInboxThreadListWithContextParams,
      contextSelected,
      setContextSelected,
    );
  }
};

export const getFilterTagsFromSmartlist = memoize((filtersSmartlist, tags) => {
  const includedTagsForSmartlist = filtersSmartlist?.included_tags?.map(
    (id: number) => tags.find((tag: Tag<TagGroupAPI>) => tag.id === id),
  );

  const excludedTagsForSmartlist = filtersSmartlist?.excluded_tags?.map(
    (id: number) => tags.find((tag: Tag<TagGroupAPI>) => tag.id === id),
  );

  return Immutable({ includedTagsForSmartlist, excludedTagsForSmartlist });
});

export const getCommunicationContextFromThread = (
  thread: CommunicationThread,
): CommunicationContext => {
  switch (thread.related_object_kind) {
    case ChatThreadKinds.Member:
      return {
        context_identifier: CONTEXT_MEMBER,
        context_object_id: thread.related_object_id,
        thread_id: thread.id,
      };
    case ChatThreadKinds.Smartlist:
      return {
        context_identifier: CONTEXT_SMARTLIST,
        context_object_id: thread.related_object_id,
        thread_id: thread.id,
      };
    case ChatThreadKinds.Offer:
      return {
        context_identifier: CONTEXT_OFFER,
        context_object_id: thread.related_object_id,
        thread_id: thread.id,
      };
    default:
      return { thread_id: thread.id };
  }
};

// utility funcitons to format date for scheduled communication
export const formatDateForScheduledCommunication = (
  date: DateTime | null,
  timezone: string,
) => {
  if (!date) return '';
  const dateToFormat = date ?? DateTime.now();
  const zonedDate = dateToFormat.setZone(timezone);

  return `${zonedDate.toISODate()}T${zonedDate.toFormat('HH:mm')}`;
};
