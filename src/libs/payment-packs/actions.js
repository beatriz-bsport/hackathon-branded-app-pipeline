// @flow

import { createAction } from 'redux-actions';
import uniq from 'lodash/uniq';

import {
  // Payment-Pack
  // -----------------
  edit as editAPI,
  scalePaymentPackCredit as scalePaymentPackCreditAPI,
  create as createAPI,
  fetchAllPaymentPacks as fetchAllPaymentPacksAPI,
  patch as patchAPI,
  fetchOne as fetchOneAPI,
  fetchPaymentPackList as fetchPaymentPackListAPI,
  // Notifications
  // -----------------
  updatePaymentPackNotifications as updateNotificationAPI,
  createPaymentPackNotifications as createNotificationAPI,
  fetchPaymentPackNotifications as fetchNotificationsAPI,
  deletePaymentPackNotifications as deleteNotificationAPI,
  fetchPaymentPackCompatibleList as fetchPaymentPackCompatibleListAPI,
} from './api';

import { snackbarSuccess, snackbarError } from '../../actions/snackbar.actions';
import { actionTypes as types } from './types';
import { createDictionnaryById, createIdList } from '../../actions/utils';

import type { Dispatch, OptionCallback } from '../../state/types.ts';

export const scalePaymentPackCreditActions = {
  isLoading: createAction('PAYMENT_PACK/SCALE_CREDIT/IS_LOADING'),
  error: createAction('PAYMENT_PACK/SCALE_CREDIT/ERROR'),
  success: createAction('PAYMENT_PACK/SCALE_CREDIT/SUCCESS'),
};

export function scalePaymentPackCredit(
  id: number,
  data: any,
  options: OptionCallback,
) {
  return async (dispatch: Dispatch) => {
    dispatch(scalePaymentPackCreditActions.error(null));
    dispatch(scalePaymentPackCreditActions.isLoading(true));
    try {
      // TODO update reducer after endpoint/serializer cleaning
      const response = await scalePaymentPackCreditAPI(id, data);
      dispatch(scalePaymentPackCreditActions.success(response.data));
      if (options && options.onSuccess) {
        options.onSuccess(response.data);
      }
    } catch (err) {
      console.error(err);
      dispatch(scalePaymentPackCreditActions.error(err));
      if (options && options.onError) {
        options.onError(err);
      }
    }
    dispatch(scalePaymentPackCreditActions.isLoading(false));
  };
}

export const listAllPaymentPackActions = {
  isLoading: createAction('PAYMENT_PACK/LIST/IS_LOADING'),
  error: createAction('PAYMENT_PACK/LIST/ERROR'),
  success: createAction('PAYMENT_PACK/LIST/SUCCESS'),
};

export function refreshAllPaymentPack() {
  return async (dispatch: Dispatch) => {
    dispatch(listAllPaymentPackActions.error(null));
    try {
      const response = await fetchAllPaymentPacksAPI();
      const paymentPacks = response.data;
      dispatch(listAllPaymentPackActions.success(paymentPacks));
    } catch (err) {
      console.error(err);
      dispatch(listAllPaymentPackActions.error(err));
    }
    dispatch(listAllPaymentPackActions.isLoading(false));
  };
}

export function fetchAllPaymentPacks() {
  return async (dispatch: Dispatch) => {
    dispatch(listAllPaymentPackActions.isLoading(true));
    dispatch(refreshAllPaymentPack());
  };
}

export const updatePaymentPackActions = {
  isLoading: createAction('PAYMENT_PACK/PATCH/IS_LOADING'),
  isNotLoading: createAction('PAYMENT_PACK/PATCH/IS_NOT_LOADING'),
  error: createAction('PAYMENT_PACK/PATCH/ERROR'),
  success: createAction('PAYMENT_PACK/PATCH/SUCCESS'),
};

export function patch(id: number, data: [*]) {
  return async (dispatch: Dispatch) => {
    dispatch(updatePaymentPackActions.isLoading(id));
    dispatch(updatePaymentPackActions.error(null));

    try {
      const response = await patchAPI(id, data);
      dispatch(updatePaymentPackActions.success(response.data));
      dispatch(
        snackbarSuccess(
          `paymentPack.paymentPack${
            data.disabled ? 'Disabled' : 'Enabled'
          }.success`,
        ),
      );
    } catch (err) {
      console.error(err);
      dispatch(updatePaymentPackActions.error(err));
      dispatch(
        snackbarError(
          `paymentPack.paymentPack${
            data.disabled ? 'Disabled' : 'Enabled'
          }.error`,
        ),
      );
    }
    dispatch(updatePaymentPackActions.isNotLoading(id));
  };
}

export const fetchOneAction = {
  isLoading: createAction('PAYMENT_PACK/DETAIL/IS_LOADING'),
  error: createAction('PAYMENT_PACK/DETAIL/ERROR'),
  success: createAction('PAYMENT_PACK/DETAIL/SUCCESS'),
};

export function fetchOne(id: number, options: OptionCallback) {
  return async (dispatch: Dispatch) => {
    dispatch(fetchOneAction.isLoading(true));
    dispatch(fetchOneAction.error(null));
    try {
      const response = await fetchOneAPI(id);
      dispatch(fetchOneAction.success(response.data));
      if (options && options.onSuccess) {
        options.onSuccess(response.data);
      }
    } catch (err) {
      console.error(err);
      dispatch(fetchOneAction.error(id));
      if (options && options.onError) {
        options.onError(err);
      }
    }
    dispatch(fetchOneAction.isLoading(false));
  };
}

export function createOrUpdate(data: PaymentPackFormData, options = {}) {
  return async (dispatch: Dispatch) => {
    dispatch(startCreateOrUpdate(data.id));
    dispatch(createOrUpdateFailed(null));
    try {
      let apiCall = null;
      if (data.id) {
        apiCall = editAPI;
      } else {
        apiCall = createAPI;
      }
      const response = await apiCall(data);

      if (response.status === 200) {
        dispatch(createOrUpdateSuccess(response.data));
        dispatch(snackbarSuccess('paymentPack.createOrUpdate.success'));
        if (options.onSuccess) options.onSuccess(response.data);
      }
    } catch (err) {
      console.error(err);
      dispatch(createOrUpdateFailed(err));
      dispatch(snackbarError('paymentPack.createOrUpdate.fail'));
      if (options.onError) options.onError();
    }
  };
}

export function startCreateOrUpdate(id: number) {
  return { type: types.PAYMENT_PACK_CREATEORUPDATE_START, id };
}
export function createOrUpdateSuccess(paymentPack: PaymentPack) {
  return { type: types.PAYMENT_PACK_CREATEORUPDATE_SUCCESS, paymentPack };
}

export function createOrUpdateFailed(error: ?Error) {
  return { type: types.PAYMENT_PACK_CREATEORUPDATE_FAIL, error };
}

export function resetCompatiblePaymentPacks() {
  return async (dispatch: Dispatch) => {
    dispatch(fetchActivityCompatibleAction.reset());
  };
}

export const fetchActivityCompatibleAction = {
  reset: createAction('PAYMENT_PACK/BY_ACTIVITY/RESET'),
  isLoading: createAction('PAYMENT_PACK/BY_ACTIVITY/IS_LOADING'),
  error: createAction('PAYMENT_PACK/BY_ACTIVITY/ERROR'),
  success: createAction('PAYMENT_PACK/BY_ACTIVITY/SUCCESS'),
};

export function fetchActivityCompatiblePaymentPacks(
  meta_activity: number,
  page: number,
  page_size: number,
): ThunkAction {
  return async (dispatch: Dispatch) => {
    dispatch(fetchActivityCompatibleAction.isLoading(true));
    dispatch(fetchActivityCompatibleAction.error(null));

    try {
      const response = await fetchPaymentPackListAPI({
        meta_activity,
        page,
        page_size,
        disabled: false,
      });
      const paymentPacksAllIds = createIdList(response.data.results);
      const paymentPacksById = createDictionnaryById(response.data.results);
      const { count } = response.data;

      dispatch(
        fetchActivityCompatibleAction.success({
          paymentPacksAllIds,
          paymentPacksById,
          count,
          page,
        }),
      );
    } catch (err) {
      dispatch(fetchActivityCompatibleAction.error(err));
    }
    dispatch(fetchActivityCompatibleAction.isLoading(false));
  };
}

export const fetchMarketplacePacksAction = {
  isLoading: createAction('PAYMENT_PACK/MARKETPLACE/IS_LOADING'),
  error: createAction('PAYMENT_PACK/MARKETPLACE/ERROR'),
  success: createAction('PAYMENT_PACK/MARKETPLACE/SUCCESS'),
};

export function fetchMarketplacePacks(params: any, options): ThunkAction {
  return async (dispatch: Dispatch) => {
    dispatch(fetchMarketplacePacksAction.isLoading(true));
    dispatch(fetchMarketplacePacksAction.error(null));

    try {
      const response = await fetchPaymentPackListAPI(params);
      const paymentPacksAllIds = createIdList(response.data.results);
      const paymentPacksById = createDictionnaryById(response.data.results);

      dispatch(
        fetchMarketplacePacksAction.success({
          paymentPacksAllIds,
          paymentPacksById,
        }),
      );
      if (options && options.onSuccess) {
        options.onSuccess(response.data.results);
      }
    } catch (err) {
      dispatch(fetchMarketplacePacksAction.error(err));
    }
    dispatch(fetchMarketplacePacksAction.isLoading(false));
  };
}

export const paymentPackBulkActions = {
  isLoading: createAction('PAYMENT_PACK/BULK/IS_LOADING'),
  error: createAction('PAYMENT_PACK/BULK/ERROR'),
  success: createAction('PAYMENT_PACK/BULK/SUCCESS'),
};

export function fetchPaymentPackBulk(
  ids: Array<number>,
  options: ?{ onSuccess: ?() => void, onError: ?() => void },
): ThunkAction {
  return async (dispatch: Dispatch) => {
    const ids_uniq = uniq(ids);
    if (ids_uniq.length === 0) {
      return;
    }
    dispatch(paymentPackBulkActions.isLoading(true));
    dispatch(paymentPackBulkActions.error(null));

    try {
      const response = await fetchPaymentPackListAPI({
        id__in: ids_uniq,
        page_size: null,
      });
      const paymentPacksAllIds = createIdList(response.data.results);
      const paymentPacksById = createDictionnaryById(response.data.results);
      dispatch(
        paymentPackBulkActions.success({
          paymentPacksAllIds,
          paymentPacksById,
        }),
      );
      if (options && options.onSuccess) options.onSuccess();
    } catch (err) {
      dispatch(paymentPackBulkActions.error(err));
      if (options && options.onError) options.onError();
    }
    dispatch(paymentPackBulkActions.isLoading(false));
  };
}
export const notificationListActions = {
  isLoading: createAction('PAYMENT_PACK_NOTIFICATION/LIST/IS_LOADING'),
  error: createAction('PAYMENT_PACK_NOTIFICATION/LIST/ERROR'),
  success: createAction('PAYMENT_PACK_NOTIFICATION/LIST/SUCCESS'),
};

export function fetchPackNotifications(paymentPackId: number, options: any) {
  return async (dispatch: Dispatch) => {
    dispatch(notificationListActions.isLoading(true));
    dispatch(notificationListActions.error(null));
    try {
      const response = await fetchNotificationsAPI(paymentPackId);
      const notificationById = createDictionnaryById(response.data);

      dispatch(notificationListActions.success(notificationById));
      if (options && options.onSuccess) options.onSuccess(response.data);
    } catch (error) {
      console.error(error);
      dispatch(notificationListActions.error(error));
    }
    dispatch(notificationListActions.isLoading(false));
  };
}

export const notificationCreateActions = {
  isLoading: createAction('PAYMENT_PACK_NOTIFICATION/CREATE/IS_LOADING'),
  error: createAction('PAYMENT_PACK_NOTIFICATION/CREATE/ERROR'),
  success: createAction('PAYMENT_PACK_NOTIFICATION/CREATE/SUCCESS'),
};

export function createPackNotification(
  data: any,
  options: ?{ onSuccess: ?() => void, onError: ?() => void },
) {
  return async (dispatch: Dispatch) => {
    dispatch(notificationCreateActions.isLoading(true));
    dispatch(notificationCreateActions.error(null));
    try {
      const response = await createNotificationAPI(data);
      dispatch(notificationCreateActions.success(response.data));
      if (options && options.onSuccess) options.onSuccess();
    } catch (error) {
      console.error(error);
      dispatch(notificationCreateActions.error(error));
      if (options && options.onError) options.onError();
    }
    dispatch(notificationCreateActions.isLoading(false));
  };
}

export const notificationDeleteActions = {
  isLoading: createAction('PAYMENT_PACK_NOTIFICATION/DELETE/IS_LOADING'),
  error: createAction('PAYMENT_PACK_NOTIFICATION/DELETE/ERROR'),
  success: createAction('PAYMENT_PACK_NOTIFICATION/DELETE/SUCCESS'),
};

export function deletePackNotification(
  notificationData: any,
  options: ?{ onSuccess: ?() => void, onError: ?() => void },
) {
  return async (dispatch: Dispatch) => {
    dispatch(notificationDeleteActions.isLoading(true));
    dispatch(notificationDeleteActions.error(null));
    try {
      const response = await deleteNotificationAPI(notificationData.id);
      if (response.status >= 200 && response.status < 300) {
        dispatch(notificationDeleteActions.success(notificationData.id));
      }
      if (options && options.onSuccess) options.onSuccess();
    } catch (error) {
      console.error(error);
      dispatch(notificationDeleteActions.error(error));
      if (options && options.onError) options.onError();
    }
    dispatch(notificationDeleteActions.isLoading(false));
  };
}

export const notificationUpdateActions = {
  isLoading: createAction('PAYMENT_PACK_NOTIFICATION/PATCH/IS_LOADING'),
  error: createAction('PAYMENT_PACK_NOTIFICATION/PATCH/ERROR'),
  success: createAction('PAYMENT_PACK_NOTIFICATION/PATCH/SUCCESS'),
};

export function updatePackNotification(
  data: any,
  options: ?{ onSuccess: ?() => void, onError: ?() => void },
) {
  return async (dispatch: Dispatch) => {
    dispatch(notificationUpdateActions.isLoading(data.id));
    dispatch(notificationUpdateActions.error(null));
    try {
      const response = await updateNotificationAPI(data);
      dispatch(notificationUpdateActions.success(response.data));
      if (options && options.onSuccess) options.onSuccess();
    } catch (error) {
      console.error(error);
      dispatch(notificationUpdateActions.error(error));
      if (options && options.onError) options.onError();
    }
    dispatch(notificationUpdateActions.isLoading(null));
  };
}

export const paymentPackForBookingActions = {
  isLoading: createAction('PAYMENT_PACK/FOR_BOOKIN/IS_LOADING'),
  error: createAction('PAYMENT_PACK/FOR_BOOKING/ERROR'),
  success: createAction('PAYMENT_PACK/FOR_BOOKING/SUCCESS'),
  reset: createAction('PAYMENT_PACK/FOR_BOOKING/RESET'),
};

export const resetPaymentPackForBooking = paymentPackForBookingActions.reset;

export function fetchPaymentPackForBooking(
  offer: number,
  company: number,
  options: OptionCallback,
) {
  return async (dispatch: Dispatch) => {
    dispatch(paymentPackForBookingActions.isLoading(true));
    dispatch(paymentPackForBookingActions.error(null));
    try {
      const response = await fetchPaymentPackListAPI({
        offer,
        company,
        manager_only: false,
        disabled: false,
        as_consumer: true,
      });
      dispatch(paymentPackForBookingActions.success(response.data));
      if (options && options.onSuccess) {
        options.onSuccess(response.data.results);
      }
    } catch (error) {
      console.error(error);
      dispatch(paymentPackForBookingActions.error(error));
      if (options && options.onError) options.onError();
    }
    dispatch(paymentPackForBookingActions.isLoading(null));
  };
}

export const listPaymentPackCompatibleActions = {
  isLoading: createAction('PAYMENT_PACK/LIST_COMPATIBLE/IS_LOADING'),
  error: createAction('PAYMENT_PACK/LIST_COMPATIBLE/ERROR'),
  success: createAction('PAYMENT_PACK/LIST_COMPATIBLE/SUCCESS'),
  reset: createAction('PAYMENT_PACK/LIST_COMPATIBLE/RESET'),
};

export const resetPaymentPackCompatible =
  listPaymentPackCompatibleActions.reset;

export function fetchPaymentPackCompatibleList(
  params: any,
  options: OptionCallback,
) {
  return async (dispatch: Dispatch) => {
    dispatch(listPaymentPackCompatibleActions.isLoading(true));
    dispatch(listPaymentPackCompatibleActions.error(null));
    try {
      const response = await fetchPaymentPackCompatibleListAPI(params);
      dispatch(listPaymentPackCompatibleActions.success(response.data));
      if (options && options.onSuccess) {
        options.onSuccess(response.data.results);
      }
    } catch (error) {
      console.error(error);
      dispatch(listPaymentPackCompatibleActions.error(error));
      if (options && options.onError) options.onError();
    }
    dispatch(listPaymentPackCompatibleActions.isLoading(null));
  };
}
