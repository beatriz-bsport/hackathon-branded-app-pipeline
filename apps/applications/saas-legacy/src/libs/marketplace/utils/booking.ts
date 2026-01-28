import { TFunction } from 'i18next';
import isEqual from 'lodash/isEqual';
import Immutable from 'seamless-immutable';
import { OFFER_BOOKABLE_STATUS_BOOKABLE } from '@bsport/common/lib/master-data/bookable-status.js';
import { OFFER_BOOKABLE_STATUS_ALREADY_BOOKED } from '@bsport/common/lib/master-data/error-codes/buyable-item-can-not-be-bought.js';

import { DateTime } from 'luxon';
import type {
  BOOKING_FOR_GUEST_FREQUENCY,
  Offer,
  OfferStatus,
  Offer_FULL,
} from '#src/libs/offer/types';
import type { MetaActivity } from '#src/libs/meta-activity/types';
import { CheckoutItem } from '#src/libs/checkout/types';
import { AdditionalGuest } from '#src/libs/booker-module/types';
import {
  Establishment,
  EstablishmentBillingGroup,
} from '#src/libs/establishment/types';
import { isDateInThePast } from '#src/utils/datetime';
import { isTooSoonToBookOffer } from './offer';

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

  if (isDateInThePast(offer.date_start)) {
    text = t('translation:marketplace.bookButton.isPast');
  }
  if (!offer.available) {
    text = t('translation:marketplace.bookButton.notAvailable');
  }
  if (isTooSoonToBookOffer(offer, metaActivity)) {
    text = t('translation:marketplace.bookButton.notBookableYet');
  }

  if (isRegistered && offer.available && !isDateInThePast(offer.date_start)) {
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
  const { group } = offer;
  const { allow_booking_after_start, first_offer_date } = group;

  // Already booked
  if (isRegistered) {
    return t('translation:marketplace.bookButton.alreadyRegistered');
  }

  // Offer not available or full
  if (!offer.available) {
    return t('translation:marketplace.bookButton.notAvailable');
  }
  if (offer.full) {
    return t('translation:marketplace.bookButton.full');
  }

  // After this point, the offer is available and not full
  const now = DateTime.now();
  const firstOfferDate = DateTime.fromISO(first_offer_date);

  // Booking not allowed after session starts
  if (!allow_booking_after_start) {
    if (firstOfferDate <= now) {
      return t('translation:marketplace.bookButton.isPast');
    }

    return isTooSoonToBookOffer(offer, metaActivity)
      ? t('translation:marketplace.bookButton.notBookableYet')
      : t('translation:marketplace.bookButton.book');
  }

  if (isDateInThePast(offer.date_start)) {
    return t('translation:marketplace.bookButton.isPast');
  }

  if (firstOfferDate <= now) {
    return t('translation:marketplace.bookButton.book');
  }

  if (isTooSoonToBookOffer(offer, metaActivity)) {
    return t('translation:marketplace.bookButton.notBookableYet');
  }

  return t('translation:marketplace.bookButton.book');
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
  if (bookableStatus === undefined || bookableStatus === null) {
    return '';
  }
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
 * The billing group must match all the offers from the basket: of some offers have different billing groups, then it returns null.
 *
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
    const billingGroupFromOffers = basketEstablishmentIds
      .map((id) => establishmentBillingGroupsByEstablishment?.[id])
      .filter((establishmentBillingGroup) => !!establishmentBillingGroup);
    if (billingGroupFromOffers.length >= 1) {
      const defaultBillingGroupFromOffers = billingGroupFromOffers.every(
        (establishmentBillingGroup) =>
          establishmentBillingGroup.id === billingGroupFromOffers[0].id,
      )
        ? billingGroupFromOffers[0]
        : null;
      if (defaultBillingGroupFromOffers?.disabled === false) {
        return defaultBillingGroupFromOffers;
      }
    }
  }
  return null;
};

/**
 * This function is used in the marketplace to update the default establishment billing group.
 *
 * @param enableMultilocalisation - A flag indicating whether multilocalisation is enabled. If false, or undefined, the function does nothing.
 * @param selectedEstablishmentBillingGroup - The currently selected establishment billing group.
 * @param isEstablishmentBillingGroupSelected - A state variable, telling if the establishment billing group is selected or not.
 * @param setSelectedEstablishmentBillingGroup - A function to set the selected establishment billing group.
 * @param setIsEstablishmentBillingGroupSelected - A function to set whether an establishment billing group is selected.
 * @param prevProps - The previous properties, including the default establishment billing group, the establishment billing groups with its loading state, and the basket offers.
 * @param newProps - The new properties, including the default establishment billing group, the establishment billing groups its loading state, and the basket offers.
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
  isEstablishmentBillingGroupSelected: boolean,
  setSelectedEstablishmentBillingGroup: (_: EstablishmentBillingGroup) => void,
  setIsEstablishmentBillingGroupSelected: (_: boolean) => void,
  prevProps: {
    defaultEstablishmentBillingGroup: EstablishmentBillingGroup;
    establishmentBillingGroups: EstablishmentBillingGroup[];
    basketOffers?: Offer<number, Establishment, MetaActivity>[];
    establishmentBillingGroupLoading?: boolean;
  },
  newProps: {
    defaultEstablishmentBillingGroup: EstablishmentBillingGroup;
    establishmentBillingGroups: EstablishmentBillingGroup[];
    basketOffers?: Offer<number, Establishment, MetaActivity>[];
    establishmentBillingGroupLoading?: boolean;
  },
) => {
  const incomingBasketData = !isEqual(
    prevProps.basketOffers,
    newProps.basketOffers,
  );
  const incomingDefaultEstablishmentBillingGroup =
    prevProps.defaultEstablishmentBillingGroup !==
    newProps.defaultEstablishmentBillingGroup;
  const incomingEstablishmentBillingGroupData =
    prevProps.establishmentBillingGroups !==
    newProps.establishmentBillingGroups;
  const incomingBillingGroupLoading =
    prevProps.establishmentBillingGroupLoading !==
    newProps.establishmentBillingGroupLoading;

  if (
    enableMultilocalisation &&
    // Member default establishment billing group has been fetched
    (incomingDefaultEstablishmentBillingGroup ||
      // New data on establishment billing groups
      incomingEstablishmentBillingGroupData ||
      // New basket offers data
      incomingBasketData ||
      incomingBillingGroupLoading)
  ) {
    // ---- 1ST STEP : LOOK FOR A BILLING GROUP IN THE OFFERS ----
    const defaultBillingGroupFromOffers =
      loadDefaultEstablishmentBillingGroupFromOffers(
        enableMultilocalisation,
        newProps.establishmentBillingGroups,
        newProps.basketOffers,
      );

    if (
      defaultBillingGroupFromOffers &&
      (!isEstablishmentBillingGroupSelected || incomingBasketData)
    ) {
      setSelectedEstablishmentBillingGroup(defaultBillingGroupFromOffers);
      setIsEstablishmentBillingGroupSelected(true);
      return defaultBillingGroupFromOffers;
    }
    // ---- 2ND STEP : LOOK AT THE MEMBER'S DEFAULT ESTABLISHMENT BILLING ----
    const defaultBillingGroupIsEnabled =
      newProps.defaultEstablishmentBillingGroup?.disabled === false;

    if (
      !isEstablishmentBillingGroupSelected &&
      newProps.defaultEstablishmentBillingGroup &&
      defaultBillingGroupIsEnabled
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
      !selectedEstablishmentBillingGroup &&
      isEstablishmentBillingGroupSelected
    ) {
      setIsEstablishmentBillingGroupSelected(false);
    }

    !newProps.establishmentBillingGroupLoading &&
      newProps.establishmentBillingGroups?.length > 0 &&
      !selectedEstablishmentBillingGroup &&
      setIsEstablishmentBillingGroupSelected(false);
  }
  return null;
};
