import React from 'react';
import { ComponentStory, Meta } from '@storybook/react';

import BookerModuleOfferSummary, {
  BookerModuleOfferSummaryForStorybook,
  type Props,
} from '.';
import themeFactoryBot from '#src/libs/theme/factories';
import { offerFactory } from '#src/libs/offer/factories';
import {
  OFFER_WAITING_LIST_STATUS_OPEN,
  OFFER_WAITING_LIST_LOCKED_BY_PENDING_BOOKINGS,
} from '@bsport/common/lib/master-data/waiting-list-status.js';
import {
  OFFER_WAITING_LIST_STATUS_ALREADY_BOOKED,
  OFFER_WAITING_LIST_STATUS_FULL,
} from '@bsport/common/lib/master-data/error-codes/buyable-item-can-not-be-bought.js';

const fakeCompanyTheme = {
  ...themeFactoryBot.companyTheme.createOne(),
  is_tax_excluded_in_marketplace: false,
};

const fakeOffer = offerFactory({
  withCoach: true,
  withEstablishment: true,
  withLevel: true,
  withMetaActivity: true,
});

const offerStatusWithWaitingListOpen = {
  waiting_list_status: OFFER_WAITING_LIST_STATUS_OPEN,
};

const offerStatusWithWaitingListFull = {
  waiting_list_status: OFFER_WAITING_LIST_STATUS_FULL,
};

const offerStatusWithWaitingListAlreadyBooked = {
  waiting_list_status: OFFER_WAITING_LIST_STATUS_ALREADY_BOOKED,
};

const offerStatusWithWaitingListLockedByPendingBookings = {
  waiting_list_status: OFFER_WAITING_LIST_LOCKED_BY_PENDING_BOOKINGS,
};

export default {
  title: 'Library/Booking/BookerModuleOfferSummary',
  component: BookerModuleOfferSummary,
} as Meta<typeof BookerModuleOfferSummaryForStorybook>;

const Template: ComponentStory<typeof BookerModuleOfferSummary> = (
  args: Props,
) => (
  //@ts-expect-error
  <BookerModuleOfferSummaryForStorybook {...args} />
);

export const Loading = Template.bind({});
Loading.args = {
  loading: true,
  offer: fakeOffer,
};

export const BookerModule = Template.bind({});
BookerModule.args = {
  isBookingButtonHidden: true,
  noStyledContainer: true,
  coach: fakeOffer.coach,
  establishment: fakeOffer.establishment,
  loading: false,
  offer: fakeOffer,
  metaActivity: fakeOffer.meta_activity,
  spotId: '26',
  companyTheme: fakeCompanyTheme,
  showEstablishmentAddress: true,
  showCredits: true,
};

export const SpotSelector = Template.bind({});
SpotSelector.args = {
  establishment: fakeOffer.establishment,
  metaActivity: fakeOffer.meta_activity,
  offer: fakeOffer,
  companyTheme: fakeCompanyTheme,
};

export const WaitingListOpen = Template.bind({});
WaitingListOpen.args = {
  coach: fakeOffer.coach,
  confirmLoading: false,
  establishment: fakeOffer.establishment,
  isBookingButtonHidden: false,
  loading: false,
  metaActivity: fakeOffer.meta_activity,
  offer: { ...fakeOffer, full: true },
  offerStatus: offerStatusWithWaitingListOpen,
  onConfirm: () => {},
  price: 150,
  spotId: '26',
  tax: 15,
  companyTheme: fakeCompanyTheme,
};

export const WaitlistAlreadyBooked = Template.bind({});
WaitlistAlreadyBooked.args = {
  ...WaitingListOpen.args,
  offerStatus: offerStatusWithWaitingListAlreadyBooked,
};

export const WaitlistFull = Template.bind({});
WaitlistFull.args = {
  ...WaitingListOpen.args,
  offerStatus: offerStatusWithWaitingListFull,
};

export const WaitingListLockedByPendingBookings = Template.bind({});
WaitingListLockedByPendingBookings.args = {
  ...WaitingListOpen.args,
  offerStatus: offerStatusWithWaitingListLockedByPendingBookings,
};
