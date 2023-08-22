import moment from 'moment-timezone';
import { TFunction } from 'i18next';
import Immutable from 'seamless-immutable';
import { OFFER_BOOKABLE_STATUS_BOOKABLE } from '@bsport/common/lib/master-data/bookable-status';
import { OFFER_BOOKABLE_STATUS_ALREADY_BOOKED } from '@bsport/common/lib/master-data/error-codes/buyable-item-can-not-be-bought';

import type {
  BOOKING_FOR_GUEST_FREQUENCY,
  OfferStatus,
  Offer_FULL,
} from '#libs/offer/types';
import type { MetaActivity } from '#libs/meta-activity/types';
import { isOfferInThePast, isOfferBookableYet } from './offer';
import { CheckoutItem } from '#libs/checkout/types';
import { AdditionalGuest } from '#libs/booker-module/types';

export const getBookingButtonTraduction = (
  offer: Offer_FULL,
  metaActivity: MetaActivity,
  isRegistered: boolean = false,
  t: TFunction,
) => {
  if (offer?.group?.full_booking_only && metaActivity) {
    return getBookingButtonTraductionForOfferGroupSetAsFullBookingOnly(
      offer,
      metaActivity,
      isRegistered,
      t,
    );
  }
  let text = offer.full
    ? t('translation:marketplace.bookButton.bookOption')
    : t('translation:marketplace.bookButton.book');

  if (isOfferInThePast(offer)) {
    text = t('translation:marketplace.bookButton.isPast');
  }
  if (!offer.available) {
    text = t('translation:marketplace.bookButton.notAvailable');
  }
  if (!isOfferBookableYet(offer, metaActivity)) {
    text = t('translation:marketplace.bookButton.notBookableYet');
  }

  if (isRegistered && offer.available && !isOfferInThePast(offer)) {
    text = t('translation:marketplace.bookButton.alreadyRegistered');
  }
  return text;
};

const getBookingButtonTraductionForOfferGroupSetAsFullBookingOnly = (
  offer: Offer_FULL,
  metaActivity: MetaActivity,
  isRegistered: boolean = false,
  t: TFunction,
) => {
  // group.full_booking_only has to be true to enter here
  const { group } = offer;
  const { allow_booking_after_start, first_offer_date } = group;
  if (isRegistered) {
    return t('translation:marketplace.bookButton.alreadyRegistered');
  }
  if (!offer.available) {
    return t('translation:marketplace.bookButton.notAvailable');
  }
  if (offer.full) {
    return t('translation:marketplace.bookButton.full');
  }

  let text = t('translation:marketplace.bookButton.book');
  if (!allow_booking_after_start) {
    if (moment(first_offer_date).isSameOrBefore(moment())) {
      text = t('translation:marketplace.bookButton.isPast');
    }
    if (
      !moment(first_offer_date)
        .subtract(metaActivity.first_booking_minutes_until, 'minutes')
        .isSameOrBefore(moment())
    ) {
      text = t('translation:marketplace.bookButton.notBookableYet');
    }
  } else if (isOfferInThePast(offer)) {
    return t('translation:marketplace.bookButton.isPast');
  } else if (moment(first_offer_date).isSameOrBefore(moment())) {
    return t('translation:marketplace.bookButton.book');
  } else if (
    !moment(first_offer_date)
      .subtract(metaActivity.first_booking_minutes_until, 'minutes')
      .isSameOrBefore(moment())
  ) {
    text = t('translation:marketplace.bookButton.notBookableYet');
  }
  return text;
};

/**
 * Retrieve the associated text for the tooltip under
 * the guest button according to the offer bookable status
 * @param bookableStatus The current offer bookable status
 * @param allowGuestOffer `true` if the current offer accepts guest bookings
 * @param bookingGuestFrequency Frequency of guest bookings from company theme
 * @param bookingGuestNumberLeft Number of guests left the current member is able to invite
 * @param t t function from i18next
 */
export const getAddGuestTooltipText = (
  bookableStatus: OfferStatus['bookable_status'],
  allowGuestOffer: boolean,
  bookingGuestFrequency: BOOKING_FOR_GUEST_FREQUENCY,
  bookingGuestNumberLeft: number,
  t: TFunction,
) => {
  if (bookableStatus === (undefined || null)) return '';
  if (!allowGuestOffer) {
    return t('booking:offer.bookingForAGuest.bookingStatus.guestNotAllowed');
  }
  if (bookingGuestNumberLeft === 0) {
    return t(
      `booking:offer.bookingForAGuest.guestLimitReached.${bookingGuestFrequency}`,
    );
  }
  // exception for double booking as we still need to be able to book while disabled
  if (bookableStatus === OFFER_BOOKABLE_STATUS_ALREADY_BOOKED) {
    return t(
      `booking:offer.bookingForAGuest.bookingStatus.${OFFER_BOOKABLE_STATUS_BOOKABLE}`,
    );
  }
  return t(`booking:offer.bookingForAGuest.bookingStatus.${bookableStatus}`);
};

/**
 * Retrieve a guest name if booking for a guest in the flow
 * @param checkoutItem Used for activities summary in basket
 * @param checkoutItems Checkout items that can contain guest info
 * @param offerId The offer id associated to the checkout item we want to find in `checkoutItems`
 * @example getGuestBookingName(null, checkoutItems, offer.id)
 */
export const getGuestBookingName = (
  checkoutItems: (Immutable.ImmutableObject<CheckoutItem> | CheckoutItem)[],
  offerId?: number,
) => {
  let guest: AdditionalGuest = null;

  if (checkoutItems && checkoutItems.length === 1 && !offerId) {
    const guestInfos =
      checkoutItems[0].extra_data.offers_data?.[0].extra_data
        ?.additional_guest_info;
    if (Array.isArray(guestInfos) && !!guestInfos[0]) {
      guest = guestInfos[0];
    }
  }
  if (checkoutItems && offerId) {
    // find the checkout item related to the offer id from params
    const guestInfos = checkoutItems?.find(
      (item) => item?.extra_data?.offers_data?.[0]?.offer_id === offerId,
    )?.extra_data?.offers_data?.[0]?.extra_data?.additional_guest_info;
    if (Array.isArray(guestInfos) && !!guestInfos[0]) {
      guest = guestInfos[0];
    }
  }

  return guest
    ? `${guest?.first_name}${guest?.last_name ? ` ${guest?.last_name}` : ''}`
    : '';
};
