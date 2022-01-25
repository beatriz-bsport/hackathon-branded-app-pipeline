import { createAction } from 'redux-actions';
import { OptionCallback, ThunkAction, Dispatch } from '../../state/types';
import { InstalmentPaymentApi } from './types';
import {
  updateInstalmentPayment as updateInstalmentPaymentAPI,
  createInstalmentPayment as createInstalmentPaymentAPI,
  fetchInstalmentPayment as fetchInstalmentPaymentAPI,
  deleteInstalmentPayment as deleteInstalmentPaymentAPI,
  fetchInstalmentPaymentByBasket as fetchInstalmentPaymentByBasketAPI,
} from './api';
import { snackbarError, snackbarSuccess } from '#libs/snackbar/actions';

export const instalmentPaymentDisableActions = {
  error: createAction('INSTALMENT_PAYMENT/DISABLE/ERROR'),
  isLoading: createAction('INSTALMENT_PAYMENT/DISABLE/IS_LOADING'),
  success: createAction('INSTALMENT_PAYMENT/DISABLE/SUCCESS'),
};

export function disableInstalmentPayment(
  id: number,
  options?: OptionCallback<number>,
): ThunkAction {
  return async (dispatch: Dispatch) => {
    dispatch(instalmentPaymentDisableActions.isLoading(true));
    dispatch(instalmentPaymentDisableActions.error(null));
    try {
      deleteInstalmentPaymentAPI(id);

      dispatch(instalmentPaymentDisableActions.success(id));
      options?.onSuccess && options.onSuccess(id);

      dispatch(snackbarSuccess('instalmentPayment:action.disable.success'));
    } catch (error) {
      dispatch(instalmentPaymentDisableActions.error(error));
      options?.onError && options.onError(error);

      dispatch(snackbarError('instalmentPayment:action.disable.error'));
    }
    dispatch(instalmentPaymentDisableActions.isLoading(false));
  };
}

export const instalmentPaymentCreateOrUpdateActions = {
  error: createAction('INSTALMENT_PAYMENT/CREATE_OR_UPDATE/ERROR'),
  isLoading: createAction('INSTALMENT_PAYMENT/CREATE_OR_UPDATE/IS_LOADING'),
  success: createAction('INSTALMENT_PAYMENT/CREATE_OR_UPDATE/SUCCESS'),
};
export function createOrUpdateInstalmentPayment(
  data: InstalmentPaymentApi,
  options?: OptionCallback<InstalmentPaymentApi>,
): ThunkAction {
  return async (dispatch: Dispatch) => {
    dispatch(instalmentPaymentCreateOrUpdateActions.isLoading(true));
    dispatch(instalmentPaymentCreateOrUpdateActions.error(null));
    const apiCall = data.id
      ? updateInstalmentPaymentAPI
      : createInstalmentPaymentAPI;
    try {
      const response = await apiCall(data);

      dispatch(instalmentPaymentCreateOrUpdateActions.success(response.data));
      options?.onSuccess && options.onSuccess(response.data);
      if (data.id) {
        dispatch(snackbarSuccess('instalmentPayment:action.edit.success'));
      } else {
        dispatch(snackbarSuccess('instalmentPayment:action.create.success'));
      }
    } catch (error) {
      dispatch(instalmentPaymentCreateOrUpdateActions.error(error));
      options?.onError && options.onError(error);
      if (data.id) {
        dispatch(snackbarError('instalmentPayment:action.edit.error'));
      } else {
        dispatch(snackbarError('instalmentPayment:action.create.error'));
      }
    }
    dispatch(instalmentPaymentCreateOrUpdateActions.isLoading(false));
  };
}

export const instalmentPaymentListActions = {
  error: createAction('INSTALMENT_PAYMENT/FETCH/ERROR'),
  isLoading: createAction('INSTALMENT_PAYMENT/FETCH/IS_LOADING'),
  success: createAction('INSTALMENT_PAYMENT/FETCH/SUCCESS'),
};

export function fetchInstalmentPayment(
  params?: {},
  options?: OptionCallback<InstalmentPaymentApi>,
): ThunkAction {
  return async (dispatch: Dispatch) => {
    dispatch(instalmentPaymentListActions.isLoading(true));
    dispatch(instalmentPaymentListActions.error(null));
    try {
      const response = await fetchInstalmentPaymentAPI(params);
      dispatch(instalmentPaymentListActions.success(response.data));
      options?.onSuccess && options.onSuccess(response.data);
    } catch (error) {
      dispatch(instalmentPaymentListActions.error(error));
      options?.onError && options.onError(error);
    }
    dispatch(instalmentPaymentListActions.isLoading(false));
  };
}

export const instalmentPaymentForBasketListActions = {
  error: createAction('INSTALMENT_PAYMENT/FETCH_BY_BASKET/ERROR'),
  isLoading: createAction('INSTALMENT_PAYMENT/FETCH_BY_BASKET/IS_LOADING'),
  success: createAction('INSTALMENT_PAYMENT/FETCH_BY_BASKET/SUCCESS'),
};

export function fetchInstalmentPaymentByBasket(
  basketId: string,
  options?: OptionCallback<InstalmentPaymentApi>,
): ThunkAction {
  return async (dispatch: Dispatch) => {
    dispatch(instalmentPaymentForBasketListActions.isLoading(true));
    dispatch(instalmentPaymentForBasketListActions.error(null));
    try {
      const response = await fetchInstalmentPaymentByBasketAPI(basketId);
      dispatch(
        instalmentPaymentForBasketListActions.success({
          items: response.data,
          basketId,
        }),
      );
      options?.onSuccess && options.onSuccess(response.data);
    } catch (error) {
      dispatch(instalmentPaymentForBasketListActions.error(error));
      options?.onError && options.onError(error);
    }
    dispatch(instalmentPaymentForBasketListActions.isLoading(false));
  };
}
