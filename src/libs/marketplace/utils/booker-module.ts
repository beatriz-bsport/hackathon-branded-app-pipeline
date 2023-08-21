// @ts-nocheck
import { TFunction } from 'i18next';
import { Immutable } from 'seamless-immutable';

import Block from '@material-ui/icons/Block';
import DoneAll from '@material-ui/icons/DoneAll';
import HourglassFull from '@material-ui/icons/HourglassFull';
import LabelOff from '@material-ui/icons/LabelOff';
import TimerOff from '@material-ui/icons/TimerOff';
import Update from '@material-ui/icons/Update';
import type { PrivatePassCategoryWithPasses } from '#libs/private-service/types';
import type {
  PaymentPackCategoryWithPacks,
  PaymentPack,
  PaymentPackCategory,
} from '#libs/payment-packs/types';
import {
  CONSUMER_PAYMENT_PACK_IDENTIFIER,
  CONTRACT_BOOKING_FUNNEL_IDENTIFIER,
  PAYMENT_COMBO_BOOKING_FUNNEL_IDENTIFIER,
  PAYMENT_PACK_BOOKING_FUNNEL_IDENTIFIER,
} from '#libs/marketplace/constants';
import type {
  BookerItem,
  BuyableItemCategory,
} from '#libs/booker-module/types';
import type { PaymentCombo } from '#libs/payment-combo/types';
import type {
  OfferFeature,
  PricingOptionOrdering,
} from '#libs/marketplace/types';
import type {
  Contract,
  ContractWithPaymentPack,
} from '#libs/subscription/types';

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
    .filter((category: PaymentPackCategoryWithPacks) =>
      restrictedCategories.paymentPack?.length
        ? restrictedCategories.paymentPack.includes(category.id)
        : category,
    )
    .filter((category: PaymentPackCategoryWithPacks) => !!category.packs.length)
    .filter((category: PaymentPackCategoryWithPacks) => !!category.name)
    .map((category: PaymentPackCategoryWithPacks) => {
      return {
        label: category.name,
        value: category.id,
      };
    });

  const parsedPrivatePassCategories = privatePassByCategory
    .filter((cat: PrivatePassCategoryWithPasses) =>
      restrictedCategories.privatePass?.length
        ? restrictedCategories.privatePass.includes(cat.id)
        : cat,
    )
    .filter((cat: PrivatePassCategoryWithPasses) => !!cat.passes.length)
    .filter((cat: PrivatePassCategoryWithPasses) => !!cat.name)
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
  goToSubscriptionPage: (contractId: number) => void,
  offerId: number,
  selectedSpotId: number | null,
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
  } else if (selectedItemIdentifier === CONTRACT_BOOKING_FUNNEL_IDENTIFIER) {
    goToSubscriptionPage(selectedItem.data.id);
  }

  if (offerFeature.isBookable) {
    data.offers = [
      {
        offer_id: offerId,
        extra_data: {
          spot_id: selectedSpotId ?? null,
        },
      },
    ];
  } else {
    data.offers = [];
  }

  if (offerFeature.isWaitingList) {
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
    displayPrice = (+data?.flat_fee + +data?.recurrent_price).toString();
  }
  return displayPrice;
};
