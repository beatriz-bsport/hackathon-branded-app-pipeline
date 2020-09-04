// @flow

import { createAction } from 'redux-actions';
import type { Dispatch, ThunkAction, OptionCallBack } from '../../state/types';

import { fetchPaymentMethodList as fetchPaymentMethodListAPI } from './api';

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
