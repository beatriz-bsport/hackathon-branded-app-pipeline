// @flow

import { createAction } from 'redux-actions';

import { fetchPlatformInvoiceList as fetchPlatformInvoiceListAPI } from './api';

import type { Dispatch, OptionCallback } from '../../state/types';

export const listPlatformInvoiceActions = {
  isLoading: createAction('PLATFORM_INVOICE/LIST/IS_LOADING'),
  error: createAction('PLATFORM_INVOICE/LIST/ERROR'),
  success: createAction('PLATFORM_INVOICE/LIST/SUCCESS'),
};

export function fetchPlatformInvoiceList(
  params: any = {},
  options: OptionCallback,
) {
  return async (dispatch: Dispatch) => {
    dispatch(listPlatformInvoiceActions.isLoading(true));
    dispatch(listPlatformInvoiceActions.error(null));
    try {
      const response = await fetchPlatformInvoiceListAPI(params);
      dispatch(listPlatformInvoiceActions.success(response.data));
      if (options && options.onSuccess) {
        options.onSuccess(response.data);
      }
    } catch (err) {
      console.error(err);
      dispatch(listPlatformInvoiceActions.error(err));
      if (options && options.onError) options.onError();
    }
    dispatch(listPlatformInvoiceActions.isLoading(false));
  };
}
