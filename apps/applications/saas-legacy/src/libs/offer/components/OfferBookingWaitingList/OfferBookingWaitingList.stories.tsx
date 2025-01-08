import React from 'react';
import { ComponentMeta } from '@storybook/react';

import OfferBookingWaitingList, {
  OfferBookingWaitingListForStorybook,
  type Props,
} from '.';
import { offerFactory } from '#src/libs/offer/factory';
import { OfferStatus } from '#src/libs/offer/types';
import { coachFactory } from '#src/libs/associated-coach/factories';
import { meta_activity_factory } from '#src/libs/meta-activity/factory';
import { establishment_factory } from '#src/libs/establishment/factory';

import {
  OFFER_WAITING_LIST_STATUS_OPEN,
  OFFER_WAITING_LIST_LOCKED_BY_PENDING_BOOKINGS,
} from '@bsport/common/master-data/waiting-list-status.js';
import {
  OFFER_WAITING_LIST_STATUS_FULL,
  OFFER_WAITING_LIST_STATUS_ALREADY_BOOKED,
  OFFER_WAITING_LIST_STATUS_CONVERTIBLE,
} from '@bsport/common/master-data/error-codes/buyable-item-can-not-be-bought.js';

const offer = {
  ...offerFactory(),
  full: true,
  coach: coachFactory(),
  meta_activity: meta_activity_factory(1)[0],
  establishment: establishment_factory(1)[0],
};
const getOfferStatusById: (
  waiting_list_status:
    | typeof OFFER_WAITING_LIST_STATUS_OPEN
    | typeof OFFER_WAITING_LIST_STATUS_FULL
    | typeof OFFER_WAITING_LIST_STATUS_ALREADY_BOOKED
    | typeof OFFER_WAITING_LIST_STATUS_CONVERTIBLE
    | typeof OFFER_WAITING_LIST_LOCKED_BY_PENDING_BOOKINGS,
) => {
  [id: number]: OfferStatus;
} = (waiting_list_status) => ({
  [offer.id]: {
    id: 1,
    bookable_status: null,
    waiting_list_status,
    offer_status: null,
    taken_spots: [123],
    blocked_by_tags: false,
    is_registered: false,
  },
});

const OfferBookingWaitingListStatusTemplate = (args: Props) => {
  // @ts-expect-error
  return <OfferBookingWaitingListForStorybook {...args} />;
};

const baseArgs = {
  offer,
  isLoading: false,
  id: offer.id,
  isNoPassCompatibleForBooking: false,
  isPassTabInMarketplaceConfig: true,
  onRegisterToWaitList: () => {},
  onRedirectToCalendar: () => {},
  onRedirectToPass: () => {},
};

export const WaitingListLoading = OfferBookingWaitingListStatusTemplate.bind(
  {},
);
WaitingListLoading.args = {
  ...baseArgs,
  isLoading: true,
  offerStatusById: getOfferStatusById(OFFER_WAITING_LIST_STATUS_OPEN),
};

export const WaitingListOpen = OfferBookingWaitingListStatusTemplate.bind({});
WaitingListOpen.args = {
  ...baseArgs,
  offerStatusById: getOfferStatusById(OFFER_WAITING_LIST_STATUS_OPEN),
};

export const WaitingListAlreadyBooked =
  OfferBookingWaitingListStatusTemplate.bind({});
WaitingListAlreadyBooked.args = {
  ...baseArgs,
  offerStatusById: getOfferStatusById(OFFER_WAITING_LIST_STATUS_ALREADY_BOOKED),
};

export const WaitingListFull = OfferBookingWaitingListStatusTemplate.bind({});
WaitingListFull.args = {
  ...baseArgs,
  offerStatusById: getOfferStatusById(OFFER_WAITING_LIST_STATUS_FULL),
};

export const WaitingListLocked = OfferBookingWaitingListStatusTemplate.bind({});
WaitingListLocked.args = {
  ...baseArgs,
  offerStatusById: getOfferStatusById(
    OFFER_WAITING_LIST_LOCKED_BY_PENDING_BOOKINGS,
  ),
};

export const WaitingListNoPassCompatible =
  OfferBookingWaitingListStatusTemplate.bind({});
WaitingListNoPassCompatible.args = {
  ...baseArgs,
  offerStatusById: getOfferStatusById(OFFER_WAITING_LIST_STATUS_OPEN),
  isNoPassCompatibleForBooking: true,
};

export default {
  title: 'Library/Booking/OfferBookingWaitingList',
  component: OfferBookingWaitingList,
  decorators: [
    (Story) => (
      <div style={{ container: 'bsOfferBookingPage / inline-size' }}>
        <Story />
      </div>
    ),
  ],
} as ComponentMeta<typeof OfferBookingWaitingList>;
