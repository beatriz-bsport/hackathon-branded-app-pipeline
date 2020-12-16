// @flow
import api from '../api';
import types from './payment.types';
import type { Dispatch } from '../state/types.ts';

export function startCheckingOptionExistence() {
  return { type: types.PAYMENT_START_CHECKING_OPTION_EXISTENCE };
}
export function errorCheckingOptionExistence(error: ?Error) {
  return { type: types.PAYMENT_ERROR_CHEKING_OPTION_EXISTENCE, error };
}
export function checkedOptionExistence(exists: boolean) {
  return { type: types.PAYMENT_HAS_CHECKED_OPTION_EXISTENCE, exists };
}
export function checkOptionExistence(offerId: number) {
  return async (dispatch: Dispatch) => {
    dispatch(startCheckingOptionExistence());
    dispatch(errorCheckingOptionExistence(null));

    try {
      const response = await api.consumer.hasBookingOptionInOffer(offerId);
      const exists = response.data;
      dispatch(checkedOptionExistence(exists));
    } catch (err) {
      dispatch(errorCheckingOptionExistence(err));
    }
  };
}

export function startFetchBookingOption() {
  return { type: types.PAYMENT_START_FETCH_OPTION };
}
export function errorFetchingBookingOption(error: ?Error) {
  return { type: types.PAYMENT_ERROR_FETCHING_OPTION, error };
}
export function fetchedBookingOption(option: BookingOption) {
  return { type: types.PAYMENT_HAS_FETCHED_OPTION, option };
}
export function fetchBookingOption(id: number) {
  return async (dispatch: Dispatch) => {
    dispatch(startFetchBookingOption());
    dispatch(errorFetchingBookingOption(null));

    try {
      const response = await api.payment.fetchBookingOption(id);
      const option = response.data;
      dispatch(fetchedBookingOption(option));
    } catch (err) {
      dispatch(errorFetchingBookingOption(err));
    }
  };
}

export function startFetchOffer() {
  return { type: types.PAYMENT_START_FETCH_OFFER };
}
export function errorFetchingOffer(err: ?Error) {
  return { type: types.PAYMENT_ERROR_FETCHING_OFFER, err };
}
export function fetchedOffer(offer: Offer) {
  return { type: types.PAYMENT_HAS_FETCHED_OFFER, offer };
}
export function fetchOffer(id: number) {
  return async (dispatch: Dispatch) => {
    dispatch(startFetchOffer());
    dispatch(errorFetchingOffer(null));

    try {
      const response = await api.payment.fetchOffer(id);
      const offer = response.data;
      dispatch(fetchedOffer(offer));
    } catch (err) {
      dispatch(errorFetchingOffer(err));
    }
  };
}

export function startFetchPaymentPack() {
  return { type: types.PAYMENT_START_FETCH_PAYMENT_PACK };
}
export function errorFetchingPaymentPack(error: ?Error) {
  return { type: types.PAYMENT_ERROR_FETCHING_PAYMENT_PACK, error };
}
export function fetchedPaymentPack(paymentPack: PaymentPack) {
  return { type: types.PAYMENT_HAS_FETCHED_PAYMENT_PACK, paymentPack };
}
export function fetchPaymentPack(id: number, options: OptionCallback) {
  return async (dispatch: Dispatch) => {
    dispatch(startFetchPaymentPack());
    dispatch(errorFetchingPaymentPack(null));

    try {
      const response = await api.payment.fetchPaymentPack(id);
      const paymentPack = response.data;
      dispatch(fetchedPaymentPack(paymentPack));
      if (options && options.onSuccess) {
        options.onSuccess(paymentPack);
      }
    } catch (err) {
      dispatch(errorFetchingPaymentPack(err));
      if (options && options.onError) {
        options.onError(err);
      }
    }
  };
}

export function startFetchShopItem() {
  return { type: types.PAYMENT_START_FETCH_SHOP_ITEM };
}
export function errorFetchingShopItem(error: ?Error) {
  return { type: types.PAYMENT_ERROR_FETCHING_SHOP_ITEM, error };
}
export function fetchedShopItem(shopItem: any) {
  return { type: types.PAYMENT_HAS_FETCHED_SHOP_ITEM, shopItem };
}
export function fetchShopItem(id: number, options: OptionCallback) {
  return async (dispatch: Dispatch) => {
    dispatch(startFetchShopItem());
    dispatch(errorFetchingShopItem(null));

    try {
      const response = await api.payment.fetchShopItem(id);
      const shopItem = response.data;
      dispatch(fetchedShopItem(shopItem));
      if (options && options.onSuccess) {
        options.onSuccess(shopItem);
      }
    } catch (err) {
      dispatch(errorFetchingShopItem(err));
      if (options && options.onError) {
        options.onError(err);
      }
    }
  };
}

export function startFetchCompatiblePass() {
  return { type: types.PAYMENT_START_FETCH_COMPATIBLE_PASS };
}
export function errorFetchingCompatiblePass(error: ?Error) {
  return { type: types.PAYMENT_ERROR_FETCHING_COMPATIBLE_PASS, error };
}
export function fetchedCompatiblePass(consumerPacks) {
  return { type: types.PAYMENT_HAS_FETCHED_COMPATIBLE_PASS, consumerPacks };
}
export function fetchCompatiblePass(offerId: number, memberId: number) {
  return async (dispatch: Dispatch) => {
    dispatch(startFetchCompatiblePass());
    dispatch(errorFetchingCompatiblePass(null));

    try {
      const response = await api.payment.fetchCompatiblePass(offerId, memberId);
      const consumerPacks = response.data;
      dispatch(fetchedCompatiblePass(consumerPacks));
    } catch (err) {
      dispatch(errorFetchingCompatiblePass(err));
    }
  };
}
export function startFetchCompatiblePaymentPacks() {
  return { type: types.PAYMENT_START_FETCH_COMPATIBLE_PAYMENT_PACKS };
}
export function errorFetchingCompatiblePaymentPacks(error: ?Error) {
  return { type: types.PAYMENT_ERROR_FETCHING_COMPATIBLE_PAYMENT_PACKS, error };
}
export function fetchedCompatiblePaymentPacks(
  paymentPacks: Array<PaymentPack>,
) {
  return {
    type: types.PAYMENT_HAS_FETCHED_COMPATIBLE_PAYMENT_PACKS,
    paymentPacks,
  };
}
export function fetchCompatiblePaymentPacks(offerId: number) {
  return async (dispatch: Dispatch) => {
    dispatch(startFetchCompatiblePaymentPacks());
    dispatch(errorFetchingCompatiblePaymentPacks(null));

    try {
      const response = await api.payment.fetchCompatiblePaymentPacks(offerId);
      const paymentPacks = response.data;
      dispatch(fetchedCompatiblePaymentPacks(paymentPacks));
    } catch (err) {
      dispatch(errorFetchingCompatiblePaymentPacks(err));
    }
  };
}
