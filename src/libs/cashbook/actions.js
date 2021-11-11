// @flow

import { createAction } from 'redux-actions';
import api from './api';
import type { Dispatch } from '../../state/types';

export const cashBookDetail = {
  error: createAction('CASHBOOK/DETAIL/ERROR'),
  isLoading: createAction('CASHBOOK/DETAIL/IS_LOADING'),
  success: createAction('CASHBOOK/DETAIL/SUCCESS'),
};

export const cashBookUpdate = {
  error: createAction('CASHBOOK/UDPATE/ERROR'),
  isLoading: createAction('CASHBOOK/UPDATE/IS_LOADING'),
};

export function fetchCashBook(companyId: ?number) {
  return async (dispatch: Dispatch) => {
    dispatch(cashBookDetail.isLoading(true));
    dispatch(cashBookDetail.error(null));

    try {
      const response = await api.fetchCashBook(companyId);
      const cashBook = response.data;
      dispatch(cashBookDetail.success(cashBook));
      dispatch(cashBookDetail.isLoading(false));
    } catch (err) {
      console.error(err);
      dispatch(cashBookDetail.error(err));
      dispatch(cashBookDetail.isLoading(false));
    }
  };
}

export function updateCashBook(
  data: any,
  options: ?{ onError: ?() => void, onSuccess: ?() => void },
) {
  return async (dispatch: Dispatch) => {
    dispatch(cashBookUpdate.isLoading(true));
    dispatch(cashBookUpdate.error(null));

    try {
      const response = await api.updateCashBook(data);
      const cashBook = response.data;
      dispatch(cashBookDetail.success(cashBook));
      dispatch(cashBookUpdate.isLoading(false));
      if (options && options.onSuccess) options.onSuccess();
    } catch (err) {
      console.error(err);
      dispatch(cashBookUpdate.error(err));
      dispatch(cashBookUpdate.isLoading(false));
      if (options && options.onError) options.onError();
    }
  };
}
