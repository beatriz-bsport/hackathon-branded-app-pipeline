import moment from 'moment-timezone';
import { TFunction } from 'i18next';
import Immutable from 'seamless-immutable';
import { OFFER_BOOKABLE_STATUS_BOOKABLE } from '@bsport/common/lib/master-data/bookable-status';
import { OFFER_BOOKABLE_STATUS_ALREADY_BOOKED } from '@bsport/common/lib/master-data/error-codes/buyable-item-can-not-be-bought';

import type {
  BOOKING_FOR_GUEST_FREQUENCY,
  Offer,
  OfferStatus,
  Offer_FULL,
} from '#libs/offer/types';
import type { MetaActivity } from '#libs/meta-activity/types';
import { isOfferInThePast, isOfferBookableYet } from './offer';
import { CheckoutItem } from '#libs/checkout/types';
import { AdditionalGuest } from '#libs/booker-module/types';
import {
  Establishment,
  EstablishmentBillingGroup,
} from '#libs/establishment/types';

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
    if (!metaActivity.first_booking_minutes_until) {
      text = t('translation:marketplace.bookButton.book');
    } else if (
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

/**
 * This function is used in the marketplace to find an establishment billing group in the basket offers, if there is one.
 *
 * @param enableMultiLocalisation - A flag indicating whether multilocalisation is enabled. If false, or undefined, the function does nothing.
 * @param establishmentBillingGroups - An array of establishment billing groups.
 * @param basketOffers - An array of basket offers.
 *
 * The function first checks if multilocalisation is enabled and if there are any basket offers and establishment billing groups.
 * If these conditions are met, it then tries to find a billing group in the offers. If it finds one and it's not disabled, it returns this as the default billing group.
 * If it doesn't find one, it returns null.
 */
export const loadDefaultEstablishmentBillingGroupFromOffers = (
  enableMultiLocalisation: boolean,
  establishmentBillingGroups: EstablishmentBillingGroup[],
  basketOffers?: Offer<number, Establishment | number, MetaActivity>[],
) => {
  if (!enableMultiLocalisation) return null;
  if (basketOffers?.length && establishmentBillingGroups?.length) {
    const basketEstablishmentIds = basketOffers.map(
      (offer) =>
        (offer.establishment as Establishment)?.id ||
        (offer.establishment as number),
    );
    const establishmentBillingGroupsByEstablishment: {
      [key: string]: EstablishmentBillingGroup;
    } = establishmentBillingGroups.reduce(
      (acc, establishmentBillingGroup) => ({
        ...acc,
        ...establishmentBillingGroup.establishments.reduce(
          (_acc, establishment) => ({
            ..._acc,
            [establishment.toString()]: establishmentBillingGroup,
          }),
          {},
        ),
      }),
      {},
    );
    const defaultBillingGroupFromOffers = basketEstablishmentIds
      .map((id) => establishmentBillingGroupsByEstablishment?.[id])
      .find((establishmentBillingGroup) => !!establishmentBillingGroup);
    if (defaultBillingGroupFromOffers?.disabled === false) {
      return defaultBillingGroupFromOffers;
    }
  }
  return null;
};

/**
 * This function is used in the marketplace to update the default establishment billing group.
 *
 * @param enableMultilocalisation - A flag indicating whether multilocalisation is enabled. If false, or undefined, the function does nothing.
 * @param selectedEstablishmentBillingGroup - The currently selected establishment billing group.
 * @param setSelectedEstablishmentBillingGroup - A function to set the selected establishment billing group.
 * @param setIsEstablishmentBillingGroupSelected - A function to set whether an establishment billing group is selected.
 * @param prevProps - The previous properties, including the default establishment billing group, the establishment billing groups, and the basket offers.
 * @param newProps - The new properties, including the default establishment billing group, the establishment billing groups, and the basket offers.
 *
 * The function first checks if multilocalisation is enabled and if there are any changes in the default establishment billing group, the establishment billing groups, or the basket offers.
 * If there are changes, it then tries to find a billing group in the offers. If it finds one, it sets this as the selected establishment billing group.
 * If it doesn't find one, it checks the member's default establishment billing group. If this is not disabled, it sets this as the selected establishment billing group.
 * If no establishment billing group is selected or pre-selected, it sets the establishment billing group as not selected.
 * The function returns the selected establishment billing group, or null if no establishment billing group was selected.
 */
export const loadDefaultEstablishmentBillingGroup = (
  enableMultilocalisation: boolean,
  selectedEstablishmentBillingGroup: EstablishmentBillingGroup,
  setSelectedEstablishmentBillingGroup: (_: EstablishmentBillingGroup) => void,
  setIsEstablishmentBillingGroupSelected: (_: boolean) => void,
  prevProps: {
    defaultEstablishmentBillingGroup: EstablishmentBillingGroup;
    establishmentBillingGroups: EstablishmentBillingGroup[];
    basketOffers?: Offer<number, Establishment, MetaActivity>[];
  },
  newProps: {
    defaultEstablishmentBillingGroup: EstablishmentBillingGroup;
    establishmentBillingGroups: EstablishmentBillingGroup[];
    basketOffers?: Offer<number, Establishment, MetaActivity>[];
  },
) => {
  if (
    enableMultilocalisation &&
    // Member default establishment billing group has been fetched
    (prevProps.defaultEstablishmentBillingGroup !==
      newProps.defaultEstablishmentBillingGroup ||
      // New data on establishment billing groups
      prevProps.establishmentBillingGroups !==
        newProps.establishmentBillingGroups ||
      // New basket offers data
      prevProps.basketOffers !== newProps.basketOffers)
  ) {
    // ---- 1ST STEP : LOOK FOR A BILLING GROUP IN THE OFFERS ----
    const defaultBillingGroupFromOffers =
      loadDefaultEstablishmentBillingGroupFromOffers(
        enableMultilocalisation,
        newProps.establishmentBillingGroups,
        newProps.basketOffers,
      );
    if (defaultBillingGroupFromOffers) {
      setSelectedEstablishmentBillingGroup(defaultBillingGroupFromOffers);
      setIsEstablishmentBillingGroupSelected(!!defaultBillingGroupFromOffers);
      return defaultBillingGroupFromOffers;
    }
    // ---- 2ND STEP : LOOK AT THE MEMBER'S DEFAULT ESTABLISHMENT BILLING ----
    if (
      newProps.defaultEstablishmentBillingGroup &&
      newProps.defaultEstablishmentBillingGroup?.disabled === false
    ) {
      setSelectedEstablishmentBillingGroup(
        newProps.defaultEstablishmentBillingGroup,
      );
      setIsEstablishmentBillingGroupSelected(true);
      return newProps.defaultEstablishmentBillingGroup;
    }
    // ---- FINAL STEP : IF NO ESTABLISHMENT BILLING GROUP SELECTED OR PRE-SELECTED ----
    if (
      newProps.establishmentBillingGroups.length &&
      !selectedEstablishmentBillingGroup
    ) {
      setIsEstablishmentBillingGroupSelected(false);
    }
  }
  return null;
};
