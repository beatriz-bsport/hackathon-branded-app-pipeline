// @flow

import { createAction } from 'redux-actions';
import { Dispatch, ThunkAction, OptionCallback } from '../../state/types';
import { RootState } from '../../reducers';
import { ReportConfiguration } from '../reporting/types';
import { snackbarSuccess, snackbarError } from '../snackbar/actions';

import {
  fetchPaymentMethodList as fetchPaymentMethodListAPI,
  fetchOnSpotPaymentReport as fetchOnSpotPaymentReportAPI,
  fetchPaymentGroupList as fetchPaymentGroupListAPI,
  fetchPayoutList as fetchPayoutListAPI,
  updatePaymentGroupPriceCts as updatePaymentGroupPriceCtsAPI,
  detachPaymentMetod as detachPaymentMetodAPI,
} from './api';
import { PaymentMethod, Payout } from './types';

// Active campaign Account
export const listSavedPaymentMethodListActions = {
  isLoading: createAction('PAYMENT_METHOD/LIST/LOADING'),
  error: createAction('PAYMENT_METHOD/LIST/ERROR'),
  success: createAction('PAYMENT_METHOD/LIST/SUCCESS'),
};

export function fetchPaymentMethodList(
  params: any = {},
  options: OptionCallback<PaymentMethod>,
): ThunkAction {
  return async (dispatch: Dispatch) => {
    dispatch(listSavedPaymentMethodListActions.isLoading(true));
    dispatch(listSavedPaymentMethodListActions.error(null));
    try {
      const response = await fetchPaymentMethodListAPI(params);
      dispatch(listSavedPaymentMethodListActions.success(response.data));
      if (options && options.onSuccess) {
        options.onSuccess(response.data);
      }
    } catch (err) {
      dispatch(listSavedPaymentMethodListActions.error(err));
    }
    dispatch(listSavedPaymentMethodListActions.isLoading(false));
  };
}

export const detachPaymentMethodActions = {
  isLoading: createAction('PAYMENT_METHOD/DETACH/LOADING'),
  error: createAction('PAYMENT_METHOD/DETACH/ERROR'),
  success: createAction('PATMENT_METHOD/DETACH/SUCCESS'),
};
export function detachPaymentMethod(params: any, options: OptionCallback) {
  return async (dispatch: Dispatch) => {
    dispatch(detachPaymentMethodActions.error(null));
    dispatch(detachPaymentMethodActions.isLoading(true));
    try {
      const response = await detachPaymentMetodAPI(params);
      dispatch(detachPaymentMethodActions.success(response.data));
      dispatch(snackbarSuccess('invoice:paymentMethod.detach.pm_deleted'));
      if (options && options.onSuccess) {
        options.onSuccess();
      }
    } catch (err) {
      console.error(err);
      dispatch(detachPaymentMethodActions.success({}));
      if (err.response?.status === 499 && err.response?.data?.error_code) {
        dispatch(snackbarError(`errorCode.${err.response.data.error_code}`));
      }
      if (options && options.onError) {
        options.onError(err);
      }
      dispatch(detachPaymentMethodActions.error(err.response.data));
    }
    dispatch(detachPaymentMethodActions.isLoading(false));
  };
}
export const onSpotPaymentReportActions = {
  isLoading: createAction('ON-SPOT-PAYMENT/REPORT/LOADING'),
  error: createAction('ON-SPOT-PAYMENT/REPORT/ERROR'),
  success: createAction('ON-SPOT-PAYMENT/REPORT/SUCCESS'),
};

export function fetchOnSpotPaymentReport(
  params: any = {},
  options: OptionCallback<ReportConfiguration>,
): ThunkAction {
  return async (dispatch: Dispatch) => {
    dispatch(onSpotPaymentReportActions.isLoading(true));
    dispatch(onSpotPaymentReportActions.error(null));
    try {
      const response = await fetchOnSpotPaymentReportAPI(params);
      dispatch(onSpotPaymentReportActions.success(response.data));
      if (options && options.onSuccess) {
        options.onSuccess(response.data);
      }
    } catch (err) {
      dispatch(onSpotPaymentReportActions.error(err));
    }
    dispatch(onSpotPaymentReportActions.isLoading(false));
  };
}

export const listPaymentGroupActions = {
  isLoading: createAction('PAYMENT_GROUP/LIST/LOADING'),
  error: createAction('PAYMENT_GROUP/LIST/ERROR'),
  success: createAction('PAYMENT_GROUP/LIST/SUCCESS'),
};

export function fetchPaymentGroupList(
  params: any = {},
  options: OptionCallback,
): ThunkAction {
  return async (dispatch: Dispatch) => {
    dispatch(listPaymentGroupActions.isLoading(true));
    dispatch(listPaymentGroupActions.error(null));
    try {
      const response = await fetchPaymentGroupListAPI(params);
      dispatch(listPaymentGroupActions.success(response.data));
      if (options && options.onSuccess) {
        options.onSuccess(response.data);
      }
    } catch (err) {
      console.error(err);
      dispatch(listPaymentGroupActions.error(err));
    }
    dispatch(listPaymentGroupActions.isLoading(false));
  };
}

export const listPayoutActions = {
  isLoading: createAction('PAYOUT/LIST/LOADING'),
  error: createAction('PAYOUT/LIST/ERROR'),
  success: createAction('PAYOUT/LIST/SUCCESS'),
};

export function fetchPayoutList(
  params: any = {},
  options: OptionCallback<Payout[]>,
): ThunkAction {
  return async (dispatch: Dispatch, getState: () => RootState) => {
    dispatch(listPayoutActions.isLoading(true));
    dispatch(listPayoutActions.error(null));
    const { nextPage } = getState().paymentBackend.payout;
    try {
      const response = await fetchPayoutListAPI({
        ...(params || {}),
        page: nextPage,
      });
      dispatch(listPayoutActions.success({ ...response.data, page: nextPage }));
      if (options && options.onSuccess) {
        options.onSuccess(response.data);
      }
    } catch (err) {
      console.error(err);
      dispatch(listPayoutActions.error(err));
    }
    dispatch(listPayoutActions.isLoading(false));
  };
}

export const updatePaymentGroupPriceCtsActions = {
  isLoading: createAction('PAYMENT_GROUP/UPDATE_PRICE/LOADING'),
  error: createAction('PAYMENT_GROUP/UPDATE_PRICE/ERROR'),
  success: createAction('PAYMENT_GROUP/UPDATE_PRICE/SUCCESS'),
};

export function updatePaymentGroupPriceCts(
  id: number,
  price_cts: number,
  options: OptionCallback,
): ThunkAction {
  return async (dispatch: Dispatch) => {
    dispatch(updatePaymentGroupPriceCtsActions.isLoading(true));
    dispatch(updatePaymentGroupPriceCtsActions.error(null));
    try {
      const response = await updatePaymentGroupPriceCtsAPI(id, price_cts);
      dispatch(updatePaymentGroupPriceCtsActions.success(response.data));
      if (options && options.onSuccess) {
        options.onSuccess(response.data);
      }
    } catch (err) {
      console.error(err);
      dispatch(updatePaymentGroupPriceCtsActions.error(err));
    }
    dispatch(updatePaymentGroupPriceCtsActions.isLoading(false));
  };
}
