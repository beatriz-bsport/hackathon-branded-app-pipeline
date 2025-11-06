import React from 'react';
import {
  BUYABLE_ITEM_PASS as PASS,
  BUYABLE_ITEM_SHOP_ITEM as SHOP_ITEM,
  BUYABLE_ITEM_FEE as FEE,
  BUYABLE_ITEM_PRIVATE_PASS as PRIVATE_PASS,
  BUYABLE_ITEM_COMBO_ITEM as COMBO_ITEM,
  BUYABLE_ITEM_COUPON as COUPON,
  BUYABLE_ITEM_CREDIT as CREDIT,
  BUYABLE_ITEM_GIFTCARD as GIFTCARD,
} from '@bsport/common/lib/master-data/buyable-items.js';
import type { DateTime } from 'luxon';
import { AdditionalGuest } from '#src/libs/booker-module/types';

export type AddItemToBasketParams = {
  check_offer_unicity?: boolean;
  hideSnackbarSuccess?: boolean;
};

export type Basket<C = number, PPL = number> = {
  member: number;
  id: string; // uuid
  is_finalized: boolean;
  total_price: string;
  total_price_cts: number;
  total_price_prepaid_lines: string;
  total_price_prepaid_lines_cts: number;
  checkout_items: CheckoutItem[];
  company?: C;
  need_address: boolean;
  first_name?: string;
  last_name?: string;
  address_line_1?: string;
  address_line_2?: string;
  zipcode?: string;
  state?: string;
  city?: string;
  country?: string;
  available_payment_methods: number[];
  instalment_payment?: number;
  prepaid_lines: PPL[];
  date_created: string;
  date_updated: string;
  invoice?: string;
  is_fully_paid?: boolean;
};

export type BasketAddress = {
  first_name: string;
  last_name: string;
  address_line_1: string;
  address_line_2?: string;
  zipcode: string;
  state: string;
  country: string;
  city: string;
};

export type CheckoutItem = {
  quantity: number;
  id: string;
  unit_price: number;
  name: string;
  buyable_item_identifier: number;
  buyable_item_id: number;
  sub_items?: string[];
  editable: boolean;
  clearable: boolean;
  tax: number;
  extra_data: CheckoutItemExtraData;
  expiration_datetime: string | null;
  /** If current checkout item is a printable giftcard */
  pdf_link: string | null;
};

type ExtraData = {
  [key: string]:
    | string
    | string[]
    | number
    | boolean
    | null
    | ExtraData
    | DateTime;
};

export type CheckoutItemData = {
  buyable_item_id: number;
  buyable_item_identifier: number;
  quantity: number;
  extra_data: ExtraData;
};

export type CheckoutItemAnalytics = {
  objectToTrack: {
    name: string;
    id: number | string;
    price: number;
  };
  buyable_item_identifier: number;
};

export type HandleAddCheckoutItemData = {
  buyable_item_id: number;
  buyable_item_identifier: number;
  quantity: number;
  extra_data: { [key: string]: string | number };
  name: string;
  price: number;
};

export type CheckoutItemExtraData = {
  offers_data?: CheckoutItemOfferData[];
  voucher_cts?: number;
  percent_off?: number;
  amount_off?: number;
  is_applied?: boolean;
  referral_coupon_type?: string;
  has_reached_max_uses?: boolean;
  missing_amount_before_application?: number;
  theoretical_voucher_cts?: number;
  /** Generated PDF link after buying a printable gift card */
  pdf_link?: string;
};

export type CheckoutItemOfferData = {
  offer_id: number;
  extra_data: {
    /** Provide infos when booking for a guest. Empty dict if booking for a member */
    additional_guest_info?: AdditionalGuest[] | {};
    /** Equals to `member.id` if booking for a member or `null` if booking for a guest */
    booking_for_member?: number | null;
    /** The spot number associated with the booking */
    spot_id?: number | null;
    /** The spot name associated with the booking */
    spot_name?: string | null;
    /** `true` if currently booking for a guest */
    booking_for_invitee_only?: boolean;
  };
};

export type CheckoutState = {
  basket: {
    history: {
      items: Basket[];
      loading: boolean;
      error: Error | null;
    };
    allIds: string[];
    byId: { [id: string]: Basket };
    current: {
      data?: Basket;
      loading: boolean;
      error?: Error;
      updating: boolean;
      expiredItemRemovalStatusLoading: boolean;
    };
    loading: boolean;
    error?: Error;
    generatedObjects: {
      data: GeneratedObject[];
      loading: boolean;
      error?: Error;
    };
  };
};

export type OnRemoveCheckoutItemData = {
  checkout_item: string;
  quantity: number;
};

export type PrepaidLineExtraData = {
  consumer_giftcard_id?: number;
  internal_account?: number;
};

export type PrepaidLine = {
  id: string;
  unit_value: string; // decimal price as string
  extra_data: PrepaidLineExtraData;
  name: string;
};

export type GeneratedObject = {
  buyable_item_identifier: number;
  id: number;
  extra_data: { [key: string]: string | number };
};

export const SUBMIT_BUTTONS = {
  NEXT_BUTTON: {
    id: 0,
    textPath: 'forms.delivery.actions.submit',
    variant: 'contained',
  },
  PAY_NOW_BUTTON: {
    id: 1,
    textPath: 'validation.actions.payNow',
    variant: 'contained',
  },
  PAY_LATER_BUTTON: { id: 2, textPath: 'payLater.submit', variant: 'outlined' },
  CONFIRM_BUTTON: {
    id: 3,
    textPath: 'validation.actions.confirmPriceNull',
    variant: 'contained',
  },
  PAYPAL_BUTTON: {
    id: 4,
  },
} as const;

export type SubmitButtonsCallbacks = {
  [key in
    | typeof SUBMIT_BUTTONS.NEXT_BUTTON.id
    | typeof SUBMIT_BUTTONS.PAY_NOW_BUTTON.id
    | typeof SUBMIT_BUTTONS.CONFIRM_BUTTON.id
    | typeof SUBMIT_BUTTONS.PAY_LATER_BUTTON.id]: {
    onClick: (event: React.FormEvent<HTMLButtonElement>) => Promise<void>;
  };
} & {
  [key in typeof SUBMIT_BUTTONS.PAYPAL_BUTTON.id]: {
    createOrder: () => Promise<string>;
    onApprove: () => Promise<void>;
    onError: () => Promise<void>;
    onCancel: () => Promise<void>;
  };
};

export const STEPS = {
  ADDRESS_STEP: {
    id: 0,
    label: 'address',
    submitButtonTextPath: 'forms.delivery.actions.submit',
  },
  PAYMENT_STEP: {
    id: 1,
    label: 'payment',
    submitButtonTextPath: 'validation.actions.payNow',
  },
};

export type StepType = (typeof STEPS)[keyof typeof STEPS];

export type QuicksaleMemberUpdateResponse = {
  updated_member: boolean;
  has_removed_incompatible_items: boolean;
  new_basket?: Basket;
};

export type QuicksaleMemberUpdateSuccess = {
  updated_member: boolean;
  newBasket: Basket;
  previousBasketId: string;
};

export enum BuyableItemOptions {
  BUYABLE_ITEM_PASS = PASS,
  BUYABLE_ITEM_SHOP_ITEM = SHOP_ITEM,
  BUYABLE_ITEM_CREDIT = CREDIT,
  BUYABLE_ITEM_FEE = FEE,
  BUYABLE_ITEM_PRIVATE_PASS = PRIVATE_PASS,
  BUYABLE_ITEM_COMBO_ITEM = COMBO_ITEM,
  BUYABLE_ITEM_COUPON = COUPON,
  BUYABLE_ITEM_GIFTCARD = GIFTCARD,
}

export enum ConfirmationStatus {
  GENERIC_ERROR = 'generic',
  GENERIC_OFFER_ERROR = 'genericOfferError',
  OFFER_ONLY_BOOKING_ERROR = 'offerOnlyBookingError',
  OFFER_ONLY_SUCCESS = 'offerOnlySuccess',
  OFFER_ONLY_GUEST_SUCCESS = 'offerOnlyGuestSuccess',
  OFFER_GENERIC_ERROR_WITH_PURCHASE = 'offerAndPurchaseGenericError',
  OFFER_BOOKING_ERROR_WITH_PURCHASE = 'offerAndPurchaseBookingError',
  OFFER_AND_PURCHASE_SUCCESS = 'offerAndPurchaseSuccess',
  OFFER_AND_PURCHASE_ONE_CLICK_SUCCESS = 'offerAndPurchaseOneClickSuccess',
  PURCHASE_ONLY_SUCCESS = 'purchaseOnlySuccess',
  PURCHASE_ONLY_ONE_CLICK_SUCCESS = 'purchaseOnlyOneClickSuccess',
  WAITING_LIST = 'waitingList',
  PURCHASE_WITH_PASSES_SUCCESS = 'purchaseWithPassesSuccess',
  PURCHASE_WITH_PASSES_ONE_CLICK_SUCCESS = 'purchaseWithPassesOneClickSuccess',
  PURCHASE_WITH_ITEMS_SUCCESS = 'purchaseWithItemsSuccess',
  PURCHASE_WITH_GIFTCARDS_SUCCESS = 'purchaseWithGiftcardsSuccess',
  OFFERS_PARTIALLY_CONFIRMED = 'offersPartiallyConfirmed',
}

export type ExpiredItemRemovalStatusPayload = {
  checkout_item_id: string;
  company: number;
};

export type ExpiredItemRemovalStatusResponse = {
  removal_successful: boolean;
};

export type AnalyticsBasket = {
  member: number;
  id: string; // uuid
  total_price: string;
  total_price_cts: number;
  checkout_items: CheckoutItem[];
  available_payment_methods: number[];
  instalment_payment?: number;
  date_created: string;
  date_updated: string;
  is_fully_paid?: boolean;
};
