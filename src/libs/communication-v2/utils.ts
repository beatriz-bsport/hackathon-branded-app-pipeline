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
  COMMUNICATION_CHANNEL_NOTIFICATION,
  COMMUNICATION_CHANNEL_SMARTLIST,
  COMMUNICATION_CHANNEL_MESSAGE_DIRECT,
  COMMUNICATION_SEND_PARAMETER_AUTO,
  COMMUNICATION_SEND_PARAMETER_MANUAL,
} from '@bsport/common/lib/master-data/communication-filters';
import { BOOKING_STATUS_OK } from '@bsport/common/lib/master-data/booking_status_code';

import { SelectFieldItem } from './types';
import { Booking, BookingOption } from '#libs/booking/types';
import { Member } from '#libs/member/types';

import {
  FILTER_IDENTIFIER_CHANNEL,
  FILTER_IDENTIFIER_KIND,
  FILTER_IDENTIFIER_RECIPIENT,
  FILTER_IDENTIFIER_SEND_PARAMETER,
  CONTEXT_COMMUNICATION,
  CONTEXT_OFFER,
  CONTEXT_SMARTLIST,
  CONTEXT_MEMBER,
  CONTEXT_NOTIFICATION,
  FILTER_CHANNELS,
  FILTER_KINDS,
  FILTER_RECIPIENTS,
  FILTER_SEND_PARAMETERS,
  CHANNELS,
} from './constants';

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
            value: COMMUNICATION_CHANNEL_NOTIFICATION,
            label: t(
              `filter.choicesLabels.${COMMUNICATION_CHANNEL_NOTIFICATION}`,
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
      // @ts-ignore
      channelFilterOptionsOverride: undefined,
      // @ts-ignore
      sendParameterOptionsOverride: undefined,
      // @ts-ignore
      recipientFilterOptionsOverride: undefined,
    };
  },
);

export const getFiltersToEnable = memoize((contextIdentifier: number) => {
  const sharedFilters = {
    hasKindFilter: true,
    hasDatesFilter: true,
  };
  switch (contextIdentifier) {
    case CONTEXT_COMMUNICATION:
      return {
        ...sharedFilters,
        hasChannelFilter: true,
        hasRecipientFilter: false,
        hasSendParameterFilter: false,
      };
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

export const getFiltersByCategory = memoize((filters: number[]) => {
  const filtersByCategory = [
    {
      key: FILTER_IDENTIFIER_CHANNEL,
      value: filters.filter((id: number) => FILTER_CHANNELS.includes(id)),
    },
    {
      key: FILTER_IDENTIFIER_KIND,
      value: filters.filter((id: number) => FILTER_KINDS.includes(id)),
    },
    {
      key: FILTER_IDENTIFIER_RECIPIENT,
      value: filters.filter((id: number) => FILTER_RECIPIENTS.includes(id)),
    },
    {
      key: FILTER_IDENTIFIER_SEND_PARAMETER,
      value: filters.filter((id: number) =>
        FILTER_SEND_PARAMETERS.includes(id),
      ),
    },
  ];
  return filtersByCategory;
});

export const getChannelIdByString = memoize((channel: string) => {
  return CHANNELS.find((element) => element.value === channel).value;
});

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

export const getOfferRecipientsFilters = (
  hasFilters: boolean,
  t: TFunction,
) => {
  return hasFilters
    ? getPersonnalizedChoicesByIdentifier(
        [
          COMMUNICATION_RECIPIENT_BOOKINGS,
          COMMUNICATION_RECIPIENT_BOOKINGS_CANCELLED,
          COMMUNICATION_RECIPIENT_WAITING_LIST,
        ],
        t,
      )
    : null;
};
