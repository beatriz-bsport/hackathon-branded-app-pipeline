import { createAction } from 'redux-actions';
import api from './api';
import { Dispatch, OptionCallback } from '../../state/types';
import { CashBook, CashBookUpdate } from './types';

export const cashBookDetail = {
  error: createAction<Error | null>('CASHBOOK/DETAIL/ERROR'),
  isLoading: createAction<boolean>('CASHBOOK/DETAIL/IS_LOADING'),
  success: createAction<CashBook>('CASHBOOK/DETAIL/SUCCESS'),
};

export const cashBookUpdate = {
  error: createAction<Error | null>('CASHBOOK/UDPATE/ERROR'),
  isLoading: createAction<boolean>('CASHBOOK/UPDATE/IS_LOADING'),
};

export function fetchCashBook(companyId: number) {
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

export function updateCashBook(data: CashBookUpdate, options?: OptionCallback) {
  return async (dispatch: Dispatch) => {
    dispatch(cashBookUpdate.isLoading(true));
    dispatch(cashBookUpdate.error(null));

    try {
      const response = await api.updateCashBook(data);
      dispatch(cashBookDetail.success(response.data));
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
