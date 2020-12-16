// @flow

import { createAction } from 'redux-actions';

import {
  fetchPaymentComboList as fetchPaymentComboListAPI,
  fetchPaymentComboPurchaseList as fetchPaymentComboPurchaseListAPI,
  createOrUpdatePaymentCombo as createOrUpdatePaymentComboAPI,
  retrievePaymentCombo as retrievePaymentComboAPI,
  deletePaymentCombo as deletePaymentComboAPI,
} from './api';

import type { Dispatch, ThunkAction, OptionCallback } from '../../state/types.ts';
import type { PaymentComboPayload } from './types';

export const paymentComboListActions = {
  error: createAction('PAYMENT_COMBO/LIST/ERROR'),
  isLoading: createAction('PAYMENT_COMBO/LIST/IS_LOADING'),
  success: createAction('PAYMENT_COMBO/LIST/SUCCESS'),
};

export const paymentComboCreateOrUpdateActions = {
  error: createAction('PAYMENT_COMBO/CREATE_OR_UPDATE/ERROR'),
  isLoading: createAction('PAYMENT_COMBO/CREATE_OR_UPDATE/IS_LOADING'),
  success: createAction('PAYMENT_COMBO/CREATE_OR_UPDATE/SUCCESS'),
};

export const paymentComboDeleteActions = {
  error: createAction('PAYMENT_COMBO/DELETE/ERROR'),
  isLoading: createAction('PAYMENT_COMBO/DELETE/IS_LOADING'),
  success: createAction('PAYMENT_COMBO/DELETE/SUCCESS'),
};

export const paymentComboRetrieveActions = {
  error: createAction('PAYMENT_COMBO/RETRIEVE/ERROR'),
  isLoading: createAction('PAYMENT_COMBO/RETRIEVE/IS_LOADING'),
  success: createAction('PAYMENT_COMBO/RETRIEVE/SUCCESS'),
};

export function fetchPaymentCombo(
  id: number,
  options: OptionCallback,
): ThunkAction {
  return async (dispatch: Dispatch) => {
    dispatch(paymentComboRetrieveActions.isLoading(true));
    dispatch(paymentComboRetrieveActions.error(null));

    try {
      const response = await retrievePaymentComboAPI(id);
      dispatch(paymentComboRetrieveActions.success(response.data));
      dispatch(paymentComboRetrieveActions.error(null));
      if (options && options.onSuccess) options.onSuccess(response.data);
    } catch (error) {
      console.error(error);
      dispatch(paymentComboRetrieveActions.error(error));
      if (options && options.onError) options.onError(error);
    }

    dispatch(paymentComboRetrieveActions.isLoading(false));
  };
}

export function fetchPaymentComboList(params: any): ThunkAction {
  return async (dispatch: Dispatch) => {
    dispatch(paymentComboListActions.isLoading(true));
    dispatch(paymentComboListActions.error(null));

    try {
      const response = await fetchPaymentComboListAPI(params);
      dispatch(paymentComboListActions.success(response.data));
      dispatch(paymentComboListActions.error(null));
    } catch (error) {
      console.error(error);
      dispatch(paymentComboListActions.error(error));
    }

    dispatch(paymentComboListActions.isLoading(false));
  };
}

export function deletePaymentCombo(id: number): ThunkAction {
  return async (dispatch: Dispatch) => {
    dispatch(paymentComboDeleteActions.isLoading(true));
    dispatch(paymentComboDeleteActions.error(null));

    try {
      await deletePaymentComboAPI(id);
      dispatch(paymentComboDeleteActions.success(id));
      dispatch(paymentComboDeleteActions.error(null));
    } catch (error) {
      console.error(error);
      dispatch(paymentComboDeleteActions.error(error));
    }
    dispatch(paymentComboDeleteActions.isLoading(false));
  };
}

export function createOrUpdatePaymentCombo(
  data: PaymentComboPayload,
  options?: { onSuccess?: () => void, onError?: () => void },
): ThunkAction {
  return async (dispatch: Dispatch) => {
    dispatch(paymentComboCreateOrUpdateActions.isLoading(true));
    dispatch(paymentComboCreateOrUpdateActions.error(null));

    try {
      const response = await createOrUpdatePaymentComboAPI(data);
      dispatch(paymentComboCreateOrUpdateActions.success(response.data));
      dispatch(paymentComboCreateOrUpdateActions.error(null));
      if (options && options.onSuccess) options.onSuccess();
    } catch (error) {
      console.error(error);
      dispatch(paymentComboCreateOrUpdateActions.error(error));
      if (options && options.onError) options.onError();
    }

    dispatch(paymentComboCreateOrUpdateActions.isLoading(false));
  };
}

export const paymentComboPurchaseListActions = {
  error: createAction('PAYMENT_COMBO_PURCHASE/LIST/ERROR'),
  isLoading: createAction('PAYMENT_COMBO_PURCHASE/LIST/IS_LOADING'),
  success: createAction('PAYMENT_COMBO_PURCHASE/LIST/SUCCESS'),
};

export function fetchPaymentComboPurchaseList(
  params: any,
  options?: { onSuccess?: () => void, onError?: () => void },
): ThunkAction {
  return async (dispatch: Dispatch) => {
    dispatch(paymentComboPurchaseListActions.isLoading(true));
    dispatch(paymentComboPurchaseListActions.error(null));

    try {
      const response = await fetchPaymentComboPurchaseListAPI(params);
      dispatch(paymentComboPurchaseListActions.success(response.data));
      dispatch(paymentComboPurchaseListActions.error(null));
      if (options && options.onSuccess) options.onSuccess();
    } catch (error) {
      console.error(error);
      dispatch(paymentComboPurchaseListActions.error(error));
      if (options && options.onError) options.onError();
    }

    dispatch(paymentComboPurchaseListActions.isLoading(false));
  };
}

export const paymentComboForBookingActions = {
  error: createAction('PAYMENT_COMBO_PURCHASE/FOR_BOOKING/ERROR'),
  isLoading: createAction('PAYMENT_COMBO_PURCHASE/FOR_BOOKING/IS_LOADING'),
  success: createAction('PAYMENT_COMBO_PURCHASE/FOR_BOOKING/SUCCESS'),
  reset: createAction('PAYMENT_COMBO_PURCHASE/FOR_BOOKING/RESET'),
};

export const resetPaymentComboForBooking = paymentComboForBookingActions.reset;

export function fetchPaymentComboForBooking(
  company: number,
  offer: number,
  options: OptionCallback,
) {
  return async (dispatch: Dispatch) => {
    dispatch(paymentComboForBookingActions.isLoading(true));
    dispatch(paymentComboForBookingActions.error(null));

    try {
      const response = await fetchPaymentComboListAPI({
        manager_only: false,
        available: true,
        company,
        offer,
      });
      dispatch(paymentComboForBookingActions.success(response.data));
      dispatch(paymentComboForBookingActions.error(null));
      if (options && options.onSuccess) options.onSuccess();
    } catch (error) {
      console.error(error);
      dispatch(paymentComboForBookingActions.error(error));
      if (options && options.onError) options.onError();
    }

    dispatch(paymentComboForBookingActions.isLoading(false));
  };
}
