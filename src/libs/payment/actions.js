// @flow

import { createAction } from 'redux-actions';
import type { Dispatch, ThunkAction, OptionCallBack } from '../../state/types';

import {
  fetchPaymentMethodList as fetchPaymentMethodListAPI,
  fetchOnSpotPaymentReport as fetchOnSpotPaymentReportAPI,
  fetchPaymentGroupList as fetchPaymentGroupListAPI,
  fetchPayoutList as fetchPayoutListAPI,
} from './api';

// Active campaign Account
export const listSavedPaymentMethodListActions = {
  isLoading: createAction('PAYMENT_METHOD/LIST/LOADING'),
  error: createAction('PAYMENT_METHOD/LIST/ERROR'),
  success: createAction('PAYMENT_METHOD/LIST/SUCCESS'),
};

export function fetchPaymentMethodList(
  params: any = {},
  options: OptionCallBack,
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

export const onSpotPaymentReportActions = {
  isLoading: createAction('ON-SPOT-PAYMENT/REPORT/LOADING'),
  error: createAction('ON-SPOT-PAYMENT/REPORT/ERROR'),
  success: createAction('ON-SPOT-PAYMENT/REPORT/SUCCESS'),
};

export function fetchOnSpotPaymentReport(
  params: any = {},
  options: OptionCallBack,
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
  options: OptionCallBack,
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
  options: OptionCallBack,
): ThunkAction {
  return async (dispatch: Dispatch, getState: () => State) => {
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
