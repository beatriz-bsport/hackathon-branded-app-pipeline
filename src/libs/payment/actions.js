// @flow

import { createAction } from 'redux-actions';
import type { Dispatch, ThunkAction, OptionCallBack } from '../../state/types.ts';

import {
  fetchPaymentMethodList as fetchPaymentMethodListAPI,
  fetchOnSpotPaymentReport as fetchOnSpotPaymentReportAPI,
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
