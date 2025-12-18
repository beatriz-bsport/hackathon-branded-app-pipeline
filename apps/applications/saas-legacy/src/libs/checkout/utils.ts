import { TFunction } from 'i18next';
import {
  BUYABLE_ITEM_COUPON,
  BUYABLE_ITEM_FEE,
} from '@bsport/common/lib/master-data/buyable-items.js';
import {
  OFFER_WAITING_LIST_CAN_NOT_BOOK_TOO_MANY_FUTURE,
  OFFER_WAITING_LIST_NO_USABLE_CONSUMER_PAYMENT_PACK,
} from '@bsport/common/lib/master-data/error-codes/waitinglist-can-not-be-joined.js';
import {
  LOCK_ACQUISITION_FAILURE_GENERIC,
  LOCK_ACQUISITION_FAILURE_SPOT_SCHEDULING,
} from '@bsport/common/lib/master-data/error-codes/lock.js';
import memoize from 'memoize-one';
import { getPrice } from '#src/libs/theme/utils';
import {
  getCompanyCountry,
  getCurrencyDisplayWithPrice,
} from '#src/libs/theme/selectors';

import type { MarketplacePaymentMethodBillingDetails } from '#src/libs/marketplace/types';
import { OfferWithSpotInformation } from '#src/libs/offer/types';
import { Subscription } from '#src/libs/subscription/types';
import { PaymentPack } from '#src/libs/payment-packs/types';
import { PrivatePass } from '#src/libs/private-service/types';
import {
  EXCEPTION_BOOKING_GUEST_GENERIC,
  EXCEPTION_BOOKING_GUEST_IS_UNAVAILABLE_IN_OFFER,
  EXCEPTION_BOOKING_GUEST_IS_UNAVAILABLE_IN_PASS,
  EXCEPTION_BOOKING_GUEST_IS_UNAVAILABLE_IN_SETTINGS,
  EXCEPTION_BOOKING_GUEST_NOT_ENOUGH_SPOT,
  EXCEPTION_BOOKING_GUEST_OVERCOME_LIMIT,
  EXCEPTION_BOOKING_GUEST_REACHED_LIMIT,
} from './constants';
import {
  Basket,
  BuyableItemOptions,
  CheckoutItem,
  CheckoutItemExtraData,
  ConfirmationStatus,
  PrepaidLine,
} from './types';

// IDK what the hell is happening, but importing them from common broke the VOD widget
const SPOT_NOT_AVAILABLE = 8001;
const OFFER_BOOKABLE_STATUS_FULL = 3;

/**
 * Computes the current number of buyable items in the current member basket
 * @param basketCheckoutItems The list of checkout items from the current basket
 * @returns {number}
 */
export const getBasketBuyableItemsCount = (
  basketCheckoutItems: CheckoutItem[],
): number => {
  const excludedCheckoutItemTypes = [BUYABLE_ITEM_FEE, BUYABLE_ITEM_COUPON];
  const checkoutProductList = basketCheckoutItems.filter(
    (item) => !excludedCheckoutItemTypes.includes(item.buyable_item_identifier),
  );
  return (checkoutProductList ?? []).length
    ? checkoutProductList.reduce(
        (sum, current) =>
          current?.quantity ? sum + current.quantity : sum + 0,
        0,
      )
    : 0;
};

/**
 * Calculates the sub total basket price excluding the tax
 *
 * @export
 * @param {Basket | Basket<string, PrepaidLine> | Basket<number, PrepaidLine>} basket The basket for which we want to calculate the sub total price.
 * @param {boolean} excludeDeliveryFee If 'true', the delivery fee is excluded.
 * @return {string} The calculated sub total price.
 */
export const getSubTotal = (
  basket: Basket | Basket<string, PrepaidLine> | Basket<number, PrepaidLine>,
  excludeDeliveryFee?: boolean,
): string => {
  // if we don't have items, or items with no quantity, price returned is always 0
  if (
    !basket ||
    !basket.checkout_items.length ||
    basket.checkout_items.reduce((acc, ci) => acc + ci.quantity || 0, 0) === 0
  ) {
    return parseFloat('0').toFixed(2);
  }
  const relevantCheckoutItems = excludeDeliveryFee
    ? basket.checkout_items.filter(
        (_item) => _item.buyable_item_identifier !== BUYABLE_ITEM_FEE,
      )
    : basket.checkout_items;

  const totalPrice = relevantCheckoutItems.reduce(
    (acc, ci) =>
      acc + parseFloat(getPrice(ci.unit_price, true, ci.tax)) * ci.quantity,
    0,
  );
  return totalPrice.toFixed(2);
};

export const getBookingErrorMessage = (t: TFunction, codeError?: number) => {
  if (!codeError) {
    return t('validation.sections.errorExplain.generic');
  }
  switch (codeError) {
    case EXCEPTION_BOOKING_GUEST_GENERIC:
      return t('validation.sections.errorExplain.guestGeneric');
    case EXCEPTION_BOOKING_GUEST_OVERCOME_LIMIT:
      return t('validation.sections.errorExplain.guestOvercomeLimit');
    case EXCEPTION_BOOKING_GUEST_REACHED_LIMIT:
      return t('validation.sections.errorExplain.guestReachedLimit');
    case EXCEPTION_BOOKING_GUEST_IS_UNAVAILABLE_IN_SETTINGS:
      return t('validation.sections.errorExplain.guestSettings');
    case EXCEPTION_BOOKING_GUEST_IS_UNAVAILABLE_IN_OFFER:
      return t('validation.sections.errorExplain.guestOffer');
    case EXCEPTION_BOOKING_GUEST_IS_UNAVAILABLE_IN_PASS:
      return t('validation.sections.errorExplain.guestPass');
    case EXCEPTION_BOOKING_GUEST_NOT_ENOUGH_SPOT:
      return t('validation.sections.errorExplain.guestNotEnoughSpot');
    case SPOT_NOT_AVAILABLE:
      return t(`canNotBuyErrorCode.${SPOT_NOT_AVAILABLE}`);
    case OFFER_WAITING_LIST_NO_USABLE_CONSUMER_PAYMENT_PACK:
      return t(
        `snackbar:canNotBuyErrorCode.${OFFER_WAITING_LIST_NO_USABLE_CONSUMER_PAYMENT_PACK}`,
      );
    case OFFER_WAITING_LIST_CAN_NOT_BOOK_TOO_MANY_FUTURE:
      return t(
        `snackbar:canNotBuyErrorCode.${OFFER_WAITING_LIST_CAN_NOT_BOOK_TOO_MANY_FUTURE}`,
      );
    default:
      return t('validation.sections.errorExplain.generic');
  }
};

export const getBillingDetailsDefaultValue = (
  defaultName: string,
  defaultEmail: string,
): MarketplacePaymentMethodBillingDetails => {
  return {
    name: defaultName ?? '',
    email: defaultEmail ?? '',
    sortCode: '',
    accountNumber: '',
    address: {
      line1: '',
      line2: '',
      postal_code: '',
      city: '',
      country: getCompanyCountry() || '',
      state: '',
    },
  };
};

export const getOneClickCheckoutConfirmationStatus = (
  isError: boolean,
  codeError: number,
  offers: OfferWithSpotInformation[],
  basket: Basket,
) => {
  const checkoutItems =
    basket?.checkout_items?.filter((checkoutItem) => !!checkoutItem) ?? [];

  const isbasketWithPasses =
    checkoutItems.filter(
      (item) =>
        item.buyable_item_identifier ===
          BuyableItemOptions.BUYABLE_ITEM_COMBO_ITEM ||
        item.buyable_item_identifier === BuyableItemOptions.BUYABLE_ITEM_PASS ||
        item.buyable_item_identifier ===
          BuyableItemOptions.BUYABLE_ITEM_PRIVATE_PASS,
    ).length > 0;

  if (isError) {
    if (!codeError) {
      return ConfirmationStatus.GENERIC_OFFER_ERROR;
    }
    if (!!offers?.length && !!basket) {
      switch (codeError) {
        case OFFER_BOOKABLE_STATUS_FULL:
          return ConfirmationStatus.OFFER_BOOKING_ERROR_WITH_PURCHASE;
        default:
          return ConfirmationStatus.OFFER_GENERIC_ERROR_WITH_PURCHASE;
      }
    }
    switch (codeError) {
      // error raised when auto assigning a spot, check SpotSchedulingAssignmentError
      case OFFER_BOOKABLE_STATUS_FULL:
        return ConfirmationStatus.OFFER_ONLY_BOOKING_ERROR;
      default:
        return ConfirmationStatus.GENERIC_OFFER_ERROR;
    }
  }

  if (!!offers?.length && !!basket) {
    return ConfirmationStatus.OFFER_AND_PURCHASE_ONE_CLICK_SUCCESS;
  }
  if (isbasketWithPasses) {
    return ConfirmationStatus.PURCHASE_WITH_PASSES_ONE_CLICK_SUCCESS;
  }
  return ConfirmationStatus.OFFER_AND_PURCHASE_ONE_CLICK_SUCCESS;
};

export const getConfirmationStatus = (
  isError: boolean,
  codeError: number,
  offers: OfferWithSpotInformation[],
  basket: Basket,
  billingPlan: Subscription,
  offersOnWaitingList: number[],
  isGuestBooking?: boolean,
  isPartiallyConfirmed?: boolean,
) => {
  const checkoutItems =
    basket?.checkout_items?.filter((checkoutItem) => !!checkoutItem) ?? [];

  const isbasketWithPasses =
    checkoutItems.filter(
      (item) =>
        item.buyable_item_identifier ===
          BuyableItemOptions.BUYABLE_ITEM_COMBO_ITEM ||
        item.buyable_item_identifier === BuyableItemOptions.BUYABLE_ITEM_PASS ||
        item.buyable_item_identifier ===
          BuyableItemOptions.BUYABLE_ITEM_PRIVATE_PASS,
    ).length > 0;

  const isBasketOnlyWithShopItem =
    checkoutItems.filter(
      (item) =>
        item.buyable_item_identifier ===
        BuyableItemOptions.BUYABLE_ITEM_SHOP_ITEM,
    ).length === checkoutItems.length;

  const isBasketOnlyWithGiftcard =
    checkoutItems.filter(
      (item) =>
        item.buyable_item_identifier ===
        BuyableItemOptions.BUYABLE_ITEM_GIFTCARD,
    ).length === checkoutItems.length;

  if (isError) {
    if (!codeError) {
      return ConfirmationStatus.GENERIC_ERROR;
    }
    switch (codeError) {
      case SPOT_NOT_AVAILABLE:
      case LOCK_ACQUISITION_FAILURE_SPOT_SCHEDULING:
      case LOCK_ACQUISITION_FAILURE_GENERIC:
      case OFFER_BOOKABLE_STATUS_FULL:
        return ConfirmationStatus.OFFER_ONLY_BOOKING_ERROR;
      default:
        return ConfirmationStatus.GENERIC_OFFER_ERROR;
    }
  }
  if (isPartiallyConfirmed) {
    return ConfirmationStatus.OFFERS_PARTIALLY_CONFIRMED;
  }
  if (!!offers?.length && !basket && !billingPlan && !isGuestBooking) {
    return ConfirmationStatus.OFFER_ONLY_SUCCESS;
  }
  if (!!offers?.length && !basket && !billingPlan && isGuestBooking) {
    return ConfirmationStatus.OFFER_ONLY_GUEST_SUCCESS;
  }
  if (!!offers?.length && (!!basket || !!billingPlan)) {
    if (!codeError) {
      return ConfirmationStatus.OFFER_AND_PURCHASE_SUCCESS;
    }
    switch (codeError) {
      case SPOT_NOT_AVAILABLE:
      case LOCK_ACQUISITION_FAILURE_SPOT_SCHEDULING:
      case LOCK_ACQUISITION_FAILURE_GENERIC:
      case OFFER_BOOKABLE_STATUS_FULL:
        return ConfirmationStatus.OFFER_BOOKING_ERROR_WITH_PURCHASE;
      default:
        return ConfirmationStatus.OFFER_GENERIC_ERROR_WITH_PURCHASE;
    }
  }
  if (offersOnWaitingList?.length) {
    return ConfirmationStatus.WAITING_LIST;
  }
  if (isbasketWithPasses) {
    return ConfirmationStatus.PURCHASE_WITH_PASSES_SUCCESS;
  }
  if (isBasketOnlyWithShopItem) {
    return ConfirmationStatus.PURCHASE_WITH_ITEMS_SUCCESS;
  }
  if (isBasketOnlyWithGiftcard) {
    return ConfirmationStatus.PURCHASE_WITH_GIFTCARDS_SUCCESS;
  }

  return ConfirmationStatus.PURCHASE_ONLY_SUCCESS;
};

export const getNumberOfListToDisplay = memoize(
  ({
    checkoutItemsWithPaymentCombo,
    checkoutItemsWithPaymentPack,
    checkoutItemsWithPrivatePass,
    checkoutItemsWithShopItem,
    checkoutItemsWithGiftcard,
  }: {
    checkoutItemsWithPaymentCombo: CheckoutItem[];
    checkoutItemsWithPaymentPack: CheckoutItem[];
    checkoutItemsWithPrivatePass: CheckoutItem[];
    checkoutItemsWithShopItem: CheckoutItem[];
    checkoutItemsWithGiftcard: CheckoutItem[];
  }) => {
    const shoudlDisplayPassList =
      !!checkoutItemsWithPaymentPack.length ||
      !!checkoutItemsWithPrivatePass.length;

    const shouldDisplayPackList = !!checkoutItemsWithPaymentCombo.length;
    const shouldDisplayShopItemList = !!checkoutItemsWithShopItem.length;
    const shouldDisplayGiftcardList = !!checkoutItemsWithGiftcard.length;

    const numberOfListToDisplay = [
      shoudlDisplayPassList,
      shouldDisplayPackList,
      shouldDisplayShopItemList,
      shouldDisplayGiftcardList,
    ].filter((listToDisplay) => !!listToDisplay).length;

    return {
      shoudlDisplayPassList,
      shouldDisplayPackList,
      shouldDisplayShopItemList,
      shouldDisplayGiftcardList,
      numberOfListToDisplay,
    };
  },
);

const emptyCheckOutItemByBuyableItemIdentifier = () => ({
  [BuyableItemOptions.BUYABLE_ITEM_PASS]: [] as CheckoutItem[],
  [BuyableItemOptions.BUYABLE_ITEM_COMBO_ITEM]: [] as CheckoutItem[],
  [BuyableItemOptions.BUYABLE_ITEM_PRIVATE_PASS]: [] as CheckoutItem[],
  [BuyableItemOptions.BUYABLE_ITEM_SHOP_ITEM]: [] as CheckoutItem[],
  [BuyableItemOptions.BUYABLE_ITEM_COUPON]: [] as CheckoutItem[],
  [BuyableItemOptions.BUYABLE_ITEM_CREDIT]: [] as CheckoutItem[],
  [BuyableItemOptions.BUYABLE_ITEM_FEE]: [] as CheckoutItem[],
  [BuyableItemOptions.BUYABLE_ITEM_GIFTCARD]: [] as CheckoutItem[],
});

export const sortCheckoutItemByBuyableItemIdentifier = memoize(
  (checkoutItems: CheckoutItem[]) => {
    if (!checkoutItems?.length) {
      return emptyCheckOutItemByBuyableItemIdentifier();
    }

    const filteredCheckoutItems = checkoutItems?.filter(
      (checkoutItem) => !!checkoutItem,
    );

    return filteredCheckoutItems.reduce((acc, currventValue) => {
      switch (currventValue.buyable_item_identifier) {
        case BuyableItemOptions.BUYABLE_ITEM_PASS:
          acc[BuyableItemOptions.BUYABLE_ITEM_PASS]?.push(currventValue);
          break;
        case BuyableItemOptions.BUYABLE_ITEM_COMBO_ITEM:
          acc[BuyableItemOptions.BUYABLE_ITEM_COMBO_ITEM]?.push(currventValue);
          break;
        case BuyableItemOptions.BUYABLE_ITEM_PRIVATE_PASS:
          acc[BuyableItemOptions.BUYABLE_ITEM_PRIVATE_PASS].push(currventValue);
          break;
        case BuyableItemOptions.BUYABLE_ITEM_SHOP_ITEM:
          acc[BuyableItemOptions.BUYABLE_ITEM_SHOP_ITEM].push(currventValue);
          break;
        case BuyableItemOptions.BUYABLE_ITEM_COUPON:
          acc[BuyableItemOptions.BUYABLE_ITEM_COUPON].push(currventValue);
          break;
        case BuyableItemOptions.BUYABLE_ITEM_CREDIT:
          acc[BuyableItemOptions.BUYABLE_ITEM_CREDIT].push(currventValue);
          break;
        case BuyableItemOptions.BUYABLE_ITEM_FEE:
          acc[BuyableItemOptions.BUYABLE_ITEM_FEE].push(currventValue);
          break;
        case BuyableItemOptions.BUYABLE_ITEM_GIFTCARD:
          acc[BuyableItemOptions.BUYABLE_ITEM_GIFTCARD].push(currventValue);
          break;
        default:
          break;
      }
      return acc;
    }, emptyCheckOutItemByBuyableItemIdentifier());
  },
);

export const getIsCheckoutItemApplied = (
  checkoutItemExtraData: CheckoutItemExtraData,
): boolean =>
  checkoutItemExtraData?.is_applied !== undefined
    ? checkoutItemExtraData?.is_applied
    : true;

export const getIsCheckoutItemReferralItem = (
  checkoutItemExtraData: CheckoutItemExtraData,
): boolean => checkoutItemExtraData?.referral_coupon_type !== undefined;

export const getCheckoutItemPrice = ({
  checkoutItem,
  isExcludingTax,
}: {
  checkoutItem: CheckoutItem;
  isExcludingTax: boolean;
}): string => {
  const isApplied = getIsCheckoutItemApplied(checkoutItem.extra_data);
  const isReferralCouponItem = getIsCheckoutItemReferralItem(
    checkoutItem.extra_data,
  );

  if (!isReferralCouponItem) {
    const shouldDisplayQuantity =
      checkoutItem.buyable_item_identifier !== BUYABLE_ITEM_COUPON;

    const priceString = getCurrencyDisplayWithPrice(
      checkoutItem.unit_price,
      isExcludingTax,
      checkoutItem.tax,
    );

    return `${priceString}${
      shouldDisplayQuantity ? `x ${checkoutItem.quantity}` : ''
    }`;
  }

  // If the coupon is applicable, we want to display the amount actually retrieved from the
  // basket price, even though it is less than the available amount off.
  if (isApplied && checkoutItem.extra_data?.voucher_cts)
    return `${getCurrencyDisplayWithPrice(
      checkoutItem.extra_data?.voucher_cts / 100,
    )}`;

  // Else we will just display the available amount off, or percent off.
  if (checkoutItem.extra_data?.percent_off)
    return `-${checkoutItem.extra_data?.percent_off} %`;
  if (checkoutItem.extra_data?.amount_off)
    return `-${getCurrencyDisplayWithPrice(
      checkoutItem.extra_data?.amount_off,
    )}`;

  return '';
};

// check_payment_intent may be 'false' in the case when onFail from CheckPaymentStatus is triggered.
// In this case, we don't want to retrieve the secret as the payment is failed nor check the payment status.
export const shouldNotRetrieveSecret = (queryParams: {
  check_payment_intent?: 'true' | 'false';
  redirect_status?: 'succeeded' | 'pending' | 'failed';
}): boolean => {
  return (
    queryParams &&
    queryParams.check_payment_intent &&
    (queryParams.redirect_status === 'succeeded' ||
      queryParams.redirect_status === 'pending')
  );
};

export const shouldCheckPaymentStatus = (queryParams: {
  check_payment_intent?: 'true' | 'false';
  redirect_status?: 'succeeded' | 'pending' | 'failed';
}): boolean => {
  return (
    queryParams &&
    queryParams.check_payment_intent === 'true' &&
    (queryParams.redirect_status === 'succeeded' ||
      queryParams.redirect_status === 'pending')
  );
};

export const hasRedirectionFailed = (queryParams: {
  check_payment_intent?: 'true' | 'false';
  redirect_status?: 'succeeded' | 'pending' | 'failed';
}): boolean => {
  return (
    queryParams &&
    queryParams.check_payment_intent === 'true' &&
    queryParams.redirect_status === 'failed'
  );
};

export const basketHasPartiallyAppliedCoupon = (basket: Basket) =>
  basket?.checkout_items?.some(
    (checkoutItem) =>
      checkoutItem.buyable_item_identifier === BUYABLE_ITEM_COUPON &&
      getIsCheckoutItemApplied(checkoutItem.extra_data) &&
      Math.abs(checkoutItem.unit_price) > 0 &&
      Math.abs(checkoutItem.unit_price) * 100 <
        checkoutItem.extra_data?.theoretical_voucher_cts,
  );

/**
 * Removes specified query params from the current URL without reloading the page.
 * Preserves the hash fragment.
 * @param paramsToRemove Array of query param names to remove
 */
export const removeQueryParamsFromUrl = (paramsToRemove: string[]): void => {
  const url = new URL(window.location.href);
  let changed = false;
  for (const param of paramsToRemove) {
    if (url.searchParams.has(param)) {
      url.searchParams.delete(param);
      changed = true;
    }
  }
  if (changed) {
    window.history.replaceState(
      window.history.state,
      '',
      url.pathname + url.search + url.hash,
    );
  }
};

export const getBasketItemCount = (checkoutItems: CheckoutItem[]) =>
  checkoutItems.reduce((acc, item) => acc + item.quantity, 0);

export const checkIfPurchasedPassGrantsDoorAccess = (
  checkoutItems: CheckoutItem[],
  paymentPackById: Record<number, PaymentPack>,
  privatePassById: Record<number, PrivatePass>,
): boolean => {
  const sortedCheckoutItems =
    sortCheckoutItemByBuyableItemIdentifier(checkoutItems);
  const checkoutItemsWithPaymentPack =
    sortedCheckoutItems?.[BuyableItemOptions.BUYABLE_ITEM_PASS] ?? [];
  const checkoutItemsWithPrivatePass =
    sortedCheckoutItems?.[BuyableItemOptions.BUYABLE_ITEM_PRIVATE_PASS] ?? [];

  return (
    checkoutItemsWithPaymentPack.some((checkoutItem) => {
      const paymentPack = paymentPackById[checkoutItem.buyable_item_id];
      return paymentPack?.grants_door_access === true;
    }) ||
    checkoutItemsWithPrivatePass.some((checkoutItem) => {
      const privatePass = privatePassById[checkoutItem.buyable_item_id];
      return privatePass?.grants_door_access === true;
    })
  );
};
