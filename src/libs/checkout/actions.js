// @flow

import { createAction } from 'redux-actions';

// we import from src and not lib bvecause there is some shittery happening that
// makes the build of the wdget crashing (widget use this file somehow)
import ALL_ERROR_CODES from '@bsport/common/src/master-data/buyable-item-can-not-be-bought';

import {
  addItemToBasket as addItemToBasketAPI,
  fetchCurrentBasket as fetchCurrentBasketAPI,
  removeItemFromBasket as removeItemFromBasketAPI,
  patchBasket as patchBasketAPI,
  attachPayment as attachPaymentAPI,
  attachPaymentUnauthenticated as attachPaymentUnauthenticatedAPI,
  attachCoupon as attachCouponAPI,
  fetchBasketGeneratedObjects as fetchBasketGeneratedObjectsAPI,
  fetchBasket as fetchBasketAPI,
} from './api';
import { getCurrentBasket } from './selectors';
import { snackbarError } from '../../actions/snackbar.actions';

import type { Dispatch, State, ThunkAction } from '../../state/types';
import type { CheckoutItemData } from './types';

export const currentBasket = {
  error: createAction('CHECKOUT_BASKET/CURRENT/ERROR'),
  isLoading: createAction('CHECKOUT_BASKET/CURRENT/IS_LOADING'),
  isUpdating: createAction('CHECKOUT_BASKET/CURRENT/IS_UPDATING'),
  success: createAction('CHECKOUT_BASKET/CURRENT/SUCCESS'),
};

export function fetchCurrentBasket(
  companyId: number,
  options: OptionCallback,
): ThunkAction {
  return async (dispatch: Dispatch) => {
    dispatch(currentBasket.isLoading(true));
    dispatch(currentBasket.error(null));

    try {
      const response = await fetchCurrentBasketAPI(companyId);
      dispatch(currentBasket.success(response.data));
      if (options && options.onSuccess) {
        options.onSuccess(response.data);
      }
    } catch (error) {
      dispatch(currentBasket.error(error));
      if (options && options.onError) options.onError(error);
    }
    dispatch(currentBasket.isLoading(false));
  };
}

export const retrieveBasket = {
  error: createAction('CHECKOUT_BASKET/RETRIEVE/ERROR'),
  isLoading: createAction('CHECKOUT_BASKET/RETRIEVE/IS_LOADING'),
  success: createAction('CHECKOUT_BASKET/RETRIEVE/SUCCESS'),
};

export function fetchBasket(
  basketId: string,
  options: OptionCallback,
): ThunkAction {
  return async (dispatch: Dispatch) => {
    dispatch(retrieveBasket.isLoading(true));
    dispatch(retrieveBasket.error(null));

    try {
      const response = await fetchBasketAPI(basketId);
      dispatch(retrieveBasket.success(response.data));
      if (options && options.onSuccess) {
        options.onSuccess(response.data);
      }
    } catch (error) {
      console.error(error);
      dispatch(retrieveBasket.error(error));
      if (options && options.onError) options.onError(error);
    }
    dispatch(retrieveBasket.isLoading(false));
  };
}

export function attachPayment(
  data: *,
  options: ?{ onSuccess: ?() => void, onError: ?(Error) => void },
): ThunkAction {
  return async (dispatch: Dispatch, getState: () => State) => {
    dispatch(currentBasket.isUpdating(true));
    dispatch(currentBasket.error(null));

    try {
      const response = await attachPaymentAPI(
        getCurrentBasket(getState()).id,
        data,
      );
      if (response.data.is_finalized) {
        dispatch(currentBasket.success(response.data));
      }
      if (options && options.onSuccess) options.onSuccess(response);
    } catch (error) {
      dispatch(currentBasket.error(error));
      if (options && options.onError) options.onError(error);
    }

    dispatch(currentBasket.isUpdating(false));
  };
}

export function attachPaymentToBasketId(
  data: *,
  basketId: string,
  options: ?{ onSuccess: ?() => void, onError: ?(Error) => void },
): ThunkAction {
  return async (dispatch: Dispatch) => {
    dispatch(currentBasket.isUpdating(true));
    dispatch(currentBasket.error(null));

    try {
      const response = await attachPaymentUnauthenticatedAPI(basketId, data);
      if (response.data.is_finalized) {
        dispatch(currentBasket.success(response.data));
      }
      if (options && options.onSuccess) options.onSuccess(response);
    } catch (error) {
      dispatch(currentBasket.error(error));
      if (options && options.onError) options.onError(error);
    }

    dispatch(currentBasket.isUpdating(false));
  };
}

export function addItemToBasket(
  basketId: string,
  data: CheckoutItemData,
  options: ?{ onSuccess: ?() => void, onError: ?() => void },
): ThunkAction {
  return async (dispatch: Dispatch) => {
    dispatch(currentBasket.isLoading(true));
    dispatch(currentBasket.error(null));

    try {
      const response = await addItemToBasketAPI(basketId, data);
      dispatch(currentBasket.success(response.data));
      if (options && options.onSuccess) options.onSuccess();
    } catch (error) {
      dispatch(currentBasket.error(error));
      if (
        error &&
        error.response &&
        error.response.data &&
        error.response.data.error_code
      ) {
        const { error_code } = error.response.data;
        if (ALL_ERROR_CODES.includes(error_code)) {
          dispatch(snackbarError(`canNotBuyErrorCode.${error_code}`));
        } else {
          dispatch(snackbarError('canNotBuyErrorCode.generic'));
        }
      }
      if (options && options.onError) options.onError();
    }

    dispatch(currentBasket.isLoading(false));
  };
}

export function removeItemFromBasket(
  basketId: string,
  checkoutItemId: string,
  quantity: number,
): ThunkAction {
  return async (dispatch: Dispatch) => {
    dispatch(currentBasket.isLoading(true));
    dispatch(currentBasket.error(null));

    try {
      const response = await removeItemFromBasketAPI(
        basketId,
        checkoutItemId,
        quantity,
      );
      dispatch(currentBasket.success(response.data));
    } catch (error) {
      dispatch(currentBasket.error(error));
    }

    dispatch(currentBasket.isLoading(false));
  };
}

export function patchCurrentBasket(
  data: *,
  options: ?{ onSuccess: ?() => void, onError: ?() => void },
): ThunkAction {
  return async (dispatch: Dispatch, getState: () => State) => {
    dispatch(currentBasket.isUpdating(true));
    dispatch(currentBasket.error(null));

    try {
      const response = await patchBasketAPI(
        getCurrentBasket(getState()).id,
        data,
      );
      dispatch(currentBasket.success(response.data));
      if (options && options.onSuccess) options.onSuccess();
    } catch (error) {
      dispatch(currentBasket.error(error));
      if (options && options.onError) options.onError();
    }

    dispatch(currentBasket.isUpdating(false));
  };
}

export function attachCoupon(
  code: string,
  options: ?{ onSuccess: ?() => void, onError: ?() => void },
): ThunkAction {
  return async (dispatch: Dispatch, getState: () => State) => {
    dispatch(currentBasket.isUpdating(true));
    dispatch(currentBasket.error(null));

    try {
      const response = await attachCouponAPI(
        getCurrentBasket(getState()).id,
        code,
      );
      dispatch(currentBasket.success(response.data));
      if (options && options.onSuccess) options.onSuccess();
    } catch (error) {
      dispatch(currentBasket.error(error));
      dispatch(snackbarError('coupon:message.attachToBasket.error'));
      if (options && options.onError) options.onError();
    }

    dispatch(currentBasket.isUpdating(false));
  };
}

export const generatedObjectsActions = {
  error: createAction('CHECKOUT_BASKET/GENERATED_OBJECTS/ERROR'),
  isLoading: createAction('CHECKOUT_BASKET/GENERATED_OBJECTS/IS_LOADING'),
  success: createAction('CHECKOUT_BASKET/GENERATED_OBJECTS/SUCCESS'),
};

export function fetchBasketGeneratedObjects(
  id: string,
  options: OptionCallback,
): ThunkAction {
  return async (dispatch: Dispatch) => {
    dispatch(generatedObjectsActions.isLoading(true));
    dispatch(generatedObjectsActions.error(null));

    try {
      const response = await fetchBasketGeneratedObjectsAPI(id);
      dispatch(generatedObjectsActions.success(response.data));
      if (options && options.onSuccess) options.onSuccess(response.data);
    } catch (error) {
      dispatch(generatedObjectsActions.error(error));
      if (options && options.onError) options.onError();
    }

    dispatch(generatedObjectsActions.isLoading(false));
  };
}
