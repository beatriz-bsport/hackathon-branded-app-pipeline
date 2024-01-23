// @ts-nocheck
import moment from 'moment-timezone';

import type { MetaActivity } from '#libs/meta-activity/types';
import type { OffersGroup } from '#libs/group-offer/types';
import {
  Offer,
  MarketplaceOfferStatus,
  Offer_FULL,
  OfferREST,
} from '#libs/offer/types';
import {
  OFFER_DATE_HOURS_SEPARATOR,
  OFFER_HOURS_SEPARATOR,
  OFFER_NAME_CAPITALIZED_MAX_LENGTH,
  OFFER_NAME_MAX_LENGTH,
} from '../constants';

/** @deprecated Use `isDateInThePast` instead. */
export function isOfferInThePast(offer: Offer | Offer_FULL | OfferREST) {
  if (!offer) return false;
  return moment(offer.date_start).isBefore(moment());
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
  if (offerGroup?.first_offer_date) {
    return moment(offerGroup.first_offer_date).isSameOrBefore(moment());
  }
  if (!offerInGroup?.group || offerInGroup.group.allow_booking_after_start) {
    return false;
  }
  return moment(offerInGroup.group.first_offer_date).isSameOrBefore(moment());
}

export function isOfferBookableYet(
  offer: Offer_FULL,
  metaActivity: MetaActivity,
) {
  if (metaActivity && !metaActivity.first_booking_minutes_until) {
    return true;
  }
  if (metaActivity) {
    return moment(offer.date_start)
      .add(-metaActivity.first_booking_minutes_until, 'minutes')
      .isSameOrBefore(moment());
  }
  return null;
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
  offer: Offer,
  metaActivity: MetaActivity,
  isRegistered: boolean,
) => {
  if (!offer) {
    return null;
  }
  if (offer.group?.full_booking_only && metaActivity) {
    return getGroupOfferSetAsFullBookingOnlyStatus(
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
  if (isOfferInThePast(offer)) {
    return MarketplaceOfferStatus.COMPLETED;
  }
  if (offer.full) {
    return MarketplaceOfferStatus.WAITING_LIST;
  }
  if (!isOfferBookableYet(offer, metaActivity)) {
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
    if (moment(first_offer_date).isSameOrBefore(moment())) {
      return MarketplaceOfferStatus.COMPLETED;
    }
    if (
      !moment(first_offer_date)
        .subtract(metaActivity?.first_booking_minutes_until, 'minutes')
        .isSameOrBefore(moment())
    ) {
      return MarketplaceOfferStatus.SOON;
    }
  } else if (isOfferInThePast(offer)) {
    return MarketplaceOfferStatus.COMPLETED;
  } else if (moment(first_offer_date).isSameOrBefore(moment())) {
    return MarketplaceOfferStatus.BOOKABLE;
  } else if (
    !moment(first_offer_date)
      .subtract(metaActivity?.first_booking_minutes_until, 'minutes')
      .isSameOrBefore(moment())
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
