import { TFunction } from 'i18next';
// @ts-ignore
import memoize from 'memoize-one';
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
  FILTER_IDENTIFIER_CHANNEL,
  FILTER_IDENTIFIER_KIND,
  FILTER_IDENTIFIER_RECIPIENT,
  FILTER_IDENTIFIER_SEND_PARAMETER,
  FILTER_CHANNELS,
  FILTER_KINDS,
  FILTER_RECIPIENTS,
  FILTER_SEND_PARAMETERS,
  FILTER_SRC_OR_DST,
  CONTEXT_MEMBER,
  CONTEXT_OFFER,
  CONTEXT_SMARTLIST,
  CONTEXT_NOTIFICATION,
  CAN_NOT_SEND_BECAUSE_MISSING_RECIPIENTS,
  CAN_NOT_SEND_BECAUSE_DIRECT_MEMBER_HAS_NOT_A_PHONE_NUMBER,
  CAN_NOT_SEND_BECAUSE_MISSING_CONTENT,
  CAN_NOT_SEND_BECAUSE_DIRECT_MEMBER_HAS_NOT_AN_EMAIL,
  FILTER_IDENTIFIER_SRC_OR_DST,
} from './constants';

import {
  SelectFieldItem,
  FilterParams,
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
      case FILTER_IDENTIFIER_KIND:
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
      case FILTER_IDENTIFIER_CHANNEL:
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
      case FILTER_IDENTIFIER_RECIPIENT:
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
      case FILTER_IDENTIFIER_SEND_PARAMETER:
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
      case FILTER_IDENTIFIER_SRC_OR_DST:
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
  (contextIdentifier: number) => {
    switch (contextIdentifier) {
      case CONTEXT_MEMBER:
      case CONTEXT_SMARTLIST:
      case CONTEXT_OFFER:
        return {
          User: ['firstname', 'lastname'],
          Company: [
            'android_app_URL',
            'ios_app_URL',
            'company_logo',
            'company',
            'login_url',
            'company_scheduleURL',
            'company_facebookURL',
            'company_instagramURL',
            'company_websiteURL',
            'company_info',
          ],
        };
      default:
        return {
          Offer: [
            'activity',
            'coach',
            'date',
            'establishment',
            'establishment_practical_info',
            'address',
          ],
          BillingPlan: [
            'subscription_name',
            'subscription_recurrent_price',
            'subscription_nb_months',
            'subscription_flat_fee',
            'subscription_payment_method',
            'subscription_nb_days_pause',
            'subscription_next_invoice_date',
          ],
          User: ['firstname', 'lastname', 'unsubscribe_link'],
          Booking: [
            'activity',
            'coach',
            'date',
            'establishment',
            'establishment_practical_info',
            'address',
            'ics_calendar_link',
            'spot',
            'canceled_grouped_session',
          ],
          PrivateConsumerPass: [
            'pass_price',
            'pass_name',
            'pass_starting_date',
            'pass_expiration',
            'pass_credit_left',
          ],
          PrivateBooking: [
            'activity',
            'coach',
            'date',
            'address',
            'establishment',
            'establishment_practical_info',
            'ics_calendar_link',
          ],
          ConsumerPaymentPack: [
            'pass_price',
            'pass_name',
            'pass_starting_date',
            'pass_expiration',
            'pass_credit_left',
          ],
          BookingOption: [
            'activity',
            'coach',
            'date',
            'establishment',
            'establishment_practical_info',
            'address',
            'option_payment_url',
            'option_expiration_date',
          ],
          Company: [
            'android_app_URL',
            'ios_app_URL',
            'company_logo',
            'company',
            'login_url',
            'company_scheduleURL',
            'company_facebookURL',
            'company_instagramURL',
            'company_websiteURL',
            'company_info',
          ],
        };
    }
  },
);

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

// ACTIONS
export const getFormatedFiltersToFetchCommunicationSent = memoize(
  (filters: number[], dateStart: number, dateEnd: number): FilterParams => {
    const channelIds: string[] = Object.keys(FILTER_CHANNELS);
    const channelList = filters
      .filter((id: number) => channelIds.includes(id.toString()))
      // @ts-ignore
      .map((id: number) => FILTER_CHANNELS[id]);
    const channel = channelList?.length > 0 ? channelList : undefined;

    const kindList = filters.filter((id: number) => FILTER_KINDS.includes(id));
    const filter_kind = kindList?.length > 0 ? kindList : undefined;

    const recipientList = filters.filter((id: number) =>
      FILTER_RECIPIENTS.includes(id),
    );
    const filter_recipient =
      recipientList?.length > 0 ? recipientList : undefined;

    const filter_send_parameter = filters.find((id: number) =>
      FILTER_SEND_PARAMETERS.includes(id),
    );

    const filter_src_or_dst = filters.find((id: number) =>
      FILTER_SRC_OR_DST.includes(id),
    );

    const filterParams: FilterParams = {};
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
    const categoryListing = memberSelectedCategories?.length
      ? memberSelectedCategories
          .slice(1)
          .reduce((acc: string, next: number) => {
            return `${acc},${next}`;
          }, `${memberSelectedCategories[0]}`)
      : '';
    switch (contextIdentifier) {
      case CONTEXT_MEMBER:
        return { id__in: [contextObjectId] };
      case CONTEXT_OFFER:
        return {
          offer_with_selected_categories: `${contextObjectId}::${categoryListing}`,
        };
      case CONTEXT_SMARTLIST:
        return { smartlist: contextObjectId };
      default:
        return {};
    }
  },
);

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
