import React from 'react';

import { DateTime } from 'luxon';
import { CssComponentsVariantIdentifiers } from '#src/libs/exportable-components/constants';
import {
  MarketplaceCSSComponentConfig,
  MarketplacePage,
  VariationConfigurationChoice,
} from '#src/libs/exportable-components/types';

import { coachFactory } from '#src/libs/associated-coach/factories';
import { BookingFactory } from '#src/libs/booking/factories';
// @ts-expect-error
import ConsumerBookingCardCss from './styles.css?raw';
import ConsumerBookingCard, { ConsumerBookingCardProps } from '.';

const fakeBooking = BookingFactory(1);
const fakeCoach = coachFactory();

const ConsumerBookingCardVariationRegistry = [
  {
    label: 'isBookable',
    choices: [
      { label: 'true', value: 'true' },
      { label: 'false', value: 'false' },
    ],
    default: { label: 'true', value: 'true' },
  },
  {
    label: 'isJoinableOnline',
    choices: [
      { label: 'true', value: 'true' },
      { label: 'false', value: 'false' },
    ],
    default: { label: 'true', value: 'true' },
  },
  {
    label: 'isOnline',
    choices: [
      { label: 'true', value: 'true' },
      { label: 'false', value: 'false' },
    ],
    default: { label: 'false', value: 'false' },
  },
  {
    label: 'isNoShow',
    choices: [
      { label: 'true', value: 'true' },
      { label: 'false', value: 'false' },
    ],
    default: { label: 'false', value: 'false' },
  },
  {
    label: 'isAtHome',
    choices: [
      { label: 'true', value: 'true' },
      { label: 'false', value: 'false' },
    ],
    default: { label: 'false', value: 'false' },
  },
  {
    label: 'isBookedForAGuest',
    choices: [
      { label: 'true', value: 'true' },
      { label: 'false', value: 'false' },
    ],
    default: { label: 'false', value: 'false' },
  },
  {
    label: 'isDetailsDisabled',
    choices: [
      { label: 'true', value: 'true' },
      { label: 'false', value: 'false' },
    ],
    default: { label: 'false', value: 'false' },
  },
  {
    label: 'isJoinableOnlineDisabled',
    choices: [
      { label: 'true', value: 'true' },
      { label: 'false', value: 'false' },
    ],
    default: { label: 'false', value: 'false' },
  },

  {
    label: 'isCancelDisabled',
    choices: [
      { label: 'true', value: 'true' },
      { label: 'false', value: 'false' },
    ],
    default: { label: 'false', value: 'false' },
  },
  {
    label: 'isMoreDisabled',
    choices: [
      { label: 'true', value: 'true' },
      { label: 'false', value: 'false' },
    ],
    default: { label: 'false', value: 'false' },
  },
  {
    label: 'isBookingCancelled',
    choices: [
      { label: 'true', value: 'true' },
      { label: 'false', value: 'false' },
    ],
    default: { label: 'false', value: 'false' },
  },

  {
    label: 'displayWaitingListPosition',
    choices: [
      { label: 'true', value: 'true' },
      { label: 'false', value: 'false' },
    ],
    default: { label: 'true', value: 'true' },
  },
  {
    label: 'displayspotSchedulingPosition',
    choices: [
      { label: 'true', value: 'true' },
      { label: 'false', value: 'false' },
    ],
    default: { label: 'true', value: 'true' },
  },
  {
    label: 'isCancellable',
    choices: [
      { label: 'true', value: 'true' },
      { label: 'false', value: 'false' },
    ],
    default: { label: 'true', value: 'true' },
  },
  {
    label: 'isBookableForAGuest',
    choices: [
      { label: 'true', value: 'true' },
      { label: 'false', value: 'false' },
    ],
    default: { label: 'true', value: 'true' },
  },
  {
    label: 'isMoreDisplayed',
    choices: [
      { label: 'true', value: 'true' },
      { label: 'false', value: 'false' },
    ],
    default: { label: 'true', value: 'true' },
  },
];

type VariationsProps = Omit<
  ConsumerBookingCardProps,
  | 'onBookClick'
  | 'onBookingCancelClick'
  | 'onBookingForAGuestClick'
  | 'onDetailsClick'
  | 'onJoinOnlineClick'
  | 'onSpotSchedulingClick'
  | 'establishmentAddress'
  | 'menuId'
>;

export const CONSUMER_BOOKING_CARD_CONFIGURATION: MarketplaceCSSComponentConfig =
  {
    label: CssComponentsVariantIdentifiers.CONSUMER_BOOKING_CARD,
    css: ConsumerBookingCardCss,
    pages: [MarketplacePage.CONSUMER_SPACE],
    defaultState: {},
    variations: ConsumerBookingCardVariationRegistry,
  };

const usePropsFromVariation = (
  variationsSelected: Record<string, VariationConfigurationChoice>,
): VariationsProps => {
  const isDetailsDisabled =
    variationsSelected?.isDetailsDisabled?.value === 'true';
  const isMoreDisabled = variationsSelected?.isMoreDisabled?.value === 'true';
  const isBookable = variationsSelected?.isBookable?.value === 'true';
  const isBookableDisabled =
    variationsSelected?.isBookableDisabled?.value === 'true';
  const isJoinableOnlineDisabled =
    variationsSelected?.isJoinableOnlineDisabled?.value === 'true';
  const isJoinableOnline =
    variationsSelected?.isJoinableOnline?.value === 'true';
  const isBookingCancelled =
    variationsSelected?.isBookingCancelled?.value === 'true';
  const isOnline = variationsSelected?.isOnline?.value === 'true';
  const isBookedForAGuest =
    variationsSelected?.isBookedForAGuest?.value === 'true';
  const isUnpaid = variationsSelected?.isUnpaid?.value === 'true';
  const isAtHome = variationsSelected?.isAtHome?.value === 'true';
  const isNoShow = variationsSelected?.isNoShow?.value === 'true';
  const displayWaitingListPosition =
    variationsSelected?.displayWaitingListPosition?.value === 'true';
  const displayspotSchedulingPosition =
    variationsSelected?.displayspotSchedulingPosition?.value === 'true';
  const isCancellable = variationsSelected?.isCancellable?.value === 'true';
  const isBookableForAGuest =
    variationsSelected?.isBookableForAGuest?.value === 'true';
  const isMoreDisplayed = variationsSelected?.isMoreDisplayed?.value === 'true';

  return {
    isDetailsDisabled,
    isMoreDisabled,
    isBookableDisabled,
    isJoinableOnlineDisabled,
    isBookable,
    isBookingCancelled,
    isJoinableOnline,
    isOnline,
    isBookedForAGuest,
    isUnpaid,
    isAtHome,
    isNoShow,
    spotSchedulingPosition: displayspotSchedulingPosition && '1',
    waitingListPosition: displayWaitingListPosition && '1',
    isBookableForAGuest,
    isCancellable,
    isMoreDisplayed,
  };
};

export const CONSUMER_BOOKING_CARD_PREVIEW: React.FC<{
  variationsSelected: Record<string, VariationConfigurationChoice>;
}> = React.memo(({ variationsSelected }) => {
  const componentProps = usePropsFromVariation(variationsSelected);
  const emptyFn = () => {};

  return (
    <ConsumerBookingCard
      {...componentProps}
      activityName="Booking's activity"
      coachName={fakeCoach.name}
      coachPhoto={fakeCoach.photo}
      establishmentAddress="Booking's address"
      menuId="consumer-booking-card-preview"
      offerDate={`${DateTime.fromISO(fakeBooking.date).toFormat(
        'EEE dd MMMM',
      )} • ${DateTime.fromISO(fakeBooking.date).toFormat('HH:mm')}`}
      onBookClick={emptyFn}
      onBookingCancelClick={emptyFn}
      onBookingForAGuestClick={emptyFn}
      onDetailsClick={emptyFn}
      onJoinOnlineClick={emptyFn}
      onSpotSchedulingClick={emptyFn}
    />
  );
});
