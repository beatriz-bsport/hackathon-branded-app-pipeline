import { createAction } from 'redux-actions';

import ALL_ERROR_CODES from '@bsport/common/lib/master-data/error-codes/buyable-item-can-not-be-bought.js';
import {
  BASKET_LOCK_ACQUISITION_FAILURE,
  BASKET_PROCESSING_PAYMENT_EXCEPTION,
} from '@bsport/common/lib/master-data/error-codes/lock.js';

import {
  BASKET_CANNOT_REMOVE_ITEM_BECAUSE_OF_PAYMENT_GROUP_STATUS,
  BASKET_QUICKSALE_PREVIOUSLY_DROPPED,
} from '@bsport/common/lib/master-data/error-codes/basket.js';

import { snackbarError, snackbarSuccess } from '#src/libs/snackbar/actions';
import { fetchEventList } from '#src/libs/event/actions';
import type { EventListParams } from '#src/libs/event/types';
import { isErrorWithCustomCode } from '#src/libs/utils';
import {
  addItemToBasket as addItemToBasketAPI,
  assignInstalmentPayment as assignInstalmentPaymentAPI,
  attachCoupon as attachCouponAPI,
  attachPayment as attachPaymentAPI,
  attachPaymentUnauthenticated as attachPaymentUnauthenticatedAPI,
  createOrRefreshInternalAccountPrepaidLine as createOrRefreshInternalAccountPrepaidLineAPI,
  createQuicksaleBasket as createQuicksaleBasketAPI,
  dropQuicksaleBasket as dropQuicksaleBasketAPI,
  fetchBasket as fetchBasketAPI,
  fetchBasketGeneratedObjects as fetchBasketGeneratedObjectsAPI,
  fetchBasketHistoryList as fetchBasketHistoryListAPI,
  fetchCurrentBasket as fetchCurrentBasketAPI,
  fetchOpenQuicksaleBaskets as fetchOpenQuicksaleBasketsAPI,
  getExpiredItemRemovalStatus as getExpiredItemRemovalStatusAPI,
  patchBasket as patchBasketAPI,
  removeItemFromBasket as removeItemFromBasketAPI,
  updateQuicksaleBasketMember as updateQuicksaleBasketMemberAPI,
} from './api';
import { getCurrentBasket } from './selectors';

import type {
  APIPollOptionCallback,
  Dispatch,
  GetState,
  OptionCallback,
  OptionCallBackWithKeyedCallbacks,
  ThunkAction,
} from '#src/state/types';
import type { RootState } from '#src/reducers';
import type {
  AddItemToBasketParams,
  Basket,
  BasketAddress,
  CheckoutItemData,
  GeneratedObject,
  QuicksaleMemberUpdateResponse,
  QuicksaleMemberUpdateSuccess,
} from './types';
// @ts-expect-error
import { COMPANY_EVENTS } from './event.utils';

export const currentBasket = {
  error: createAction<Error>('CHECKOUT_BASKET/CURRENT/ERROR'),
  isLoading: createAction<boolean>('CHECKOUT_BASKET/CURRENT/IS_LOADING'),
  isUpdating: createAction<boolean>('CHECKOUT_BASKET/CURRENT/IS_UPDATING'),
  success: createAction<Basket>('CHECKOUT_BASKET/CURRENT/SUCCESS'),
  isExpiredItemRemovalStatusLoading: createAction<boolean>(
    'CHECKOUT_BASKET/CURRENT/REMOVAL_STATUS_LOADING',
  ),
};

export function fetchCurrentBasket(
  companyId: number,
  options?: OptionCallback<Basket>,
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

export const createOrRefreshInternalAccountPrepaidLineActions = {
  error: createAction<Error>('CHECKOUT_BASKET/CREATE_PREPAID_LINE/ERROR'),
  isLoading: createAction<boolean>(
    'CHECKOUT_BASKET/CREATE_PREPAID_LINE/IS_LOADING',
  ),
  success: createAction<Basket>('CHECKOUT_BASKET/CREATE_PREPAID_LINE/SUCCESS'),
};

export function createOrRefreshInternalAccountPrepaidLine(
  basket_uuid: string,
  amount: number,
  options?: OptionCallback<Basket>,
): ThunkAction {
  return async (dispatch: Dispatch) => {
    dispatch(createOrRefreshInternalAccountPrepaidLineActions.isLoading(true));
    dispatch(createOrRefreshInternalAccountPrepaidLineActions.error(null));

    try {
      const response = await createOrRefreshInternalAccountPrepaidLineAPI(
        basket_uuid,
        amount,
      );
      dispatch(
        createOrRefreshInternalAccountPrepaidLineActions.success(response.data),
      );
      if (options && options.onSuccess) {
        options.onSuccess(response.data);
      }
    } catch (error) {
      if (
        isErrorWithCustomCode(error) &&
        error.response.data?.error_code === BASKET_LOCK_ACQUISITION_FAILURE
      ) {
        dispatch(
          snackbarError(
            `refreshInternalAccountPrepaidLines.${BASKET_LOCK_ACQUISITION_FAILURE}`,
          ),
        );
      }
      if (
        isErrorWithCustomCode(error) &&
        error.response.data?.error_code === BASKET_PROCESSING_PAYMENT_EXCEPTION
      ) {
        dispatch(
          snackbarError(`modifyBasket.${BASKET_PROCESSING_PAYMENT_EXCEPTION}`),
        );
      }

      dispatch(createOrRefreshInternalAccountPrepaidLineActions.error(error));
      if (options && options.onError) options.onError(error);
    }
    dispatch(createOrRefreshInternalAccountPrepaidLineActions.isLoading(false));
  };
}

export const retrieveBasket = {
  error: createAction<Error>('CHECKOUT_BASKET/RETRIEVE/ERROR'),
  isLoading: createAction<boolean>('CHECKOUT_BASKET/RETRIEVE/IS_LOADING'),
  success: createAction<Basket>('CHECKOUT_BASKET/RETRIEVE/SUCCESS'),
};

export function fetchBasket(
  basketId: string,
  options?: OptionCallback<Basket<number>>,
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
      dispatch(retrieveBasket.error(error));
      if (options && options.onError) options.onError(error);

      if (
        isErrorWithCustomCode(error) &&
        error.response.data?.error_code === BASKET_QUICKSALE_PREVIOUSLY_DROPPED
      ) {
        dispatch(
          snackbarError(
            `quicksaleCheckout.${BASKET_QUICKSALE_PREVIOUSLY_DROPPED}`,
          ),
        );
      }
    }
    dispatch(retrieveBasket.isLoading(false));
  };
}

export function attachPayment(data: any, options: OptionCallback): ThunkAction {
  return async (dispatch: Dispatch, getState: () => RootState) => {
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
      // @ts-expect-error: would imply too many changes
      if (options && options.onSuccess) options.onSuccess(response);
    } catch (error) {
      dispatch(currentBasket.error(error));
      if (options && options.onError) options.onError(error);
    }

    dispatch(currentBasket.isUpdating(false));
  };
}

export function attachPaymentToBasketId(
  data: any,
  basketId: string,
  options: OptionCallback,
): ThunkAction {
  return async (dispatch: Dispatch) => {
    dispatch(currentBasket.isUpdating(true));
    dispatch(currentBasket.error(null));

    try {
      const response = await attachPaymentUnauthenticatedAPI(basketId, data);
      if (response.data.is_finalized) {
        dispatch(currentBasket.success(response.data));
      }
      // @ts-expect-error: would imply too many changes
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
  options?: OptionCallback<Basket>,
  params?: AddItemToBasketParams,
): ThunkAction {
  return async (dispatch: Dispatch) => {
    dispatch(currentBasket.isLoading(true));
    dispatch(currentBasket.error(null));

    try {
      const { hideSnackbarSuccess, ...apiParams } = params || {};
      const response = await addItemToBasketAPI(basketId, data, apiParams);
      dispatch(currentBasket.success(response.data));
      if (!hideSnackbarSuccess)
        dispatch(snackbarSuccess('modifyBasket.addItemSuccess'));
      if (options && options.onSuccess) options.onSuccess(response.data);
    } catch (error) {
      dispatch(currentBasket.error(error));
      if (
        error &&
        error.response &&
        error.response.data &&
        error.response.data.error_code
      ) {
        const { error_code } = error.response.data;
        if (error_code === BASKET_PROCESSING_PAYMENT_EXCEPTION) {
          dispatch(
            snackbarError(
              `modifyBasket.${BASKET_PROCESSING_PAYMENT_EXCEPTION}`,
            ),
          );
        } else if (ALL_ERROR_CODES.includes(error_code)) {
          dispatch(snackbarError(`canNotBuyErrorCode.${error_code}`));
        } else {
          dispatch(snackbarError('canNotBuyErrorCode.addToBasketError'));
        }
      }
      if (options && options.onError) options.onError();
    }

    dispatch(currentBasket.isLoading(false));
  };
}

export function removeItemFromBasket(
  basketId: string,
  data: {
    checkout_item: string;
    quantity: number;
  },
  options?: OptionCallback<Basket>,
): ThunkAction {
  return async (dispatch: Dispatch) => {
    dispatch(currentBasket.isLoading(true));
    dispatch(currentBasket.error(null));

    try {
      const response = await removeItemFromBasketAPI(basketId, data);
      dispatch(currentBasket.success(response.data));
      if (options && options.onSuccess) {
        options.onSuccess(response.data);
      }
    } catch (error) {
      if (
        isErrorWithCustomCode(error) &&
        error.response.data?.error_code === BASKET_PROCESSING_PAYMENT_EXCEPTION
      ) {
        dispatch(
          snackbarError(`modifyBasket.${BASKET_PROCESSING_PAYMENT_EXCEPTION}`),
        );
      }
      if (
        isErrorWithCustomCode(error) &&
        [
          BASKET_LOCK_ACQUISITION_FAILURE,
          BASKET_CANNOT_REMOVE_ITEM_BECAUSE_OF_PAYMENT_GROUP_STATUS,
        ].includes(error.response.data?.error_code)
      ) {
        dispatch(snackbarError(`removeItem.${error.response.data.error_code}`));
      }
      dispatch(currentBasket.error(error));
      if (options && options.onError) {
        options.onError(error);
      }
    }

    dispatch(currentBasket.isLoading(false));
  };
}

export function patchCurrentBasket(
  data: BasketAddress,
  options: OptionCallback,
): ThunkAction {
  return async (dispatch: Dispatch, getState: () => RootState) => {
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

/**
 * Attach a promo code or a gift card code to the current basket
 * @param {string} basketId The current basket identifier
 * @param {string} code The code to apply to the basket
 */
export function attachCoupon(
  basketId: string,
  code: string,
  options?: OptionCallBackWithKeyedCallbacks<Basket>,
): ThunkAction {
  return async (dispatch: Dispatch) => {
    dispatch(currentBasket.isUpdating(true));
    dispatch(currentBasket.error(null));

    try {
      const response = await attachCouponAPI(basketId, code);
      dispatch(currentBasket.success(response.data));
      if (options && options.onSuccess) options.onSuccess(response.data);
    } catch (error) {
      if (isErrorWithCustomCode(error) && error.response.data?.error_code) {
        if (
          error.response.data.error_code === BASKET_PROCESSING_PAYMENT_EXCEPTION
        ) {
          dispatch(
            snackbarError(
              `modifyBasket.${BASKET_PROCESSING_PAYMENT_EXCEPTION}`,
            ),
          );
        }
        if (options && options[error.response?.data?.error_code]) {
          options[error.response.data.error_code]?.();
        }
      } else if (options && options.onError) {
        options.onError();
      }
      dispatch(currentBasket.error(error));
    }

    dispatch(currentBasket.isUpdating(false));
  };
}

export const generatedObjectsActions = {
  error: createAction<Error>('CHECKOUT_BASKET/GENERATED_OBJECTS/ERROR'),
  isLoading: createAction<boolean>(
    'CHECKOUT_BASKET/GENERATED_OBJECTS/IS_LOADING',
  ),
  success: createAction<GeneratedObject[]>(
    'CHECKOUT_BASKET/GENERATED_OBJECTS/SUCCESS',
  ),
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

export const fetchBasketEventList = (
  params: EventListParams = {},
  options: OptionCallback,
) =>
  fetchEventList(
    'basket',
    {
      ...params,
      event_types:
        params.event_types && params.event_types.length
          ? params.event_types
          : Object.keys(COMPANY_EVENTS),
    },
    options,
  );

export const basketHistoryActions = {
  error: createAction<Error>('CHECKOUT_BASKET/HISTORY/ERROR'),
  isLoading: createAction<boolean>('CHECKOUT_BASKET/HISTORY/IS_LOADING'),
  success: createAction<Basket[]>('CHECKOUT_BASKET/HISTORY/SUCCESS'),
};

export function fetchBasketHistoryList(
  memberId: number,
  options?: OptionCallback<Basket[]>,
) {
  return async (dispatch: Dispatch) => {
    dispatch(basketHistoryActions.isLoading(true));
    dispatch(basketHistoryActions.error(null));

    try {
      const response = await fetchBasketHistoryListAPI(memberId);
      dispatch(basketHistoryActions.success(response.data));
      if (options && options.onSuccess) options.onSuccess(response.data);
    } catch (error) {
      dispatch(basketHistoryActions.error(error));
      if (options && options.onError) options.onError();
    }

    dispatch(basketHistoryActions.isLoading(false));
  };
}

export const assignInstalmentPaymentActions = {
  error: createAction<Error>('CHECKOUT_BASKET/ASSIGN_INSTALMENT/ERROR'),
  isLoading: createAction<boolean>(
    'CHECKOUT_BASKET/ASSIGN_INSTALMENT/IS_LOADING',
  ),
  success: createAction<Basket>('CHECKOUT_BASKET/ASSIGN_INSTALMENT/SUCCESS'),
};

export function assignInstalmentPayment(
  basketId: string,
  instalment_payment: number | null,
  options?: OptionCallback<Basket>,
) {
  return async (dispatch: Dispatch) => {
    dispatch(assignInstalmentPaymentActions.isLoading(true));
    dispatch(assignInstalmentPaymentActions.error(null));

    try {
      const response = await assignInstalmentPaymentAPI(
        basketId,
        instalment_payment,
      );
      dispatch(assignInstalmentPaymentActions.success(response.data));
      if (options && options.onSuccess) options.onSuccess(response.data);
    } catch (error) {
      dispatch(assignInstalmentPaymentActions.error(error));
      if (options && options.onError) options.onError();
    }

    dispatch(assignInstalmentPaymentActions.isLoading(false));
  };
}

export const fetchQuicksaleBasketsActions = {
  error: createAction<Error>('CHECKOUT_BASKET/QUICKSALE_FETCH/ERROR'),
  isLoading: createAction<boolean>(
    'CHECKOUT_BASKET/QUICKSALE_FETCH/IS_LOADING',
  ),
  success: createAction<Basket[]>('CHECKOUT_BASKET/QUICKSALE_FETCH/SUCCESS'),
};

export function fetchOpenQuicksaleBaskets(
  options?: OptionCallback<Basket[]>,
): ThunkAction {
  return async (dispatch: Dispatch) => {
    dispatch(fetchQuicksaleBasketsActions.isLoading(true));
    dispatch(fetchQuicksaleBasketsActions.error(null));

    try {
      const response = await fetchOpenQuicksaleBasketsAPI();
      dispatch(fetchQuicksaleBasketsActions.success(response.data));
      if (options && options.onSuccess) options.onSuccess(response.data);
    } catch (error) {
      dispatch(fetchQuicksaleBasketsActions.error(error));
      if (options && options.onError) options.onError();
    }

    dispatch(fetchQuicksaleBasketsActions.isLoading(false));
  };
}

export const createQuicksaleBasketActions = {
  error: createAction<Error>('CHECKOUT_BASKET/QUICKSALE_CREATE/ERROR'),
  isLoading: createAction<boolean>(
    'CHECKOUT_BASKET/QUICKSALE_CREATE/IS_LOADING',
  ),
  success: createAction<Basket>('CHECKOUT_BASKET/QUICKSALE_CREATE/SUCCESS'),
};

export function createQuicksaleBasket(
  options?: OptionCallback<Basket>,
): ThunkAction {
  return async (dispatch: Dispatch) => {
    dispatch(createQuicksaleBasketActions.isLoading(true));
    dispatch(createQuicksaleBasketActions.error(null));

    try {
      const response = await createQuicksaleBasketAPI();
      dispatch(createQuicksaleBasketActions.success(response.data));
      if (options && options.onSuccess) options.onSuccess(response.data);
    } catch (error) {
      dispatch(createQuicksaleBasketActions.error(error));
      if (options && options.onError) options.onError();
    }

    dispatch(createQuicksaleBasketActions.isLoading(false));
  };
}

export const updateQuicksaleBasketMemberActions = {
  error: createAction<Error>('CHECKOUT_BASKET/QUICKSALE_UPDATE_MEMBER/ERROR'),
  isLoading: createAction<boolean>(
    'CHECKOUT_BASKET/QUICKSALE_UPDATE_MEMBER/IS_LOADING',
  ),
  success: createAction<QuicksaleMemberUpdateSuccess>(
    'CHECKOUT_BASKET/QUICKSALE_UPDATE_MEMBER/SUCCESS',
  ),
};

export function updateQuicksaleBasketMember(
  basketId: string,
  memberId: number,
  options?: OptionCallback<QuicksaleMemberUpdateResponse>,
): ThunkAction {
  return async (dispatch: Dispatch) => {
    dispatch(updateQuicksaleBasketMemberActions.isLoading(true));
    dispatch(updateQuicksaleBasketMemberActions.error(null));

    try {
      const response = await updateQuicksaleBasketMemberAPI(basketId, memberId);
      dispatch(
        updateQuicksaleBasketMemberActions.success({
          updated_member: response.data.updated_member,
          newBasket: response.data.new_basket,
          previousBasketId: basketId,
        }),
      );
      if (options && options.onSuccess) options.onSuccess(response.data);
    } catch (error) {
      dispatch(updateQuicksaleBasketMemberActions.error(error));
      if (options && options.onError) options.onError();
    }

    dispatch(updateQuicksaleBasketMemberActions.isLoading(false));
  };
}

export const dropQuicksaleBasketActions = {
  error: createAction<Error>('CHECKOUT_BASKET/QUICKSALE_DROP/ERROR'),
  isLoading: createAction<boolean>('CHECKOUT_BASKET/QUICKSALE_DROP/IS_LOADING'),
  success: createAction<{ dropped: boolean; basketId: string }>(
    'CHECKOUT_BASKET/QUICKSALE_DROP/SUCCESS',
  ),
};

export function dropQuicksaleBasket(
  basketId: string,
  options?: OptionCallback<{ dropped: boolean }>,
): ThunkAction {
  return async (dispatch: Dispatch) => {
    dispatch(dropQuicksaleBasketActions.isLoading(true));
    dispatch(dropQuicksaleBasketActions.error(null));

    try {
      const response = await dropQuicksaleBasketAPI(basketId);
      dispatch(
        dropQuicksaleBasketActions.success({ ...response.data, basketId }),
      );
      if (options && options.onSuccess) options.onSuccess(response.data);
    } catch (error) {
      dispatch(dropQuicksaleBasketActions.error(error));
      if (options && options.onError) options.onError();
    }

    dispatch(dropQuicksaleBasketActions.isLoading(false));
  };
}

const MONITOR_EXPIRED_ITEM_REMOVAL_MAX_RETRIES = 15;
const MONITOR_EXPIRED_ITEM_REMOVAL_POLL_DELAY_SECONDS = 2;

export const monitorExpiredItemRemoval = (
  companyId: number,
  checkoutItemId: string,
  pollOptionCallback?: APIPollOptionCallback,
): ThunkAction => {
  return (dispatch, getState) => {
    dispatch(currentBasket.isExpiredItemRemovalStatusLoading(true));
    const retryCount = 1;

    fetchCurrentBasketItemRemovalStatus(
      dispatch,
      getState,
      checkoutItemId,
      retryCount,
      companyId,
      pollOptionCallback,
    );
  };
};

const fetchCurrentBasketItemRemovalStatus = async (
  dispatch: Dispatch,
  getState: GetState,
  checkoutItemId: string,
  retryCount: number,
  companyId: number,
  pollOptionCallback?: APIPollOptionCallback,
) => {
  if (retryCount > MONITOR_EXPIRED_ITEM_REMOVAL_MAX_RETRIES) {
    // Try to manually remove the checkout item
    const currentBasketId = getCurrentBasket(getState()).id;
    dispatch(
      removeItemFromBasket(
        currentBasketId,
        {
          checkout_item: checkoutItemId,
          quantity: 1,
        },
        {
          onError: () => {
            pollOptionCallback?.onPollError?.();
            dispatch(currentBasket.isExpiredItemRemovalStatusLoading(false));
          },
          onSuccess: () => {
            pollOptionCallback?.onPollSuccess?.();
            dispatch(currentBasket.isExpiredItemRemovalStatusLoading(false));
          },
        },
      ),
    );
    return;
  }

  try {
    const response = await getExpiredItemRemovalStatusAPI({
      checkout_item_id: checkoutItemId,
      company: companyId,
    });

    const { removal_successful } = response.data;
    if (removal_successful) {
      pollOptionCallback?.onPollSuccess?.();
      dispatch(currentBasket.isExpiredItemRemovalStatusLoading(false));
    } else {
      // Retry in a few seconds
      setTimeout(
        () =>
          fetchCurrentBasketItemRemovalStatus(
            dispatch,
            getState,
            checkoutItemId,
            retryCount + 1,
            companyId,
            pollOptionCallback,
          ),
        MONITOR_EXPIRED_ITEM_REMOVAL_POLL_DELAY_SECONDS * 1000,
      );
    }
  } catch (error) {
    console.error(error);
    // Retry in a few seconds
    setTimeout(
      () =>
        fetchCurrentBasketItemRemovalStatus(
          dispatch,
          getState,
          checkoutItemId,
          retryCount + 1,
          companyId,
          pollOptionCallback,
        ),
      MONITOR_EXPIRED_ITEM_REMOVAL_POLL_DELAY_SECONDS * 1000,
    );
  }
};
