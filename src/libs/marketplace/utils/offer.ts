// @ts-nocheck
import moment from 'moment-timezone';

import type { MetaActivity } from '#libs/meta-activity/types';
import type { OffersGroup } from '#libs/group-offer/types';
import { Offer, MarketplaceOfferStatus, Offer_FULL } from '#libs/offer/types';

export function isOfferInThePast(offer: Offer | Offer_FULL) {
  if (!offer) return false;
  return moment(offer.date_start).isBefore(moment());
}

export function firstOfferInGroupLocksBookingBecauseInPast(
  offerInGroup: Offer_FULL,
  offerGroup?: OffersGroup,
) {
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
