import { DateTime, Duration } from 'luxon';
import type { MetaActivity } from '#src/libs/meta-activity/types';
import type { OffersGroup } from '#src/libs/group-offer/types';
import {
  Offer,
  MarketplaceOfferStatus,
  Offer_FULL,
  OfferREST,
} from '#src/libs/offer/types';
import { BookingWindowStatus } from '#src/libs/offer/constants';
import { isDateInThePast } from '#src/utils/datetime';
import {
  OFFER_DATE_HOURS_SEPARATOR,
  OFFER_HOURS_SEPARATOR,
  OFFER_NAME_CAPITALIZED_MAX_LENGTH,
  OFFER_NAME_MAX_LENGTH,
} from '#src/libs/marketplace/constants';

/** @deprecated Use `isDateInThePast` instead. */
export function isOfferInThePast(offer: Offer | Offer_FULL | OfferREST) {
  if (!offer) return false;
  return DateTime.fromISO(offer.date_start) < DateTime.now();
}

/**
 * Checks if an offer in a group is locked by a previous offer of this group.
 * 1. If the offer group allows single bookings, then the offer shouldn't be locked
 * 2. Otherwise, if the group contains any past offer, it should be locked
 *
 * @param offerInGroup - The offer in the group to check.
 * @param offerGroup - The group of offers to check in.
 *
 * @returns - Returns true if the offer is locked by a previous offer, false otherwise.
 */
export function isOfferInGroupLockedByPreviousOfferInPast(
  offerInGroup: Offer_FULL,
  offerGroup?: OffersGroup,
) {
  if (offerGroup?.full_booking_only === false) {
    return false;
  }
  if (!offerInGroup?.group || offerGroup?.allow_booking_after_start) {
    return false;
  }
  if (offerGroup?.first_offer_date) {
    return DateTime.fromISO(offerGroup.first_offer_date) <= DateTime.now();
  }
  return (
    DateTime.fromISO(offerInGroup.group.first_offer_date) <= DateTime.now()
  );
}

export function isTooSoonToBookOffer(
  offer: Offer_FULL,
  metaActivity: MetaActivity,
) {
  // If the backend has computed the booking_window_status, then use it in prio
  if (!!offer.booking_window_status)
    return offer.booking_window_status === BookingWindowStatus.NOT_YET_OPEN;

  if (!metaActivity) return false;

  // Otherwise, fallback on this ugly thing with metaActivity
  if (metaActivity.first_booking_minutes_until === 0) {
    return false;
  }

  return (
    DateTime.now() <
    DateTime.fromISO(offer.date_start).minus(
      // Use 'days' unit to properly handle DST changes
      Duration.fromObject({
        minutes: metaActivity.first_booking_minutes_until,
      }).shiftTo('days', 'hours', 'minute'),
    )
  );
}

export const getPositionOfOfferInTheList = (offers: Offer[], index: number) => {
  const position: ('first' | 'last')[] = [];
  if (index === 0) {
    position.push('first');
  }
  if (index === (offers?.length || 1) - 1) {
    position.push('last');
  }
  return position;
};

export const getOfferStatus = (
  offer: Offer | OfferREST,
  metaActivity: MetaActivity,
  isRegistered: boolean,
) => {
  if (!offer) {
    return null;
  }
  // @ts-expect-error
  if (offer.group?.full_booking_only && metaActivity) {
    return getGroupOfferSetAsFullBookingOnlyStatus(
      // @ts-expect-error
      offer,
      metaActivity,
      isRegistered,
    );
  }
  if (isRegistered) {
    return MarketplaceOfferStatus.BOOKED;
  }
  if (!offer.available) {
    return MarketplaceOfferStatus.CANCELLED;
  }
  if (isDateInThePast(offer.date_start)) {
    return MarketplaceOfferStatus.COMPLETED;
  }
  if (offer.full) {
    return MarketplaceOfferStatus.WAITING_LIST;
  }
  // @ts-expect-error
  if (isTooSoonToBookOffer(offer, metaActivity)) {
    return MarketplaceOfferStatus.SOON;
  }
  return MarketplaceOfferStatus.BOOKABLE;
};

export const getGroupOfferSetAsFullBookingOnlyStatus = (
  offer: Offer<number, number, number, number, number, OffersGroup>,
  metaActivity: MetaActivity,
  isRegistered: boolean,
) => {
  // group.full_booking_only has to be true to enter here
  // offer can't be undefined, neither metaActivity

  const { allow_booking_after_start, first_offer_date } = offer.group;

  if (isRegistered) {
    return MarketplaceOfferStatus.BOOKED;
  }
  if (!offer.available) {
    return MarketplaceOfferStatus.CANCELLED;
  }
  if (offer.full) {
    return MarketplaceOfferStatus.WAITING_LIST;
  }
  if (!allow_booking_after_start) {
    if (DateTime.fromISO(first_offer_date) <= DateTime.now()) {
      return MarketplaceOfferStatus.COMPLETED;
    }
    // @ts-expect-error
    if (isTooSoonToBookOffer(offer, metaActivity)) {
      return MarketplaceOfferStatus.SOON;
    }
  } else if (isDateInThePast(offer.date_start)) {
    return MarketplaceOfferStatus.COMPLETED;
  } else if (DateTime.fromISO(first_offer_date) <= DateTime.now()) {
    return MarketplaceOfferStatus.BOOKABLE;
  } else if (
    // @ts-expect-error
    isTooSoonToBookOffer(offer, metaActivity)
  ) {
    return MarketplaceOfferStatus.SOON;
  }
  return MarketplaceOfferStatus.BOOKABLE;
};

export const formatOfferHours = (offerHours: {
  startTime: string;
  endTimeOrDuration: string;
}) => {
  return offerHours.endTimeOrDuration
    ? `${offerHours.startTime}${OFFER_HOURS_SEPARATOR}${offerHours.endTimeOrDuration}`
    : `${offerHours.startTime}`;
};

export const formatOfferDateWithTime = (date: string, hours: string) =>
  `${date}${OFFER_DATE_HOURS_SEPARATOR}${hours}`;

/**
 * Calculates the length of the longest word in a given string.
 *
 * @param {string} inputString The input string containing words.
 * @returns The length of the longest word in the input string,
 * or null if the input string is empty or falsy.
 */
export const getLongestWordLength = (inputString: string) => {
  if (!inputString) return null;
  const wordsArray = inputString.split(/\s+/);

  const wordLengthsArray = wordsArray.map((word) => word.length);

  // Use Math.max and apply to find the maximum length in the array
  const longestWordLength = Math.max(...wordLengthsArray);

  return longestWordLength;
};

/**
 * Determines whether ellipsis should be applied to a given string based on its characteristics.
 *
 * @param {string} inputString The input string to analyze.
 * @returns {boolean} True if ellipsis should be applied, false otherwise.
 */
export const shouldApplyEllipsis = (inputString: string) => {
  if (!inputString) return false;
  const isCapitalized = inputString === inputString.toUpperCase();
  const longestWordLength = getLongestWordLength(inputString);
  if (isCapitalized) {
    return longestWordLength >= OFFER_NAME_CAPITALIZED_MAX_LENGTH;
  }
  return longestWordLength >= OFFER_NAME_MAX_LENGTH;
};
