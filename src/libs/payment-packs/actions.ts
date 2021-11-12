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
  fetchAllPaymentPackCategory as fetchAllPaymentPackCategoryAPI,
  updatePaymentPackCategory as updatePaymentPackCategoryAPI,
  createPaymentPackCategory as createPaymentPackCategoryAPI,
  // Notifications
  // -----------------
  updatePaymentPackNotifications as updateNotificationAPI,
  createPaymentPackNotifications as createNotificationAPI,
  fetchPaymentPackNotifications as fetchNotificationsAPI,
  deletePaymentPackNotifications as deleteNotificationAPI,
  fetchPaymentPackCompatibleList as fetchPaymentPackCompatibleListAPI,
  deletePaymentPackCategory as deletePaymentPackCategoryAPI,
  editOrder,
  fetchPaymentPackTemplateList as fetchPaymentPackTemplateListAPI,
  retrievePaymentPackTemplate as retrievePaymentPackTemplateAPI,
  createOrUpdatePaymentPackTemplate as createOrUpdatePaymentPackTemplateAPI,
  deletePaymentPackTemplate as deletePaymentPackTemplateAPI,
  createPaymentPackTemplateInstance as createPaymentPackTemplateInstanceAPI,
  deletePaymentPackTemplateInstance as deletePaymentPackTemplateInstanceAPI,
} from './api';

import { snackbarSuccess, snackbarError } from '../snackbar/actions';
import {
  actionTypes as types,
  PaymentPack,
  PaymentPackCategory,
  PaymentPackCategoryWithPacks,
} from './types';
import { createDictionnaryById, createIdList } from '../../actions/utils';

import type { Dispatch, OptionCallback, ThunkAction } from '../../state/types';

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

export function patch(id: number, data: any) {
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
    let promise = null;
    try {
      const response = await fetchOneAPI(id);
      promise = response.data;
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
    return promise;
  };
}

export function updateOrder(
  data: { id: number; ordering_in_category: number },
  options?: OptionCallback,
) {
  return async (dispatch: Dispatch) => {
    dispatch(updatePaymentPackActions.isLoading(data.id));
    try {
      const response = await editOrder(data);
      dispatch(updatePaymentPackActions.success(response.data));
      if (options && options.onSuccess) options.onSuccess(response.data);
    } catch (err) {
      console.error(err);
      dispatch(updatePaymentPackActions.error(err));
      dispatch(snackbarError('paymentPack.createOrUpdate.fail'));
      if (options && options.onError) options.onError();
    }
    dispatch(updatePaymentPackActions.isLoading(data.id));
  };
}

export function createOrUpdate(data: any, options?: OptionCallback) {
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
        if (options && options.onSuccess) options.onSuccess(response.data);
      }
    } catch (err) {
      console.error(err);
      dispatch(createOrUpdateFailed(err));
      dispatch(snackbarError('paymentPack.createOrUpdate.fail'));
      if (options && options.onError) options.onError();
    }
  };
}

export function startCreateOrUpdate(id: number) {
  return { type: types.PAYMENT_PACK_CREATEORUPDATE_START, id };
}

export function createOrUpdateSuccess(paymentPack: PaymentPack) {
  return { type: types.PAYMENT_PACK_CREATEORUPDATE_SUCCESS, paymentPack };
}

export function createOrUpdateFailed(error?: Error) {
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

export function fetchMarketplacePacks(
  params: any,
  options?: OptionCallback,
): ThunkAction {
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
  options?: OptionCallback,
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
      if (options && options.onSuccess) {
        options.onSuccess(response.data.results);
      }
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

export function createPackNotification(data: any, options?: OptionCallback) {
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
  options?: OptionCallback,
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

export function updatePackNotification(data: any, options?: OptionCallback) {
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

export const listAllPaymentPackCategoryActions = {
  isLoading: createAction('PAYMENT_PACK_CATEGORY/LIST/IS_LOADING'),
  error: createAction('PAYMENT_PACK_CATEGORY/LIST/ERROR'),
  success: createAction('PAYMENT_PACK_CATEGORY/LIST/SUCCESS'),
};

export function fetchAllPaymentPackCategory(companyId?: number) {
  return async (dispatch: Dispatch) => {
    dispatch(listAllPaymentPackCategoryActions.error(null));
    try {
      const response = await fetchAllPaymentPackCategoryAPI({ companyId });
      const paymentPacks = response.data;
      dispatch(listAllPaymentPackCategoryActions.success(paymentPacks));
    } catch (err) {
      console.error(err);
      dispatch(listAllPaymentPackCategoryActions.error(err));
    }
    dispatch(listAllPaymentPackCategoryActions.isLoading(false));
  };
}
export const upsertPaymenPackCategoryActions = {
  isLoading: createAction('PAYMENT_PACK_CATEGORY/UPSERT/IS_LOADING'),
  error: createAction('PAYMENT_PACK_CATEGORY/UPSERT/ERROR'),
  success: createAction('PAYMENT_PACK_CATEGORY/UPSERT/SUCCESS'),
};

export function updatePaymentPackCategoryOrder(
  category: PaymentPackCategory,
  options?: OptionCallback,
) {
  return async (dispatch: Dispatch) => {
    dispatch(upsertPaymenPackCategoryActions.isLoading(true));
    try {
      const response = await updatePaymentPackCategoryAPI(category);
      dispatch(upsertPaymenPackCategoryActions.success(response.data));
      if (options && options.onSuccess) options.onSuccess(response.data);
    } catch (error) {
      dispatch(snackbarError(`paymentPack.category.update.error`));
      dispatch(upsertPaymenPackCategoryActions.error(error.response.data));
      if (options && options.onError) options.onError();
    }
    dispatch(upsertPaymenPackCategoryActions.isLoading(false));
  };
}

export function upsertPaymenPackCategory(
  category: PaymentPackCategory,
  options?: OptionCallback,
) {
  return async (dispatch: Dispatch) => {
    dispatch(upsertPaymenPackCategoryActions.isLoading(true));
    dispatch(upsertPaymenPackCategoryActions.error(null));
    const kind = category.id ? 'update' : 'create';
    try {
      const response = category.id
        ? await updatePaymentPackCategoryAPI(category)
        : await createPaymentPackCategoryAPI(category);
      dispatch(upsertPaymenPackCategoryActions.success(response.data));
      dispatch(snackbarSuccess(`paymentPack.category.${kind}.success`));
      if (options && options.onSuccess) options.onSuccess(response.data);
    } catch (error) {
      dispatch(snackbarError(`paymentPack.category.${kind}.error`));
      dispatch(upsertPaymenPackCategoryActions.error(error.response.data));
      if (options && options.onError) options.onError();
    }
    dispatch(upsertPaymenPackCategoryActions.isLoading(false));
  };
}

export const deletePaymentPackCategoryActions = {
  error: createAction('PAYMENT_PACK_CATEGORY/DELETE/ERROR'),
  isLoading: createAction('PAYMENT_PACK_CATEGORY/DELETE/IS_LOADING'),
  success: createAction('PAYMENT_PACK_CATEGORY/DELETE/SUCCESS'),
};

export function deletePaymentPackCategory(
  category: PaymentPackCategoryWithPacks,
  options?: OptionCallback<PaymentPackCategoryWithPacks>,
) {
  return async (dispatch: Dispatch) => {
    dispatch(deletePaymentPackCategoryActions.isLoading(true));
    try {
      await deletePaymentPackCategoryAPI(category);
      dispatch(deletePaymentPackCategoryActions.success(category));
      dispatch(snackbarSuccess('paymentPack.category.delete.success'));
      if (options && options.onSuccess) options.onSuccess(category);
    } catch (error) {
      dispatch(deletePaymentPackCategoryActions.error(category));
      dispatch(snackbarError('paymentPack.category.delete.error'));
      if (options && options.onError) options.onError();
    }
    dispatch(deletePaymentPackCategoryActions.isLoading(false));
  };
}

export const listPaymentPackActions = {
  isLoading: createAction('PAYMENT_PACK/LIST_BASE/IS_LOADING'),
  error: createAction('PAYMENT_PACK/LIST_BASE/ERROR'),
  success: createAction('PAYMENT_PACK/LIST_BASe/SUCCESS'),
};

export function fetchPaymentPackList(
  params: any = {},
  options?: OptionCallback,
) {
  return async (dispatch: Dispatch) => {
    dispatch(listPaymentPackActions.error(null));
    dispatch(listPaymentPackActions.isLoading(true));
    try {
      const response = await fetchPaymentPackListAPI(params);
      dispatch(
        listPaymentPackActions.success(response.data.results || response.data),
      );

      if (options && options.onSuccess) {
        options.onSuccess(response.data.results || response.data);
      }
    } catch (err) {
      console.error(err);
      dispatch(listPaymentPackActions.error(err));
      if (options && options.onError) options.onError(err);
    }
    dispatch(listPaymentPackActions.isLoading(false));
  };
}

export const listPaymentPackTemplateActions = {
  isLoading: createAction('PAYMENT_PACK_TEMPLATE/LIST/IS_LOADING'),
  error: createAction('PAYMENT_PACK_TEMPLATE/LIST/ERROR'),
  success: createAction('PAYMENT_PACK_TEMPLATE/LIST/SUCCESS'),
};

export function fetchPaymentPackTemplateList(
  params: any = {},
  options?: OptionCallback,
) {
  return async (dispatch: Dispatch) => {
    dispatch(listPaymentPackTemplateActions.error(null));
    dispatch(listPaymentPackTemplateActions.isLoading(true));
    try {
      const response = await fetchPaymentPackTemplateListAPI(params);
      dispatch(
        listPaymentPackTemplateActions.success(
          response.data.results || response.data,
        ),
      );

      if (options && options.onSuccess) {
        options.onSuccess(response.data.results || response.data);
      }
    } catch (err) {
      console.error(err);
      dispatch(listPaymentPackTemplateActions.error(err));
      if (options && options.onError) options.onError(err);
    }
    dispatch(listPaymentPackTemplateActions.isLoading(false));
  };
}

export const createOrUpdatePaymentPackTemplateActions = {
  isLoading: createAction('PAYMENT_PACK_TEMPLATE/CREATE_OR_UPDATE/IS_LOADING'),
  error: createAction('PAYMENT_PACK_TEMPLATE/CREATE_OR_UPDATE/ERROR'),
  success: createAction('PAYMENT_PACK_TEMPLATE/CREATE_OR_UPDATE/SUCCESS'),
};

export function createOrUpdatePaymentPackTemplate(
  data: any = {},
  options?: OptionCallback,
) {
  return async (dispatch: Dispatch) => {
    dispatch(createOrUpdatePaymentPackTemplateActions.error(null));
    dispatch(createOrUpdatePaymentPackTemplateActions.isLoading(true));
    try {
      const response = await createOrUpdatePaymentPackTemplateAPI(data);
      dispatch(createOrUpdatePaymentPackTemplateActions.success(response.data));

      if (options && options.onSuccess) {
        options.onSuccess(response.data);
      }
    } catch (err) {
      console.error(err);
      dispatch(createOrUpdatePaymentPackTemplateActions.error(err));
      if (options && options.onError) options.onError(err);
    }
    dispatch(createOrUpdatePaymentPackTemplateActions.isLoading(false));
  };
}

export const retrievePaymentPackTemplateActions = {
  isLoading: createAction('PAYMENT_PACK_TEMPLATE/RETRIEVE/IS_LOADING'),
  error: createAction('PAYMENT_PACK_TEMPLATE/RETRIEVE/ERROR'),
  success: createAction('PAYMENT_PACK_TEMPLATE/RETRIEVE/SUCCESS'),
};

export function retrievePaymentPackTemplate(
  id: number,
  options?: OptionCallback,
) {
  return async (dispatch: Dispatch) => {
    dispatch(retrievePaymentPackTemplateActions.error(null));
    dispatch(retrievePaymentPackTemplateActions.isLoading(true));
    try {
      const response = await retrievePaymentPackTemplateAPI(id);
      dispatch(retrievePaymentPackTemplateActions.success(response.data));

      if (options && options.onSuccess) {
        options.onSuccess(response.data);
      }
    } catch (err) {
      console.error(err);
      dispatch(retrievePaymentPackTemplateActions.error(err));
      if (options && options.onError) options.onError(err);
    }
    dispatch(retrievePaymentPackTemplateActions.isLoading(false));
  };
}

export const deletePaymentPackTemplateActions = {
  isLoading: createAction('PAYMENT_PACK_TEMPLATE/DELETE/IS_LOADING'),
  error: createAction('PAYMENT_PACK_TEMPLATE/DELETE/ERROR'),
  success: createAction('PAYMENT_PACK_TEMPLATE/DELETE/SUCCESS'),
};

export function deletePaymentPackTemplate(
  id: number,
  options?: OptionCallback,
) {
  return async (dispatch: Dispatch) => {
    dispatch(deletePaymentPackTemplateActions.error(null));
    dispatch(deletePaymentPackTemplateActions.isLoading(true));
    try {
      const response = await deletePaymentPackTemplateAPI(id);
      dispatch(deletePaymentPackTemplateActions.success(id));

      if (options && options.onSuccess) {
        options.onSuccess(response.data);
      }
    } catch (err) {
      console.error(err);
      dispatch(deletePaymentPackTemplateActions.error(err));
      if (options && options.onError) options.onError(err);
    }
    dispatch(deletePaymentPackTemplateActions.isLoading(false));
  };
}

export const createPaymentPackTemplateInstanceActions = {
  isLoading: createAction('PAYMENT_PACK_TEMPLATE_INSTANCE/CREATE/IS_LOADING'),
  error: createAction('PAYMENT_PACK_TEMPLATE_INSTANCE/CREATE/ERROR'),
  success: createAction('PAYMENT_PACK_TEMPLATE_INSTANCE/CREATE/SUCCESS'),
};

export function createPaymentPackTemplateInstance(
  data: any,
  options?: OptionCallback,
) {
  return async (dispatch: Dispatch) => {
    dispatch(createPaymentPackTemplateInstanceActions.error(null));
    dispatch(createPaymentPackTemplateInstanceActions.isLoading(true));
    try {
      const response = await createPaymentPackTemplateInstanceAPI(data);
      dispatch(createPaymentPackTemplateInstanceActions.success(response.data));

      if (options && options.onSuccess) {
        options.onSuccess(response.data);
      }
    } catch (err) {
      console.error(err);
      dispatch(createPaymentPackTemplateInstanceActions.error(err));
      if (options && options.onError) options.onError(err);
    }
    dispatch(createPaymentPackTemplateInstanceActions.isLoading(false));
  };
}

export const deletePaymentPackTemplateInstanceActions = {
  isLoading: createAction('PAYMENT_PACK_TEMPLATE_INSTANCE/DELETE/IS_LOADING'),
  error: createAction('PAYMENT_PACK_TEMPLATE_INSTANCE/DELETE/ERROR'),
  success: createAction('PAYMENT_PACK_TEMPLATE_INSTANCE/DELETE/SUCCESS'),
};

export function deletePaymentPackTemplateInstance(
  id: number,
  options?: OptionCallback,
) {
  return async (dispatch: Dispatch) => {
    dispatch(deletePaymentPackTemplateInstanceActions.error(null));
    dispatch(deletePaymentPackTemplateInstanceActions.isLoading(true));
    try {
      const response = await deletePaymentPackTemplateInstanceAPI(id);
      dispatch(deletePaymentPackTemplateInstanceActions.success(response.data));

      if (options && options.onSuccess) {
        options.onSuccess(response.data);
      }
    } catch (err) {
      console.error(err);
      dispatch(deletePaymentPackTemplateInstanceActions.error(err));
      if (options && options.onError) options.onError(err);
    }
    dispatch(deletePaymentPackTemplateInstanceActions.isLoading(false));
  };
}
