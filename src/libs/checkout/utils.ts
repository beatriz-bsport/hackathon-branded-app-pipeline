import { TFunction } from 'i18next';
import { SPOT_NOT_AVAILABLE } from '@bsport/common/lib/master-data/error-codes/buyable-item-can-not-be-bought';
import { BUYABLE_ITEM_FEE } from '@bsport/common/lib/master-data/buyable-items';
import { OFFER_WAITING_LIST_NO_USABLE_CONSUMER_PAYMENT_PACK } from '@bsport/common/lib/master-data/error-codes/waitinglist-can-not-be-joined';
import {
  LOCK_ACQUISITION_FAILURE_GENERIC,
  LOCK_ACQUISITION_FAILURE_SPOT_SCHEDULING,
} from '@bsport/common/lib/master-data/error-codes/lock';
import { getPrice } from '#libs/theme/utils';
import { getCompanyCountry } from '#libs/theme/selectors';
import { Basket, ConfirmationStatus, PrepaidLine } from './types';
import {
  EXCEPTION_BOOKING_GUEST_GENERIC,
  EXCEPTION_BOOKING_GUEST_IS_UNAVAILABLE_IN_OFFER,
  EXCEPTION_BOOKING_GUEST_IS_UNAVAILABLE_IN_PASS,
  EXCEPTION_BOOKING_GUEST_IS_UNAVAILABLE_IN_SETTINGS,
  EXCEPTION_BOOKING_GUEST_OVERCOME_LIMIT,
  EXCEPTION_BOOKING_GUEST_REACHED_LIMIT,
  EXCEPTION_BOOKING_GUEST_NOT_ENOUGH_SPOT,
} from './constants';
import type { MarketplacePaymentMethodBillingDetails } from '#libs/marketplace/types';
import { OfferWithSpotInformation } from '#libs/offer/types';
import { Subscription } from '#libs/subscription/types';

export const getBasketTotalPriceExcludingTax = (
  basket: Basket | Basket<string, PrepaidLine> | Basket<number, PrepaidLine>,
  excludeDeliveryFee?: boolean,
): string => {
  // if we don't have items, or items with no quantity, price returned is always 0
  if (
    !basket.checkout_items.length ||
    basket.checkout_items.reduce((acc, ci) => acc + ci.quantity || 0, 0) === 0
  ) {
    return parseFloat('0').toFixed(2);
  }

  const sum_prices_without_vouchers = basket.checkout_items.reduce(
    (acc, ci) => (ci.tax ? acc + ci.unit_price * ci.quantity : acc),
    0,
  );

  // we calculate the mean tax among products to apply it to the entire basket
  const mean_tax =
    sum_prices_without_vouchers !== 0
      ? // if the sum of the prices is not null, we take the mean tax pondered by prices
        basket.checkout_items.reduce(
          (acc, ci) => acc + ci.unit_price * (ci.tax || 0) * ci.quantity,
          0,
        ) / sum_prices_without_vouchers
      : // else, in the situation where all prices are null, we ponderate through quantity
        basket.checkout_items.reduce(
          (acc, ci) => acc + (ci.tax || 0) * ci.quantity,
          0,
        ) / basket.checkout_items.reduce((acc, ci) => acc + ci.quantity, 0);

  const sum_prices = basket.checkout_items.reduce(
    (acc, ci) =>
      excludeDeliveryFee && ci.buyable_item_identifier === BUYABLE_ITEM_FEE
        ? acc
        : acc + ci.unit_price * ci.quantity,
    0,
  );
  return parseFloat(getPrice(sum_prices, true, mean_tax)).toFixed(2);
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

export const getConfirmationStatus = (
  isError: boolean,
  codeError: number,
  offers: OfferWithSpotInformation[],
  basket: Basket,
  billingPlan: Subscription,
  offersOnWaitingList: number[],
) => {
  if (isError) {
    if (!codeError) {
      return ConfirmationStatus.GENERIC_ERROR;
    }
    switch (codeError) {
      case SPOT_NOT_AVAILABLE:
      case LOCK_ACQUISITION_FAILURE_SPOT_SCHEDULING:
      case LOCK_ACQUISITION_FAILURE_GENERIC:
        return ConfirmationStatus.OFFER_ONLY_BOOKING_ERROR;
      default:
        return ConfirmationStatus.GENERIC_OFFER_ERROR;
    }
  }
  if (!!offers?.length && !basket && !billingPlan) {
    return ConfirmationStatus.OFFER_ONLY_SUCCESS;
  }
  if (!!offers?.length && (!!basket || !!billingPlan)) {
    if (!codeError) {
      return ConfirmationStatus.OFFER_AND_PURCHASE_SUCCESS;
    }
    switch (codeError) {
      case SPOT_NOT_AVAILABLE:
      case LOCK_ACQUISITION_FAILURE_SPOT_SCHEDULING:
      case LOCK_ACQUISITION_FAILURE_GENERIC:
        return ConfirmationStatus.OFFER_BOOKING_ERROR_WITH_PURCHASE;
      default:
        return ConfirmationStatus.OFFER_GENERIC_ERROR_WITH_PURCHASE;
    }
  }
  if (offersOnWaitingList?.length) {
    return ConfirmationStatus.WAITING_LIST;
  }
  return ConfirmationStatus.PURCHASE_ONLY_SUCCESS;
};
