import { TFunction } from 'i18next';
import { Immutable } from 'seamless-immutable';

import Block from '@material-ui/icons/Block';
import DoneAll from '@material-ui/icons/DoneAll';
import HourglassFull from '@material-ui/icons/HourglassFull';
import LabelOff from '@material-ui/icons/LabelOff';
import TimerOff from '@material-ui/icons/TimerOff';
import Update from '@material-ui/icons/Update';
import { DateTime } from 'luxon';
import type { PrivatePassCategoryWithPasses } from '#src/libs/private-service/types';
import type {
  PaymentPackCategoryWithPacks,
  PaymentPack,
  PaymentPackCategory,
} from '#src/libs/payment-packs/types';
import {
  CONSUMER_PAYMENT_PACK_IDENTIFIER,
  CONTRACT_BOOKING_FUNNEL_IDENTIFIER,
  PAYMENT_COMBO_BOOKING_FUNNEL_IDENTIFIER,
  PAYMENT_PACK_BOOKING_FUNNEL_IDENTIFIER,
  MIXED_ITEMS_BOOKING_FUNNEL_IDENTIFIER,
  RECOMMENDED_BUYABLE_CATEGORY_ID,
} from '#src/libs/marketplace/constants';
import type {
  BookerItem,
  BookerModuleBuyableItem,
  BuyableItemCategory,
  MultipleOfferSelectedData,
  RecommendedBuyableItem,
} from '#src/libs/booker-module/types';
import type { PaymentCombo } from '#src/libs/payment-combo/types';
import type {
  OfferFeature,
  PricingOptionOrdering,
} from '#src/libs/marketplace/types';
import type {
  Contract,
  ContractWithPaymentPack,
} from '#src/libs/subscription/types';
import { computeProrataPriceForSubscription } from '#src/libs/subscription/utils';
import type { AddGuestFormValues } from '../components/@Booking/MarketplaceBookingAddGuestModal';
import type { OfferStatus } from '#src/libs/offer/types';
import { getOfferFeature } from '@bsport/common/lib/master-data/available-payment.js';
// pass page category filter - get all of the available categories
export const getPassFilterAvailableCategories = (
  paymentPackByCategory: Immutable<PaymentPackCategoryWithPacks[]>,
  privatePassByCategory: Immutable<PrivatePassCategoryWithPasses[]>,
  restrictedCategories: {
    paymentPack: number[] | null;
    privatePass: number[] | null;
  },
  t: TFunction,
) => {
  const parsedPaymentPackCategories = paymentPackByCategory
    // @ts-expect-error
    .filter((category: PaymentPackCategoryWithPacks) =>
      restrictedCategories.paymentPack?.length
        ? restrictedCategories.paymentPack.includes(category.id)
        : category,
    )
    // @ts-expect-error
    .filter((category: PaymentPackCategoryWithPacks) => !!category.packs.length)
    // @ts-expect-error
    .filter((category: PaymentPackCategoryWithPacks) => !!category.name)
    // @ts-expect-error
    .map((category: PaymentPackCategoryWithPacks) => {
      return {
        label: category.name,
        value: category.id,
      };
    });

  const parsedPrivatePassCategories = privatePassByCategory
    // @ts-expect-error
    .filter((cat: PrivatePassCategoryWithPasses) =>
      restrictedCategories.privatePass?.length
        ? restrictedCategories.privatePass.includes(cat.id)
        : cat,
    )
    // @ts-expect-error
    .filter((cat: PrivatePassCategoryWithPasses) => !!cat.passes.length)
    // @ts-expect-error
    .filter((cat: PrivatePassCategoryWithPasses) => !!cat.name)
    // @ts-expect-error
    .map((category: PrivatePassCategoryWithPasses) => {
      return {
        label: category.name,
        value: category.id,
      };
    });

  // add the option "No category" with all other options
  const availableCategories = [
    ...parsedPaymentPackCategories,
    ...parsedPrivatePassCategories,
    {
      label: t('marketplace:pass.filters.noCategory'),
      value: null,
    },
  ];

  return availableCategories;
};

export const buildBuyableItemCategories = (
  availableContracts: Contract[],
  availableComboPacks: PaymentCombo[],
  availablePaymentPacksWithoutCategory: PaymentPack[],
  availablePaymentPackCategories: PaymentPackCategory[],
  availablePaymentPacks: PaymentPack[],
  current_pricing_option_ordering: PricingOptionOrdering,
  t: TFunction,
) => {
  const buyableItemCategories: Array<BuyableItemCategory> = [];

  const recommendedItemsCategory = buildRecommendedBuyableItemCategory(
    availableContracts,
    availableComboPacks,
    availablePaymentPacksWithoutCategory,
    availablePaymentPackCategories,
    availablePaymentPacks,
    current_pricing_option_ordering,
    t,
  );

  // If there are recommended items, include it in first position
  // @ts-expect-error
  if (recommendedItemsCategory.values.length > 0) {
    // @ts-expect-error
    buyableItemCategories.push(recommendedItemsCategory);
  }

  current_pricing_option_ordering.forEach((option, index) => {
    if (
      option[0] === CONTRACT_BOOKING_FUNNEL_IDENTIFIER &&
      availableContracts.length > 0
    ) {
      buyableItemCategories.push({
        index,
        id: option[0].toString(),
        identifier: option[0],
        name: t('newBookingModule.subscriptions'),
        // @ts-expect-error
        values: availableContracts,
      });
    }
    if (
      option[0] === PAYMENT_COMBO_BOOKING_FUNNEL_IDENTIFIER &&
      availableComboPacks.length > 0
    ) {
      buyableItemCategories.push({
        index,
        id: option[0].toString(),
        identifier: option[0],
        name: t('newBookingModule.combos'),
        values: availableComboPacks,
      });
    }

    if (
      option[0] === PAYMENT_PACK_BOOKING_FUNNEL_IDENTIFIER &&
      option[1] === null &&
      availablePaymentPacksWithoutCategory.length > 0
    ) {
      buyableItemCategories.push({
        index,
        id: option[0].toString(),
        identifier: option[0],
        name:
          availablePaymentPackCategories.length > 0
            ? t('newBookingModule.otherPasses')
            : t('newBookingModule.passes'),
        values: availablePaymentPacksWithoutCategory,
      });
    }
    const paymentPackCategory = availablePaymentPackCategories.find(
      (category: PaymentPackCategory) => category.id === option[1],
    );
    if (
      option[0] === PAYMENT_PACK_BOOKING_FUNNEL_IDENTIFIER &&
      paymentPackCategory
    ) {
      buyableItemCategories.push({
        index,
        id: option[0].toString().concat(paymentPackCategory.id.toString()),
        identifier: option[0],
        name: paymentPackCategory.name,
        values: availablePaymentPacks.filter(
          (paymentPack: PaymentPack) =>
            paymentPack.category === paymentPackCategory.id,
        ),
      });
    }
  });
  return buyableItemCategories;
};

export const buildRecommendedBuyableItemCategory = (
  availableContracts: Contract[],
  availableComboPacks: PaymentCombo[],
  availablePaymentPacksWithoutCategory: PaymentPack[],
  availablePaymentPackCategories: PaymentPackCategory[],
  availablePaymentPacks: PaymentPack[],
  current_pricing_option_ordering: PricingOptionOrdering,
  t: TFunction,
) => {
  const onlyRecommended = (item: BookerModuleBuyableItem) =>
    item.highlighted_as_recommended;

  const recommendedContracts = availableContracts
    // @ts-expect-error
    .filter(onlyRecommended)
    .map((contract) => ({
      identifier: CONTRACT_BOOKING_FUNNEL_IDENTIFIER,
      value: contract,
    }));
  const recommendedComboPacks = availableComboPacks
    .filter(onlyRecommended)
    .map((comboPack) => ({
      identifier: PAYMENT_COMBO_BOOKING_FUNNEL_IDENTIFIER,
      value: comboPack,
    }));
  const recommendedPaymentPacksWithoutCategory =
    availablePaymentPacksWithoutCategory
      .filter(onlyRecommended)
      .map((paymentPack) => ({
        identifier: PAYMENT_PACK_BOOKING_FUNNEL_IDENTIFIER,
        value: paymentPack,
      }));
  const recommendedPaymentPacks = availablePaymentPacks
    .filter(onlyRecommended)
    .map((paymentPack) => ({
      identifier: PAYMENT_PACK_BOOKING_FUNNEL_IDENTIFIER,
      value: paymentPack,
    }));

  // @ts-expect-error
  let recommendedItems: RecommendedBuyableItem = [];
  current_pricing_option_ordering.forEach((option) => {
    if (
      option[0] === CONTRACT_BOOKING_FUNNEL_IDENTIFIER &&
      recommendedContracts.length > 0
    ) {
      // @ts-expect-error
      recommendedItems = recommendedItems.concat(recommendedContracts);
    }
    if (
      option[0] === PAYMENT_COMBO_BOOKING_FUNNEL_IDENTIFIER &&
      recommendedComboPacks.length > 0
    ) {
      // @ts-expect-error
      recommendedItems = recommendedItems.concat(recommendedComboPacks);
    }
    if (
      option[0] === PAYMENT_PACK_BOOKING_FUNNEL_IDENTIFIER &&
      option[1] === null &&
      recommendedPaymentPacksWithoutCategory.length > 0
    ) {
      // @ts-expect-error
      recommendedItems = recommendedItems.concat(
        recommendedPaymentPacksWithoutCategory,
      );
    }
    const paymentPackCategory = availablePaymentPackCategories.find(
      (category: PaymentPackCategory) => category.id === option[1],
    );
    if (
      option[0] === PAYMENT_PACK_BOOKING_FUNNEL_IDENTIFIER &&
      paymentPackCategory
    ) {
      // @ts-expect-error
      recommendedItems = recommendedItems.concat(
        recommendedPaymentPacks.filter(
          (item) => item.value.category === paymentPackCategory.id,
        ),
      );
    }
  });

  return {
    index: -1,
    id: RECOMMENDED_BUYABLE_CATEGORY_ID,
    identifier: MIXED_ITEMS_BOOKING_FUNNEL_IDENTIFIER,
    name: t('newBookingModule.recommended'),
    values: recommendedItems,
  };
};

export const getBookingBlockedReasonIcon = (icon: string) => {
  let TheIcon = Block;
  if (icon === 'hourglass') TheIcon = HourglassFull;
  if (icon === 'block') TheIcon = Block;
  if (icon === 'timer-off') TheIcon = TimerOff;
  if (icon === 'update') TheIcon = Update;
  if (icon === 'done-all') TheIcon = DoneAll;
  if (icon === 'label-off') TheIcon = LabelOff;
  return TheIcon;
};

export const buildDataForUserRegistration = (
  offerFeature: OfferFeature,
  selectedItem: BookerItem,
  offerId: number,
  selectedSpotId: number | null,
  bookingForGuestValues?: AddGuestFormValues,
  selectedSpot?: string | null,
  memberBookingId?: number,
) => {
  const data: {
    consumer_payment_pack?: number;
    payment_pack?: number;
    payment_combo?: number;
    email?: string;
    offers: {
      offer_id: number;
      extra_data: any;
    }[];
    waiting_list?: { offer_id: number }[];
  } = { offers: [] };

  const selectedItemIdentifier = selectedItem?.itemIdentifier;
  if (selectedItemIdentifier === CONSUMER_PAYMENT_PACK_IDENTIFIER) {
    data.consumer_payment_pack = selectedItem.data.id;
  } else if (
    selectedItemIdentifier === PAYMENT_PACK_BOOKING_FUNNEL_IDENTIFIER
  ) {
    data.payment_pack = selectedItem.data.id;
  } else if (
    selectedItemIdentifier === PAYMENT_COMBO_BOOKING_FUNNEL_IDENTIFIER
  ) {
    data.payment_combo = selectedItem.data.id;
  }

  if (offerFeature.isBookable) {
    data.offers = [
      {
        offer_id: offerId,
        extra_data: {
          ...(bookingForGuestValues
            ? {
                additional_guest_info: [
                  {
                    first_name: bookingForGuestValues.firstName,
                    last_name: bookingForGuestValues.lastName,
                    email: bookingForGuestValues.email,
                    spot_id: selectedSpotId ?? null,
                    spot_name: selectedSpot ?? null,
                  },
                ],
                booking_for_invitee_only: true,
              }
            : {
                spot_id: selectedSpotId ?? null,
                spot_name: selectedSpot ?? null,
                booking_for_member: memberBookingId || null,
              }),
        },
      },
    ];
  } else {
    data.offers = [];
  }

  if (offerFeature.isWaitingList && !memberBookingId) {
    data.waiting_list = [
      {
        offer_id: offerId,
      },
    ];
  } else {
    data.waiting_list = [];
  }
  return data;
};

export const buildDataForUserRegistrationWithMultiSessionsAllowed = (
  selectedItem: BookerItem,
  selectedSpotsIds: { [key: number]: number },
  selectedOffers: MultipleOfferSelectedData[],
  offerStatusById: { [key: number]: OfferStatus },
  accept_double_booking: boolean,
  accept_double_booking_workshop: boolean,
  selectedSpots?: { [key: number]: string },
  bookingForGuestValues?: AddGuestFormValues,
  memberBookingId?: number,
) => {
  const data: {
    consumer_payment_pack?: number;
    payment_pack?: number;
    payment_combo?: number;
    email?: string;
    offers: {
      offer_id: number;
      extra_data: any;
    }[];
    waiting_list?: { offer_id: number }[];
  } = { offers: [] };

  const selectedItemIdentifier = selectedItem?.itemIdentifier;
  if (selectedItemIdentifier === CONSUMER_PAYMENT_PACK_IDENTIFIER) {
    data.consumer_payment_pack = selectedItem.data.id;
  } else if (
    selectedItemIdentifier === PAYMENT_PACK_BOOKING_FUNNEL_IDENTIFIER
  ) {
    data.payment_pack = selectedItem.data.id;
  } else if (
    selectedItemIdentifier === PAYMENT_COMBO_BOOKING_FUNNEL_IDENTIFIER
  ) {
    data.payment_combo = selectedItem.data.id;
  }

  /* 
  - In the regular flow, multiple offers can be selected and booked simultaneously. We first call `getOfferFeature` 
    to verify that each offer is bookable before including it in the payload sent to the backend.

  - However, when booking for a guest, only a single offer can be booked at a time. In this specific case, we avoid 
    calling `getOfferFeature` because the current user has already booked the session earlier in the flow. Consequently, 
    the offer might no longer be bookable, depending on whether the company allows double booking.
  */
  const isBookingForAGuestFlow =
    !!bookingForGuestValues && selectedOffers.length === 1;

  const bookableOffers = selectedOffers
    ?.filter((_selectedOffer) => !!_selectedOffer)
    .filter(
      (offerData: MultipleOfferSelectedData) =>
        isBookingForAGuestFlow ||
        getOfferFeature(
          // @ts-expect-error
          offerData.offer,
          offerStatusById,
          accept_double_booking,
          accept_double_booking_workshop,
        ).isBookable,
    );

  data.offers = bookableOffers.map((offerData: MultipleOfferSelectedData) => {
    const _data = {
      offer_id: offerData.offer.id,
      extra_data: {
        ...(offerData.extra_data || {}),
        ...(bookingForGuestValues
          ? {
              additional_guest_info: [
                {
                  first_name: bookingForGuestValues.firstName,
                  last_name: bookingForGuestValues.lastName,
                  email: bookingForGuestValues.email,
                  spot_id: selectedSpotsIds[offerData.offer.id] ?? null,
                  spot_name: selectedSpots[offerData.offer.id] ?? null,
                },
              ],
              booking_for_member: null,
              booking_for_invitee_only: true,
            }
          : {
              spot_id: selectedSpotsIds[offerData.offer.id] ?? null,
              spot_name: selectedSpots[offerData.offer.id] ?? null,
              booking_for_member: memberBookingId || null,
            }),
      },
    };
    return _data;
  });

  data.waiting_list = selectedOffers
    ?.filter((_selectedOffer) => !!_selectedOffer)
    .filter(
      (offerData: MultipleOfferSelectedData) =>
        getOfferFeature(
          // @ts-expect-error
          offerData.offer,
          offerStatusById,
          accept_double_booking,
          accept_double_booking_workshop,
        ).isWaitingList,
    )
    .map((offerData: MultipleOfferSelectedData) => ({
      offer_id: offerData.offer.id,
      extra_data: {
        ...(offerData.extra_data || {}),
        // booking_for_member: this.state.selectedMember
        //   ? this.state.selectedMember.id
        //   : null,
      },
    }));
  return data;
};

export const getBookingDisplayPrice = (selectedItem: BookerItem) => {
  let displayPrice = '';
  if (
    selectedItem.itemIdentifier === PAYMENT_PACK_BOOKING_FUNNEL_IDENTIFIER ||
    selectedItem.itemIdentifier === PAYMENT_COMBO_BOOKING_FUNNEL_IDENTIFIER
  ) {
    const data = selectedItem.data as PaymentPack | PaymentCombo;
    displayPrice = data.price.toString();
  } else if (
    selectedItem.itemIdentifier === CONTRACT_BOOKING_FUNNEL_IDENTIFIER
  ) {
    const data = selectedItem.data as ContractWithPaymentPack;
    if (data?.month_billing_day) {
      const billingStartDate = DateTime.now().toISODate();
      const firstInvoiceProrataPrice = computeProrataPriceForSubscription(
        billingStartDate,
        data?.month_billing_day,
        (data?.recurrent_price ?? 0).toString(),
      );
      displayPrice = parseFloat(
        (
          Math.max(parseFloat(firstInvoiceProrataPrice), 0) +
          // @ts-expect-error
          parseFloat(data?.flat_fee ?? 0)
        ).toString(),
      )
        .toFixed(2)
        .toString();
    } else {
      displayPrice = (+data?.flat_fee + +data?.recurrent_price).toString();
    }
  }
  return displayPrice;
};
