import React from 'react';
import { ConsumerBookingCardStorybook, ConsumerBookingCardProps } from '.';
import { ComponentMeta, ComponentStory } from '@storybook/react';
import { BookingFactory } from '#libs/booking/factories';
import { coachFactory } from '#libs/associated-coach/factories';
import { meta_activity_factory } from '#libs/meta-activity/factory';
import { establishment_factory } from '#libs/establishment/factory';

ConsumerBookingCardStorybook.displayName = 'ConsumerBookingCard';

const fakeBooking = BookingFactory(1);
const fakeCoach = coachFactory();
const fakeActivity = meta_activity_factory(1)[0];
const fakeEstablishment = establishment_factory(1)[0];

const ConsumerBookingCardTemplate: ComponentStory<
  typeof ConsumerBookingCardStorybook
> = (args: ConsumerBookingCardProps) => {
  return <ConsumerBookingCardStorybook {...args} />;
};

const defaultArgs = {
  offerDate: fakeBooking.date,
  activityName: fakeActivity.name,
  establishmentAddress: fakeEstablishment.location.address,
  coachName: fakeCoach.name,
  coachPhoto: fakeCoach.photo,
  waitingListPosition: '1',
  spotSchedulingPosition: '2',
};

const withEverythingDisplayed = {
  ...defaultArgs,
  isBookedForAGuest: true,
  isUnpaid: true,
  isOnline: true,
  isAtHome: true,
  isNoShow: true,
  isBookable: true,
  isJoinableOnline: true,
  isMoreDisplayed: true,
  isCancellable: true,
  isBookableForAGuest: true,
  menuId: 'consumer-booking-card-menu-storybook-all',
};

export const ConsumerBookingCardEverythingDisplayed =
  ConsumerBookingCardTemplate.bind({});
ConsumerBookingCardEverythingDisplayed.args = withEverythingDisplayed;

export const ConsumerBookingCardCancelled = ConsumerBookingCardTemplate.bind(
  {},
);
ConsumerBookingCardCancelled.args = {
  ...defaultArgs,
  isBookingCancelled: true,
};

export const ConsumerBookingCardWithSecondaryButtonsHidden =
  ConsumerBookingCardTemplate.bind({});
ConsumerBookingCardWithSecondaryButtonsHidden.args = {
  ...defaultArgs,
  isCancellable: true,
  isBookableForAGuest: true,
  menuId: 'consumer-booking-card-menu-storybook',
};

export const ConsumerBookingCardWithSecondaryButtonsDisplayed =
  ConsumerBookingCardTemplate.bind({});
ConsumerBookingCardWithSecondaryButtonsDisplayed.args = {
  ...defaultArgs,
  isCancellable: true,
  isBookableForAGuest: true,
};

export default {
  title: 'ConsumerSpace/ConsumerBookingCard',
  component: ConsumerBookingCardStorybook,
  argTypes: {
    offerDate: { description: 'Offer date', control: 'date' },
    establishmentAddress: { description: 'Offer address', control: 'text' },
    activityName: {
      description: 'Name of the activity',
      control: 'text',
      defaultValue: '',
    },
    coachPhoto: {
      description: 'Photo of the coach',
      control: 'text',
      defaultValue: '',
    },
    coachName: {
      description: 'Name of the coach',
      control: 'text',
      defaultValue: '',
    },
    spotSchedulingPosition: {
      description: 'Position on the spot schedule',
      control: 'text',
      defaultValue: '',
    },
    waitingListPosition: {
      description: 'Position on the waiting list',
      control: 'text',
      defaultValue: '',
    },
    isBookingCancelled: {
      description: 'Booking cancelled',
      control: 'boolean',
      defaultValue: false,
    },
    isOnline: {
      description: 'Booking session is online',
      control: 'boolean',
      defaultValue: false,
    },
    isBookedForAGuest: {
      description: 'Booking is for a guest',
      control: 'boolean',
      defaultValue: false,
    },
    isUnpaid: {
      description: 'Booking is unpaid',
      control: 'boolean',
      defaultValue: false,
    },
    isAtHome: {
      description: 'Booking is at home',
      control: 'boolean',
      defaultValue: false,
    },
    isNoShow: {
      description: 'Booking is in the past',
      control: 'boolean',
      defaultValue: false,
    },
    isBookable: {
      description: 'Booking is bookable',
      control: 'boolean',
      defaultValue: false,
    },
    isBookableDisabled: {
      description: 'Book button is disabled',
      control: 'boolean',
      defaultValue: false,
    },
    isJoinableOnline: {
      description: 'Booking is joinable online',
      control: 'boolean',
      defaultValue: false,
    },
    isJoinableOnlineDisabled: {
      description: 'Join online button is disabled',
      control: 'boolean',
      defaultValue: false,
    },
    isMoreDisplayed: {
      description: 'More is displayed instead of secondary buttons',
      control: 'boolean',
      defaultValue: false,
    },
    isCancellable: {
      description:
        'Secondary button/menuitem which is displayed when booking is cancellable',
      control: 'boolean',
      defaultValue: false,
    },
    isBookableForAGuest: {
      description:
        'Secondary button/menuitem which is displayed when booking is bookable for a guest',
      control: 'boolean',
      defaultValue: false,
    },
  },
} as ComponentMeta<typeof ConsumerBookingCardStorybook>;
