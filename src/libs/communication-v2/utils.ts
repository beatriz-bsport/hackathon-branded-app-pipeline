// @ts-nocheck
import { TFunction } from 'i18next';
import memoize from 'memoize-one';
import moment from 'moment-timezone';
import {
  COMMUNICATION_KIND_EMAIL,
  COMMUNICATION_KIND_SMS,
  COMMUNICATION_KIND_PUSH_NOTIFICATION,
} from '@bsport/common/lib/master-data/communication-kind';
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
} from '@bsport/common/lib/master-data/communication-filters';
import { BOOKING_STATUS_OK } from '@bsport/common/lib/master-data/booking_status_code';
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
  INBOX_HAS_NOT_BEEN_READ_MESSAGES,
  INBOX_FAVORITE_MESSAGES,
  INBOX_MUTED_MESSAGES,
  INBOX_DISABLED_MESSAGES,
} from './constants';

import {
  SelectFieldItem,
  CommunicationFilterParams,
  CommunicationMetadata,
  Communication,
  FilteringMemberIdsByGenericCategories,
} from './types';
import { Booking, BookingOption } from '#libs/booking/types';
import { Member } from '#libs/member/types';

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
  (contextIdentifier: number, t: TFunction) => {
    return {
      kindFilterOptionsOverride:
        contextIdentifier === CONTEXT_NOTIFICATION
          ? getPersonnalizedChoicesByIdentifier(
              [COMMUNICATION_KIND_EMAIL, COMMUNICATION_KIND_PUSH_NOTIFICATION],
              t,
            )
          : undefined,
    };
  },
);

export const getFiltersToEnable = memoize((contextIdentifier: number) => {
  const sharedFilters = {
    hasKindFilter: true,
    hasDatesFilter: true,
    hasSrcOrDstFilter: true,
  };
  switch (contextIdentifier) {
    case CONTEXT_OFFER:
      return {
        ...sharedFilters,
        hasChannelFilter: false,
        hasRecipientFilter: true,
        hasSendParameterFilter: false,
      };
    case CONTEXT_SMARTLIST:
      return {
        ...sharedFilters,
        hasChannelFilter: false,
        hasRecipientFilter: false,
        hasSendParameterFilter: true,
      };
    case CONTEXT_MEMBER:
      return {
        ...sharedFilters,
        hasChannelFilter: true,
        hasRecipientFilter: false,
        hasSendParameterFilter: false,
      };
    default:
      return {
        ...sharedFilters,
        hasChannelFilter: false,
        hasRecipientFilter: false,
        hasSendParameterFilter: false,
      };
  }
});

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
 * When we send a communication from the communication chat, we would like to see it appears directly in the thread.
 * However, there could be some active filters. To know if the communication that has just been sent (and which is sent back from the backend),
 * We need to check for each current active filter if the communication has to be filtered out.
 *
 * return true if the communication should not be displayed (filtered out)
 */
export const needToFilterOutReceivedCommunicationSentWithActiveFilters =
  memoize(
    (
      communication: Communication,
      filters: {
        numberFilters: number[];
        dateStartFilter: number;
        dateEndFilter: number;
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
      const today = moment().format();
      if (dateStartFilter) {
        const dateStart = moment.unix(dateStartFilter).format();
        const diffDaysStart = Math.round(
          moment(today).diff(dateStart, 'days', true),
        );
        if (diffDaysStart < 0) return true;
      }
      if (dateEndFilter) {
        const dateEnd = moment.unix(dateEndFilter).format();
        const diffDaysEnd = Math.round(
          moment(today).diff(dateEnd, 'days', true),
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
    bookingOptionsPending: Array<BookingOption>,
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
  (contextIdentifier: number, tags: { [tag_name: string]: string[] }) => {
    const categories = getAvailableTagsCategoriesByContext(contextIdentifier);
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

const getAvailableTagsCategoriesByContext = (contextIdentifier: number) => {
  // Keep that function in case one day we would like to apply different kinds depending on the context
  switch (contextIdentifier) {
    case CONTEXT_MEMBER:
    case CONTEXT_SMARTLIST:
    case CONTEXT_OFFER:
      return ['User', 'Company'];
    default:
      return [];
  }
};

// #endregion
// #region DWELL WITH MEMBER LISTS

export const getMemberListFromFilteredBooking = memoize(
  (
    memberList: Member[],
    bookingList: Booking[],
    bookingPendingList: BookingOption[],
    filters: number[],
  ) => {
    if (filters.length === 0) {
      return memberList;
    }
    const filteredMemberList: Member[] = [];
    if (filters.includes(COMMUNICATION_RECIPIENT_BOOKINGS)) {
      filteredMemberList.concat(
        bookingList
          .filter(
            (booking: Booking) =>
              booking.booking_status_code === BOOKING_STATUS_OK.id,
          )
          .map((booking: Booking) =>
            memberList.find((member: Member) => booking.member === member.id),
          ),
      );
    }
    if (filters.includes(COMMUNICATION_RECIPIENT_BOOKINGS_CANCELLED)) {
      filteredMemberList.concat(
        bookingList
          .filter(
            (booking: Booking) =>
              booking.booking_status_code !== BOOKING_STATUS_OK.id,
          )
          .map((booking: Booking) =>
            memberList.find((member: Member) => booking.member === member.id),
          ),
      );
    }
    if (filters.includes(COMMUNICATION_RECIPIENT_WAITING_LIST)) {
      filteredMemberList.concat(
        bookingPendingList.map((booking: BookingOption) =>
          memberList.find((member: Member) => booking.member === member.id),
        ),
      );
    }
    return filteredMemberList;
  },
);

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
    dateStart: number,
    dateEnd: number,
  ): CommunicationFilterParams => {
    const channelIds: string[] = Object.keys(COMMUNICATION_FILTER_CHANNELS);
    const channelList = filters
      .filter((id: number) => channelIds.includes(id.toString()))
      // @ts-ignore
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
    // @ts-ignore
    if (channel) filterParams.filter_channel = channel;
    // @ts-ignore
    if (filter_kind) filterParams.filter_kind = filter_kind;
    // @ts-ignore
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
export const getFormatedQueryParamsFromContext = memoize(
  (
    contextIdentifier: number,
    contextObjectId: number,
    memberSelectedCategories: number[],
  ) => {
    switch (contextIdentifier) {
      case CONTEXT_MEMBER:
        return { id__in: contextObjectId?.toString() || '' };
      case CONTEXT_OFFER:
        return {
          offer_with_selected_categories: `${contextObjectId}::${formatNumberListIntoString(
            memberSelectedCategories,
          )}`,
        };
      case CONTEXT_SMARTLIST:
        return { smartlist: contextObjectId };
      default:
        return {};
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
    return getFormatedQueryParamsFromContext(
      CONTEXT_OFFER,
      offer_id,
      memberSelectedCategories,
    );
  }
  return {};
};

// #endregion

// Filtering for thread list

export const choices = memoize((t: TFunction): SelectFieldItem[] => {
  return [
    {
      value: INBOX_ALL_MESSAGES,
      label: t('thread.filter.allThreads'),
    },
    {
      value: INBOX_HAS_NOT_BEEN_READ_MESSAGES,
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
});
