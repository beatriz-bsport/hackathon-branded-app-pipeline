import { createAction } from 'redux-actions';
import uniq from 'lodash/uniq';

import { monitorBackgroundTask } from '#src/libs/background-task/actions';
import {
  FranchiseProductTemplateQueryParams,
  FranchiseProductTemplatePaginatedQueryParams,
} from '#src/libs/franchise/types';
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
  isPaymentPackUsedInCombo as isPaymentPackUsedInComboAPI,
  fetchPaymentPackCompatibleList as fetchPaymentPackCompatibleListAPI,
  deletePaymentPackCategory as deletePaymentPackCategoryAPI,
  editOrder,
  fetchPaymentPackTemplateList as fetchPaymentPackTemplateListAPI,
  fetchPaymentPackTemplateListPaginated as fetchPaymentPackTemplateListPaginatedAPI,
  fetchUniversalPaymentPackTemplateList as fetchUniversalPaymentPackTemplateListAPI,
  fetchUniversalPaymentPackTemplatePaginatedList as fetchUniversalPaymentPackTemplatePaginatedListAPI,
  retrievePaymentPackTemplate as retrievePaymentPackTemplateAPI,
  retrieveUniversalPaymentPackTemplate as retrieveUniversalPaymentPackTemplateAPI,
  createOrUpdatePaymentPackTemplate as createOrUpdatePaymentPackTemplateAPI,
  createOrUpdateUniversalPaymentPackTemplate as createOrUpdateUniversalPaymentPackTemplateAPI,
  deletePaymentPackTemplate as deletePaymentPackTemplateAPI,
  restorePaymentPackTemplate as restorePaymentPackTemplateAPI,
  deleteUniversalPaymentPackTemplate as deleteUniversalPaymentPackTemplateAPI,
  restoreUniversalPaymentPackTemplate as restoreUniversalPaymentPackTemplateAPI,
  createPaymentPackTemplateInstance as createPaymentPackTemplateInstanceAPI,
  deletePaymentPackTemplateInstance as deletePaymentPackTemplateInstanceAPI,
  editCategoryOrder,
  editPackCompatibilities as editPackCompatibilitiesAPI,
  fetchPaymentPackMassExtensionList as fetchPaymentPackMassExtensionListAPI,
  createPaymentPackMassExtension as createPaymentPackMassExtensionAPI,
  deletePaymentPackMassExtension as deletePaymentPackMassExtensionAPI,
} from './api';

import { snackbarSuccess, snackbarError } from '../snackbar/actions';
import {
  actionTypes as types,
  PaymentPack,
  PaymentPackCategory,
  PaymentPackCategoryWithPacks,
  PaymentPackTemplate,
  PaymentPackCompatibilitiesData,
  PaymentPackMassExtension,
  PaymentPackMassExtensionCreate,
  PaymentPackMassExtensionParams,
  PaymentPackTemplateAPI,
} from './types';
// @ts-expect-error
import { createDictionnaryById, createIdList } from '../../actions/utils';

import type {
  Dispatch,
  OptionCallback,
  ThunkAction,
  OptionBackgroundCallback,
  PaginatedResponse,
} from '../../state/types';
import type { RootState } from '../../reducers';
import {
  PAYMENT_PACK_MASS_EXTENSION_PAGE_SIZE,
  FRANCHISE_PAYMENT_PACK_TEMPLATE_PAGINATION_SIZE,
} from './constants';

export const scalePaymentPackCreditActions = {
  isLoading: createAction('PAYMENT_PACK/SCALE_CREDIT/IS_LOADING'),
  error: createAction('PAYMENT_PACK/SCALE_CREDIT/ERROR'),
  success: createAction('PAYMENT_PACK/SCALE_CREDIT/SUCCESS'),
};

export function scalePaymentPackCredit(
  id: number,
  data: any,
  options: OptionBackgroundCallback,
) {
  return async (dispatch: Dispatch) => {
    dispatch(scalePaymentPackCreditActions.error(null));
    dispatch(scalePaymentPackCreditActions.isLoading(true));
    try {
      // TODO update reducer after endpoint/serializer cleaning
      const response = await scalePaymentPackCreditAPI(id, data);
      const backgroundTaskUuid = response.headers['x-background-task-uuid'];
      options?.onSuccess?.();

      dispatch(
        monitorBackgroundTask(backgroundTaskUuid, {
          onSuccess: options?.onBackgroundSuccess,
          onError: options?.onBackgroundError,
        }),
      );
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

export function refreshAllPaymentPack(options?: OptionCallback) {
  return async (dispatch: Dispatch) => {
    dispatch(listAllPaymentPackActions.error(null));
    try {
      const response = await fetchAllPaymentPacksAPI();
      const paymentPacks = response.data.results;
      dispatch(listAllPaymentPackActions.success(paymentPacks));
      if (options && options.onSuccess) {
        options.onSuccess(response.data);
      }
    } catch (err) {
      if (options && options.onError) {
        options.onError(err);
      }
      console.error(err);
      dispatch(listAllPaymentPackActions.error(err));
    }
    dispatch(listAllPaymentPackActions.isLoading(false));
  };
}

export function fetchAllPaymentPacks(options: OptionCallback) {
  return async (dispatch: Dispatch) => {
    dispatch(listAllPaymentPackActions.isLoading(true));
    dispatch(refreshAllPaymentPack(options));
  };
}

export const updatePaymentPackActions = {
  isLoading: createAction('PAYMENT_PACK/PATCH/IS_LOADING'),
  isNotLoading: createAction('PAYMENT_PACK/PATCH/IS_NOT_LOADING'),
  error: createAction('PAYMENT_PACK/PATCH/ERROR'),
  success: createAction('PAYMENT_PACK/PATCH/SUCCESS'),
};

export function patch(
  id: number,
  data: any,
  options?: OptionCallback<PaymentPack>,
) {
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
      if (options?.onSuccess) options.onSuccess(response.data);
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
      if (options?.onError) options.onError();
    }

    dispatch(updatePaymentPackActions.isNotLoading(id));
  };
}

export const fetchOneAction = {
  isLoading: createAction('PAYMENT_PACK/DETAIL/IS_LOADING'),
  error: createAction('PAYMENT_PACK/DETAIL/ERROR'),
  success: createAction('PAYMENT_PACK/DETAIL/SUCCESS'),
};

export function fetchOne(id: number, options?: OptionCallback<PaymentPack>) {
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

export const updatePaymentPackOrderActions = {
  isLoading: createAction('PAYMENT_PACK/PATCH_ORDER/IS_LOADING'),
  error: createAction('PAYMENT_PACK/PATCH_ORDER/ERROR'),
  success: createAction('PAYMENT_PACK/PATCH_ORDER/SUCCESS'),
};

export function updateOrder(
  data: Array<{ id: number; ordering_in_category: number }>,
  options?: OptionCallback,
) {
  return async (dispatch: Dispatch) => {
    dispatch(updatePaymentPackOrderActions.isLoading(data));
    try {
      const response = await editOrder(data);
      dispatch(updatePaymentPackOrderActions.success(response.data));
      if (options && options.onSuccess) options.onSuccess(response.data);
    } catch (err) {
      console.error(err);
      dispatch(updatePaymentPackOrderActions.error(err));
      dispatch(snackbarError('paymentPack.createOrUpdate.fail'));
      if (options && options.onError) options.onError();
    }
    dispatch(updatePaymentPackOrderActions.isLoading(data));
  };
}

export const updatePaymentPackCompatibilitiesAction = {
  isLoading: createAction<boolean>(
    'PAYMENT_PACK/PATCH_COMPATIBILITIES/IS_LOADING',
  ),
  error: createAction<Error | null>('PAYMENT_PACK/PATCH_COMPATIBILITIES/ERROR'),
  success: createAction<PaymentPack>(
    'PAYMENT_PACK/PATCH_COMPATIBILITIES/SUCCESS',
  ),
};

export function updatePaymentPackCompatibilities(
  input: {
    paymentPackId: number;
    data: PaymentPackCompatibilitiesData;
  },
  options?: OptionCallback<PaymentPack>,
) {
  return async (dispatch: Dispatch) => {
    dispatch(updatePaymentPackCompatibilitiesAction.isLoading(true));
    dispatch(updatePaymentPackCompatibilitiesAction.error(null));
    try {
      const response = await editPackCompatibilitiesAPI(
        input.paymentPackId,
        input.data,
      );
      dispatch(updatePaymentPackCompatibilitiesAction.success(response.data));
      options?.onSuccess(response.data);
    } catch (err) {
      console.error(err);
      dispatch(updatePaymentPackCompatibilitiesAction.error(err));
      dispatch(snackbarError('paymentPack.compatibilitiesUpdate.fail'));
      options?.onError(err);
    }
    dispatch(updatePaymentPackCompatibilitiesAction.isLoading(false));
  };
}

export function createOrUpdate(
  data: any,
  options?: OptionCallback<PaymentPack>,
) {
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
      console.error(err);
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
  options?: OptionCallback<PaymentPack[]>,
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
      console.error(err);
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

export const paymentPackBulkWidgetActions = {
  success: createAction('WIDGET/PAYMENT_PACK/BULK/SUCCESS'),
};

export function fetchPaymentPackBulk(
  ids: Array<number>,
  options?: OptionCallback<PaymentPack[]>,
): ThunkAction {
  return async (dispatch: Dispatch) => {
    const ids_uniq = uniq((ids ?? []).filter((_id) => !!_id));

    if (ids_uniq.length === 0) {
      if (options && options.onSuccess) {
        options.onSuccess([]);
      }
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
      console.error(err);
      dispatch(paymentPackBulkActions.error(err));
      if (options && options.onError) options.onError();
    }
    dispatch(paymentPackBulkActions.isLoading(false));
  };
}

export function fetchPaymentPackBulkWidget(
  ids: Array<number>,
  options?: OptionCallback<PaginatedResponse<PaymentPack>>,
): ThunkAction {
  return async () => {
    const ids_uniq = uniq((ids ?? []).filter((_id) => !!_id));
    if (ids_uniq.length === 0) {
      if (options && options.onSuccess) {
        options.onSuccess();
      }
      return;
    }
    try {
      const response = await fetchPaymentPackListAPI({
        id__in: ids_uniq,
        page_size: null,
      });
      if (options && options.onSuccess) {
        options.onSuccess(response.data);
      }
    } catch (err) {
      console.error(err);

      if (options && options.onError) options.onError(err);
    }
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
  page: number,
  page_size: number,
  options?: OptionCallback<PaginatedResponse<PaymentPack>>,
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
        page,
        page_size,
        include_expired: false,
      });
      dispatch(paymentPackForBookingActions.success(response.data));
      if (options && options.onSuccess) {
        options.onSuccess(response.data);
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

export function fetchAllPaymentPackCategory(
  companyId?: number,
  options?: OptionCallback,
) {
  return async (dispatch: Dispatch) => {
    dispatch(listAllPaymentPackCategoryActions.error(null));
    dispatch(listAllPaymentPackCategoryActions.isLoading(true));
    try {
      const response = await fetchAllPaymentPackCategoryAPI({
        ...(companyId ? { companyId } : {}),
      });
      const paymentPacksCategories = response.data;
      dispatch(
        listAllPaymentPackCategoryActions.success(paymentPacksCategories),
      );
      if (options && options.onSuccess)
        options.onSuccess(paymentPacksCategories);
    } catch (err) {
      console.error(err);
      dispatch(listAllPaymentPackCategoryActions.error(err));
    }
    dispatch(listAllPaymentPackCategoryActions.isLoading(false));
  };
}

export const updatePaymentPackCategoryOrderActions = {
  isLoading: createAction('PAYMENT_PACK_CATEGORY/UPDATE_ORDER/IS_LOADING'),
  error: createAction('PAYMENT_PACK_CATEGORY/UPDATE_ORDER/ERROR'),
  success: createAction('PAYMENT_PACK_CATEGORY/UPDATE_ORDER/SUCCESS'),
};

export function updatePaymentPackCategoryOrder(
  data: Array<{ id: number; category_ordering: number }>,
  options?: OptionCallback,
) {
  return async (dispatch: Dispatch) => {
    dispatch(updatePaymentPackCategoryOrderActions.isLoading(true));
    try {
      const response = await editCategoryOrder(data);
      dispatch(updatePaymentPackCategoryOrderActions.success(response.data));
      if (options && options.onSuccess) options.onSuccess(response.data);
    } catch (error) {
      console.error(error);
      dispatch(snackbarError(`paymentPack.category.update.error`));
      dispatch(
        updatePaymentPackCategoryOrderActions.error(error.response.data),
      );
      if (options && options.onError) options.onError();
    }
    dispatch(updatePaymentPackCategoryOrderActions.isLoading(false));
  };
}

export const upsertPaymenPackCategoryActions = {
  isLoading: createAction('PAYMENT_PACK_CATEGORY/UPSERT/IS_LOADING'),
  error: createAction('PAYMENT_PACK_CATEGORY/UPSERT/ERROR'),
  success: createAction('PAYMENT_PACK_CATEGORY/UPSERT/SUCCESS'),
};

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
      console.error(error);
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
      console.error(error);
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
  success: createAction('PAYMENT_PACK/LIST_BASE/SUCCESS'),
  reset: createAction('PAYMENT_PACK/LIST_BASE/RESET'),
};

export const resetDisabledPaymentPack = () =>
  listPaymentPackActions.reset({
    disabled: true,
  });

export function fetchPaymentPackList(
  params: any = {},
  options?: OptionCallback<PaymentPack[]>,
) {
  return async (dispatch: Dispatch) => {
    dispatch(listPaymentPackActions.error(null));
    dispatch(listPaymentPackActions.isLoading(true));
    try {
      const response = await fetchPaymentPackListAPI(params);
      const responseData =
        'results' in response.data ? response.data.results : response.data;
      dispatch(listPaymentPackActions.success(responseData));

      if (options && options.onSuccess) {
        options.onSuccess(responseData);
      }
    } catch (err) {
      console.error(err);
      dispatch(listPaymentPackActions.error(err));
      if (options && options.onError) {
        err instanceof Error ? options.onError(err) : options.onError();
      }
    }
    dispatch(listPaymentPackActions.isLoading(false));
  };
}

/**
 * @deprecated This actions does not force any pagination and shall not be used anymore.
 */
export const listPaymentPackTemplateActions = {
  isLoading: createAction('PAYMENT_PACK_TEMPLATE/LIST/IS_LOADING'),
  error: createAction('PAYMENT_PACK_TEMPLATE/LIST/ERROR'),
  success: createAction('PAYMENT_PACK_TEMPLATE/LIST/SUCCESS'),
  bulkSuccess: createAction('PAYMENT_PACK_TEMPLATE/BULK/SUCCESS'),
  successManagerOnly: createAction(
    'PAYMENT_PACK_TEMPLATE/LIST/SUCCESS_MANAGER_ONLY',
  ),
  reset: createAction('PAYMENT_PACK_TEMPLATE/LIST/RESET'),
};

export const resetPaymentPackTemplateData =
  listPaymentPackTemplateActions.reset;

/**
 * @deprecated This method does not force any pagination and shall not be used anymore.
 */
export function fetchPaymentPackTemplateList(
  params?: FranchiseProductTemplateQueryParams,
  options?: OptionCallback<Array<PaymentPackTemplate>>,
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
export function fetchPaymentPackTemplateBulk(
  params: { id__in: number[] },
  options?: OptionCallback<Array<PaymentPackTemplate>>,
) {
  return async (dispatch: Dispatch) => {
    dispatch(listPaymentPackTemplateActions.error(null));
    dispatch(listPaymentPackTemplateActions.isLoading(true));
    try {
      const response = await fetchPaymentPackTemplateListAPI(params);
      dispatch(listPaymentPackTemplateActions.bulkSuccess(response.data));

      if (options && options.onSuccess) {
        options.onSuccess(response.data);
      }
    } catch (err) {
      console.error(err);
      dispatch(listPaymentPackTemplateActions.error(err));
      if (options && options.onError) options.onError(err);
    }
    dispatch(listPaymentPackTemplateActions.isLoading(false));
  };
}
export const listPaymentPackTemplatePaginatedActions = {
  isLoading: createAction<boolean>(
    'PAYMENT_PACK_TEMPLATE/AVAILABLE_FOR_SALE/PAGINATED_LIST/IS_LOADING',
  ),
  error: createAction<Error | null>(
    'PAYMENT_PACK_TEMPLATE/AVAILABLE_FOR_SALE/PAGINATED_LIST/ERROR',
  ),
  success: createAction<PaginatedResponse<PaymentPackTemplateAPI>>(
    'PAYMENT_PACK_TEMPLATE/AVAILABLE_FOR_SALE/PAGINATED_LIST/SUCCESS',
  ),
  reset: createAction(
    'PAYMENT_PACK_TEMPLATE/AVAILABLE_FOR_SALE/PAGINATED_LIST/RESET',
  ),
  isLoadingManagerOnly: createAction<boolean>(
    'PAYMENT_PACK_TEMPLATE/MANAGER_ONLY/PAGINATED_LIST/IS_LOADING',
  ),
  errorManagerOnly: createAction<Error | null>(
    'PAYMENT_PACK_TEMPLATE/MANAGER_ONLY/PAGINATED_LIST/ERROR',
  ),
  successManagerOnly: createAction<PaginatedResponse<PaymentPackTemplateAPI>>(
    'PAYMENT_PACK_TEMPLATE/MANAGER_ONLY/PAGINATED_LIST/SUCCESS',
  ),
  resetManagerOnly: createAction(
    'PAYMENT_PACK_TEMPLATE/MANAGER_ONLY/PAGINATED_LIST/RESET',
  ),
  isLoadingArchived: createAction<boolean>(
    'PAYMENT_PACK_TEMPLATE/ARCHIVED/PAGINATED_LIST/IS_LOADING',
  ),
  errorArchived: createAction<Error | null>(
    'PAYMENT_PACK_TEMPLATE/ARCHIVED/PAGINATED_LIST/ERROR',
  ),
  successArchived: createAction<PaginatedResponse<PaymentPackTemplateAPI>>(
    'PAYMENT_PACK_TEMPLATE/ARCHIVED/PAGINATED_LIST/SUCCESS',
  ),
  resetArchived: createAction(
    'PAYMENT_PACK_TEMPLATE/ARCHIVED/PAGINATED_LIST/RESET',
  ),
};

/**
 * @description This action fetches with pagination the PaymentPackTemplates of a master account being available for sale.
 * By forcing the available_for_sale parameter to true, only passes having manager_only=false AND is_usable_by_staff=true
 * will be send back via the API.
 * By forcing disabled parameter to false, we ensure that archived passes are not fetched
 */
export function fetchPaymentPackTemplatePaginatedListAvailableForSale(
  params?: FranchiseProductTemplatePaginatedQueryParams,
  options?: OptionCallback<PaginatedResponse<PaymentPackTemplateAPI>>,
): ThunkAction {
  return async (dispatch, getState: () => RootState) => {
    dispatch(listPaymentPackTemplatePaginatedActions.error(null));
    dispatch(listPaymentPackTemplatePaginatedActions.isLoading(true));

    const currentState =
      getState().paymentPackReworked.paymentPackTemplatePaginated
        .availablePasses;

    const nextPage = params?.page ?? currentState.next_page ?? 1;

    try {
      const response = await fetchPaymentPackTemplateListPaginatedAPI({
        ...params,
        available_for_sale: true,
        disabled: false,
        page: nextPage,
        page_size: FRANCHISE_PAYMENT_PACK_TEMPLATE_PAGINATION_SIZE,
      });
      dispatch(listPaymentPackTemplatePaginatedActions.success(response.data));

      options?.onSuccess?.(response.data);
    } catch (err) {
      console.error(err);
      dispatch(listPaymentPackTemplatePaginatedActions.error(err));
      options?.onError?.(err);
    }
    dispatch(listPaymentPackTemplatePaginatedActions.isLoading(false));
  };
}

/**
 * @deprecated This method does not force any pagination and shall not be used anymore.
 */
export function fetchPaymentPackTemplateListManagerOnly(
  options?: OptionCallback<Array<PaymentPackTemplate>>,
) {
  return async (dispatch: Dispatch) => {
    dispatch(listPaymentPackTemplateActions.error(null));
    dispatch(listPaymentPackTemplateActions.isLoading(true));
    try {
      const response = await fetchPaymentPackTemplateListAPI({
        available_for_sale: false,
      });
      dispatch(
        listPaymentPackTemplateActions.successManagerOnly(
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

/**
 * @description This action fetches with pagination the PaymentPackTemplates of a master account being for manager only usage.
 * By forcing the available_for_sale parameter to false, only passes having either manager_only=true OR is_usable_by_staff=false
 * will be send back via the API
 * By forcing disabled parameter to false, we ensure that archived passes are not fetched
 */
export function fetchPaymentPackTemplatePaginatedListManagerOnly(
  params?: FranchiseProductTemplatePaginatedQueryParams,
  options?: OptionCallback<PaginatedResponse<PaymentPackTemplateAPI>>,
): ThunkAction {
  return async (dispatch, getState) => {
    dispatch(listPaymentPackTemplatePaginatedActions.errorManagerOnly(null));
    dispatch(
      listPaymentPackTemplatePaginatedActions.isLoadingManagerOnly(true),
    );
    const currentState =
      getState().paymentPackReworked.paymentPackTemplatePaginated
        .managerOnlyPasses;

    const nextPage = params?.page ?? currentState.next_page ?? 1;

    try {
      const response = await fetchPaymentPackTemplateListPaginatedAPI({
        ...params,
        available_for_sale: false,
        disabled: false,
        page: nextPage,
        page_size: FRANCHISE_PAYMENT_PACK_TEMPLATE_PAGINATION_SIZE,
      });
      dispatch(
        listPaymentPackTemplatePaginatedActions.successManagerOnly(
          response.data,
        ),
      );

      options?.onSuccess?.(response.data);
    } catch (err) {
      console.error(err);
      dispatch(listPaymentPackTemplatePaginatedActions.errorManagerOnly(err));
      options?.onError?.(err);
    }
    dispatch(
      listPaymentPackTemplatePaginatedActions.isLoadingManagerOnly(false),
    );
  };
}

/**
 * @description This action fetches with pagination the PaymentPackTemplates of a master account being archived.
 * By forcing disabled parameter to true, we ensure that only archived passes are fetched
 */
export function fetchPaymentPackTemplatePaginatedListArchived(
  params?: FranchiseProductTemplatePaginatedQueryParams,
  options?: OptionCallback<PaginatedResponse<PaymentPackTemplateAPI>>,
): ThunkAction {
  return async (dispatch, getState: () => RootState) => {
    dispatch(listPaymentPackTemplatePaginatedActions.errorArchived(null));
    dispatch(listPaymentPackTemplatePaginatedActions.isLoadingArchived(true));

    const currentState =
      getState().paymentPackReworked.paymentPackTemplatePaginated
        .archivedPasses;

    const nextPage = params?.page ?? currentState.next_page ?? 1;

    try {
      const response = await fetchPaymentPackTemplateListPaginatedAPI({
        ...params,
        disabled: true,
        page: nextPage,
        page_size: FRANCHISE_PAYMENT_PACK_TEMPLATE_PAGINATION_SIZE,
      });
      dispatch(
        listPaymentPackTemplatePaginatedActions.successArchived(response.data),
      );

      options?.onSuccess?.(response.data);
    } catch (err) {
      console.error(err);
      dispatch(
        listPaymentPackTemplatePaginatedActions.errorArchived(err as Error),
      );
      options?.onError?.(err as Error);
    }
    dispatch(listPaymentPackTemplatePaginatedActions.isLoadingArchived(false));
  };
}

/**
 * Type guard to check if the given object is of type PaginatedResponse<PaymentPackTemplate>.
 *
 * This function helps TypeScript narrow down the type of the provided object to PaginatedResponse<PaymentPackTemplate>
 * by checking for the presence of a property specific to this type: `results`
 *
 * @param data - The object to check, which can be either a PaginatedResponse<PaymentPackTemplate> or a PaymentPackTemplate[].
 * @returns A boolean indicating whether the object is of type PaginatedResponse<PaymentPackTemplate>.
 */
function isPaginatedPaymentPackTemplate(
  data: PaginatedResponse<PaymentPackTemplate> | PaymentPackTemplate[],
): data is PaginatedResponse<PaymentPackTemplate> {
  return (data as any).results !== undefined;
}

/**
 * @deprecated This actions does not force any pagination and shall not be used anymore.
 */
export const listUniversalPaymentPackTemplateActions = {
  isLoading: createAction('UNIVERSAL_PAYMENT_PACK_TEMPLATE/LIST/IS_LOADING'),
  error: createAction('UNIVERSAL_PAYMENT_PACK_TEMPLATE/LIST/ERROR'),
  success: createAction('UNIVERSAL_PAYMENT_PACK_TEMPLATE/LIST/SUCCESS'),
  successManagerOnly: createAction(
    'UNIVERSAL_PAYMENT_PACK_TEMPLATE/LIST/SUCCESS_MANAGER_ONLY',
  ),
  reset: createAction('UNIVERSAL_PAYMENT_PACK_TEMPLATE/LIST/RESET'),
};

export const listUniversalPaymentPackTemplatePaginatedActions = {
  isLoading: createAction<boolean>(
    'UNIVERSAL_PAYMENT_PACK_TEMPLATE/AVAILABLE_FOR_SALE/PAGINATED_LIST/IS_LOADING',
  ),
  error: createAction<Error | null>(
    'UNIVERSAL_PAYMENT_PACK_TEMPLATE/AVAILABLE_FOR_SALE/PAGINATED_LIST/ERROR',
  ),
  success: createAction<PaginatedResponse<PaymentPackTemplateAPI>>(
    'UNIVERSAL_PAYMENT_PACK_TEMPLATE/AVAILABLE_FOR_SALE/PAGINATED_LIST/SUCCESS',
  ),
  reset: createAction(
    'UNIVERSAL_PAYMENT_PACK_TEMPLATE/AVAILABLE_FOR_SALE/PAGINATED_LIST/RESET',
  ),
  isLoadingManagerOnly: createAction<boolean>(
    'UNIVERSAL_PAYMENT_PACK_TEMPLATE/MANAGER_ONLY/PAGINATED_LIST/IS_LOADING',
  ),
  errorManagerOnly: createAction<Error | null>(
    'UNIVERSAL_PAYMENT_PACK_TEMPLATE/MANAGER_ONLY/PAGINATED_LIST/ERROR',
  ),
  successManagerOnly: createAction<PaginatedResponse<PaymentPackTemplateAPI>>(
    'UNIVERSAL_PAYMENT_PACK_TEMPLATE/MANAGER_ONLY/PAGINATED_LIST/SUCCESS',
  ),
  resetManagerOnly: createAction(
    'UNIVERSAL_PAYMENT_PACK_TEMPLATE/MANAGER_ONLY/PAGINATED_LIST/RESET',
  ),
  isLoadingArchived: createAction<boolean>(
    'UNIVERSAL_PAYMENT_PACK_TEMPLATE/ARCHIVED/PAGINATED_LIST/IS_LOADING',
  ),
  errorArchived: createAction<Error | null>(
    'UNIVERSAL_PAYMENT_PACK_TEMPLATE/ARCHIVED/PAGINATED_LIST/ERROR',
  ),
  successArchived: createAction<PaginatedResponse<PaymentPackTemplateAPI>>(
    'UNIVERSAL_PAYMENT_PACK_TEMPLATE/ARCHIVED/PAGINATED_LIST/SUCCESS',
  ),
  resetArchived: createAction(
    'UNIVERSAL_PAYMENT_PACK_TEMPLATE/ARCHIVED/PAGINATED_LIST/RESET',
  ),
};

/**
 * @deprecated This method does not force any pagination and shall not be used anymore.
 */
export function fetchUniversalPassTemplateList(
  options?: OptionCallback<PaymentPackTemplate[]>,
) {
  return async (dispatch: Dispatch) => {
    dispatch(listUniversalPaymentPackTemplateActions.error(null));
    dispatch(listUniversalPaymentPackTemplateActions.isLoading(true));
    try {
      const response = await fetchUniversalPaymentPackTemplateListAPI({
        available_for_sale: true,
      });
      dispatch(
        listUniversalPaymentPackTemplateActions.success(
          isPaginatedPaymentPackTemplate(response.data)
            ? response.data.results
            : response.data,
        ),
      );

      options?.onSuccess?.(
        isPaginatedPaymentPackTemplate(response.data)
          ? response.data.results
          : response.data,
      );
    } catch (err) {
      console.error(err);
      dispatch(listUniversalPaymentPackTemplateActions.error(err));
      options?.onError?.(err);
    }
    dispatch(listUniversalPaymentPackTemplateActions.isLoading(false));
  };
}

/**
 * @description This action fetches with pagination the UniversalPaymentPackTemplates of a master account being available for sale.
 * By forcing the available_for_sale parameter to true, only passes having manager_only=false AND is_usable_by_staff=true
 * will be send back via the API.
 * By forcing disabled parameter to false, we ensure that archived passes are not fetched.
 */
export function fetchUniversalPaymentPackTemplatePaginatedListAvailableForSale(
  params?: FranchiseProductTemplatePaginatedQueryParams,
  options?: OptionCallback<PaginatedResponse<PaymentPackTemplateAPI>>,
): ThunkAction {
  return async (dispatch, getState: () => RootState) => {
    dispatch(listUniversalPaymentPackTemplatePaginatedActions.error(null));
    dispatch(listUniversalPaymentPackTemplatePaginatedActions.isLoading(true));

    const currentState =
      getState().paymentPackReworked.universalPaymentPackTemplatePaginated
        .availablePasses;

    const nextPage = params?.page ?? currentState.next_page ?? 1;

    try {
      const response = await fetchUniversalPaymentPackTemplatePaginatedListAPI({
        ...params,
        available_for_sale: true,
        disabled: false,
        page: nextPage,
        page_size: FRANCHISE_PAYMENT_PACK_TEMPLATE_PAGINATION_SIZE,
      });
      dispatch(
        listUniversalPaymentPackTemplatePaginatedActions.success(response.data),
      );

      options?.onSuccess?.(response.data);
    } catch (err) {
      console.error(err);
      dispatch(listUniversalPaymentPackTemplatePaginatedActions.error(err));
      options?.onError?.(err);
    }
    dispatch(listUniversalPaymentPackTemplatePaginatedActions.isLoading(false));
  };
}

/**
 * @description This action fetches with pagination the UniversalPaymentPackTemplates of a master account being archived.
 * By forcing disabled parameter to true, we ensure that only archived passes are fetched
 */
export function fetchUniversalPaymentPackTemplatePaginatedListArchived(
  params?: FranchiseProductTemplatePaginatedQueryParams,
  options?: OptionCallback<PaginatedResponse<PaymentPackTemplateAPI>>,
): ThunkAction {
  return async (dispatch, getState: () => RootState) => {
    dispatch(
      listUniversalPaymentPackTemplatePaginatedActions.errorArchived(null),
    );
    dispatch(
      listUniversalPaymentPackTemplatePaginatedActions.isLoadingArchived(true),
    );

    const currentState =
      getState().paymentPackReworked.universalPaymentPackTemplatePaginated
        .archivedPasses;

    const nextPage = params?.page ?? currentState.next_page ?? 1;

    try {
      const response = await fetchUniversalPaymentPackTemplatePaginatedListAPI({
        ...params,
        disabled: true,
        page: nextPage,
        page_size: FRANCHISE_PAYMENT_PACK_TEMPLATE_PAGINATION_SIZE,
      });
      dispatch(
        listUniversalPaymentPackTemplatePaginatedActions.successArchived(
          response.data,
        ),
      );

      options?.onSuccess?.(response.data);
    } catch (err) {
      console.error(err);
      dispatch(
        listUniversalPaymentPackTemplatePaginatedActions.errorArchived(
          err as Error,
        ),
      );
      options?.onError?.(err as Error);
    }
    dispatch(
      listUniversalPaymentPackTemplatePaginatedActions.isLoadingArchived(false),
    );
  };
}

/**
 * @deprecated This method does not force any pagination and shall not be used anymore.
 */
export function fetchUniversalPassTemplateListManagerOnly(
  options?: OptionCallback<PaymentPackTemplate[]>,
) {
  return async (dispatch: Dispatch) => {
    dispatch(listUniversalPaymentPackTemplateActions.error(null));
    dispatch(listUniversalPaymentPackTemplateActions.isLoading(true));
    try {
      const response = await fetchUniversalPaymentPackTemplateListAPI({
        available_for_sale: false,
      });
      dispatch(
        listUniversalPaymentPackTemplateActions.successManagerOnly(
          isPaginatedPaymentPackTemplate(response.data)
            ? response.data.results
            : response.data,
        ),
      );

      options?.onSuccess?.(
        isPaginatedPaymentPackTemplate(response.data)
          ? response.data.results
          : response.data,
      );
    } catch (err) {
      console.error(err);
      dispatch(listUniversalPaymentPackTemplateActions.error(err));
      options?.onError?.(err);
    }
    dispatch(listUniversalPaymentPackTemplateActions.isLoading(false));
  };
}

/**
 * @description This action fetches with pagination the UniversalPaymentPackTemplates of a master account being for manager only usage.
 * By forcing the available_for_sale parameter to false, only passes having either manager_only=true OR is_usable_by_staff=false
 * will be send back via the API
 * By forcing disabled parameter to false, we ensure that archived passes are not fetched.
 */
export function fetchUniversalPaymentPackTemplatePaginatedListManagerOnly(
  params?: FranchiseProductTemplatePaginatedQueryParams,
  options?: OptionCallback<PaginatedResponse<PaymentPackTemplateAPI>>,
): ThunkAction {
  return async (dispatch, getState) => {
    dispatch(
      listUniversalPaymentPackTemplatePaginatedActions.errorManagerOnly(null),
    );
    dispatch(
      listUniversalPaymentPackTemplatePaginatedActions.isLoadingManagerOnly(
        true,
      ),
    );
    const currentState =
      getState().paymentPackReworked.universalPaymentPackTemplatePaginated
        .managerOnlyPasses;

    const nextPage = params?.page ?? currentState.next_page ?? 1;

    try {
      const response = await fetchUniversalPaymentPackTemplatePaginatedListAPI({
        ...params,
        available_for_sale: false,
        disabled: false,
        page: nextPage,
        page_size: FRANCHISE_PAYMENT_PACK_TEMPLATE_PAGINATION_SIZE,
      });
      dispatch(
        listUniversalPaymentPackTemplatePaginatedActions.successManagerOnly(
          response.data,
        ),
      );

      options?.onSuccess?.(response.data);
    } catch (err) {
      console.error(err);
      dispatch(
        listUniversalPaymentPackTemplatePaginatedActions.errorManagerOnly(err),
      );
      options?.onError?.(err);
    }
    dispatch(
      listUniversalPaymentPackTemplatePaginatedActions.isLoadingManagerOnly(
        false,
      ),
    );
  };
}

export const createOrUpdatePaymentPackTemplateActions = {
  isLoading: createAction('PAYMENT_PACK_TEMPLATE/CREATE_OR_UPDATE/IS_LOADING'),
  error: createAction('PAYMENT_PACK_TEMPLATE/CREATE_OR_UPDATE/ERROR'),
  success: createAction('PAYMENT_PACK_TEMPLATE/CREATE_OR_UPDATE/SUCCESS'),
};

export function createOrUpdatePaymentPackTemplate(
  data: PaymentPackTemplateAPI,
  options?: OptionCallback<PaymentPackTemplateAPI>,
) {
  return async (dispatch: Dispatch) => {
    dispatch(createOrUpdatePaymentPackTemplateActions.error(null));
    dispatch(createOrUpdatePaymentPackTemplateActions.isLoading(true));
    try {
      const response = await createOrUpdatePaymentPackTemplateAPI(data);
      dispatch(createOrUpdatePaymentPackTemplateActions.success(response.data));

      if (options && options.onSuccess) {
        data?.id &&
          dispatch(snackbarSuccess('paymentPack.createOrUpdate.success'));
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

export const createOrUpdateUniversalPaymentPackTemplateActions = {
  isLoading: createAction(
    'UNIVERSAL_PAYMENT_PACK_TEMPLATE/CREATE_OR_UPDATE/IS_LOADING',
  ),
  error: createAction('UNIVERSAL_PAYMENT_PACK_TEMPLATE/CREATE_OR_UPDATE/ERROR'),
  success: createAction(
    'UNIVERSAL_PAYMENT_PACK_TEMPLATE/CREATE_OR_UPDATE/SUCCESS',
  ),
};

export function createOrUpdateUniversalPaymentPackTemplate(
  data: PaymentPackTemplateAPI,
  options?: OptionCallback<PaymentPackTemplateAPI>,
) {
  return async (dispatch: Dispatch) => {
    dispatch(createOrUpdateUniversalPaymentPackTemplateActions.error(null));
    dispatch(createOrUpdateUniversalPaymentPackTemplateActions.isLoading(true));
    try {
      const response = await createOrUpdateUniversalPaymentPackTemplateAPI(
        data,
      );
      dispatch(
        createOrUpdateUniversalPaymentPackTemplateActions.success(
          response.data,
        ),
      );

      if (options && options.onSuccess) {
        data?.id &&
          dispatch(snackbarSuccess('paymentPack.createOrUpdate.success'));
        options.onSuccess(response.data);
      }
    } catch (err) {
      console.error(err);
      dispatch(createOrUpdateUniversalPaymentPackTemplateActions.error(err));
      if (options && options.onError) options.onError(err);
    }
    dispatch(
      createOrUpdateUniversalPaymentPackTemplateActions.isLoading(false),
    );
  };
}
export const retrievePaymentPackTemplateActions = {
  isLoading: createAction('PAYMENT_PACK_TEMPLATE/RETRIEVE/IS_LOADING'),
  error: createAction('PAYMENT_PACK_TEMPLATE/RETRIEVE/ERROR'),
  success: createAction('PAYMENT_PACK_TEMPLATE/RETRIEVE/SUCCESS'),
};

export function retrievePaymentPackTemplate(
  id: number,
  options?: OptionCallback<PaymentPackTemplate>,
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

export const retrieveUniversalPaymentPackTemplateActions = {
  isLoading: createAction(
    'UNIVERSAL_PAYMENT_PACK_TEMPLATE/RETRIEVE/IS_LOADING',
  ),
  error: createAction('UNIVERSAL_PAYMENT_PACK_TEMPLATE/RETRIEVE/ERROR'),
  success: createAction('UNIVERSAL_PAYMENT_PACK_TEMPLATE/RETRIEVE/SUCCESS'),
};

export function retrieveUniversalPaymentPackTemplate(
  id: number,
  options?: OptionCallback<PaymentPackTemplate>,
) {
  return async (dispatch: Dispatch) => {
    dispatch(retrieveUniversalPaymentPackTemplateActions.error(null));
    dispatch(retrieveUniversalPaymentPackTemplateActions.isLoading(true));
    try {
      const response = await retrieveUniversalPaymentPackTemplateAPI(id);
      dispatch(
        retrieveUniversalPaymentPackTemplateActions.success(response.data),
      );

      if (options && options.onSuccess) {
        options.onSuccess(response.data);
      }
    } catch (err) {
      console.error(err);
      dispatch(retrieveUniversalPaymentPackTemplateActions.error(err));
      if (options && options.onError) options.onError(err);
    }
    dispatch(retrieveUniversalPaymentPackTemplateActions.isLoading(false));
  };
}

export const deletePaymentPackTemplateActions = {
  isLoading: createAction('PAYMENT_PACK_TEMPLATE/DELETE/IS_LOADING'),
  error: createAction('PAYMENT_PACK_TEMPLATE/DELETE/ERROR'),
  success: createAction('PAYMENT_PACK_TEMPLATE/DELETE/SUCCESS'),
};

export function deletePaymentPackTemplate(
  id: number,
  options: OptionBackgroundCallback,
) {
  return async (dispatch: Dispatch) => {
    dispatch(deletePaymentPackTemplateActions.error(null));
    dispatch(deletePaymentPackTemplateActions.isLoading(true));
    try {
      const response = await deletePaymentPackTemplateAPI(id);
      const backgroundTaskUuid = response.headers['x-background-task-uuid'];
      dispatch(
        monitorBackgroundTask(backgroundTaskUuid, {
          onSuccess: () => {
            options?.onBackgroundSuccess?.();
            dispatch(deletePaymentPackTemplateActions.success(id));
            dispatch(
              snackbarSuccess(
                `paymentPack.paymentPackTemplateArchived.success`,
              ),
            );
          },
          onError: options?.onBackgroundError,
        }),
      );
      if (options && options.onSuccess) {
        options.onSuccess(response.data);
      }
    } catch (err) {
      console.error(err);
      dispatch(snackbarError(`paymentPack.paymentPackTemplateArchived.error`));
      dispatch(deletePaymentPackTemplateActions.error(err));
      if (options && options.onError) options.onError(err);
    }
    dispatch(deletePaymentPackTemplateActions.isLoading(false));
  };
}

export const restorePaymentPackTemplateActions = {
  isLoading: createAction<boolean>('PAYMENT_PACK_TEMPLATE/RESTORE/IS_LOADING'),
  error: createAction<Error | null>('PAYMENT_PACK_TEMPLATE/RESTORE/ERROR'),
  success: createAction<number>('PAYMENT_PACK_TEMPLATE/RESTORE/SUCCESS'),
};

export function restorePaymentPackTemplate(
  id: number,
  options?: OptionBackgroundCallback,
) {
  return async (dispatch: Dispatch) => {
    dispatch(restorePaymentPackTemplateActions.error(null));
    dispatch(restorePaymentPackTemplateActions.isLoading(true));
    try {
      const response = await restorePaymentPackTemplateAPI(id);
      const backgroundTaskUuid = response.headers['x-background-task-uuid'];
      dispatch(
        monitorBackgroundTask(backgroundTaskUuid, {
          onSuccess: () => {
            options?.onBackgroundSuccess?.();
            dispatch(restorePaymentPackTemplateActions.success(id));
            dispatch(
              snackbarSuccess(
                `paymentPack.paymentPackTemplateRestored.success`,
              ),
            );
          },
          onError: options?.onBackgroundError,
        }),
      );
      if (options && options.onSuccess) {
        options.onSuccess();
      }
    } catch (err) {
      console.error(err);
      dispatch(snackbarError(`paymentPack.paymentPackTemplateRestored.error`));
      dispatch(restorePaymentPackTemplateActions.error(err as Error));
      options?.onError?.(err as Error);
    }
    dispatch(restorePaymentPackTemplateActions.isLoading(false));
  };
}

export const deleteUniversalPaymentPackTemplateActions = {
  isLoading: createAction('UNIVERSAL_PAYMENT_PACK_TEMPLATE/DELETE/IS_LOADING'),
  error: createAction('UNIVERSAL_PAYMENT_PACK_TEMPLATE/DELETE/ERROR'),
  success: createAction('UNIVERSAL_PAYMENT_PACK_TEMPLATE/DELETE/SUCCESS'),
};

export function deleteUniversalPaymentPackTemplate(
  id: number,
  options?: OptionCallback,
) {
  return async (dispatch: Dispatch) => {
    dispatch(deleteUniversalPaymentPackTemplateActions.error(null));
    dispatch(deleteUniversalPaymentPackTemplateActions.isLoading(true));
    try {
      const response = await deleteUniversalPaymentPackTemplateAPI(id);
      dispatch(deleteUniversalPaymentPackTemplateActions.success(id));

      if (options && options.onSuccess) {
        options.onSuccess(response.data);
        dispatch(
          snackbarSuccess(
            `paymentPack.universalPaymentPackTemplateArchived.success`,
          ),
        );
      }
    } catch (err) {
      console.error(err);
      dispatch(
        snackbarError(`paymentPack.universalPaymentPackTemplateArchived.error`),
      );
      dispatch(deleteUniversalPaymentPackTemplateActions.error(err));
      if (options && options.onError) options.onError(err);
    }
    dispatch(deleteUniversalPaymentPackTemplateActions.isLoading(false));
  };
}

export const restoreUniversalPaymentPackTemplateActions = {
  isLoading: createAction<boolean>(
    'UNIVERSAL_PAYMENT_PACK_TEMPLATE/RESTORE/IS_LOADING',
  ),
  error: createAction<Error | null>(
    'UNIVERSAL_PAYMENT_PACK_TEMPLATE/RESTORE/ERROR',
  ),
  success: createAction<PaymentPackTemplateAPI>(
    'UNIVERSAL_PAYMENT_PACK_TEMPLATE/RESTORE/SUCCESS',
  ),
};

export function restoreUniversalPaymentPackTemplate(
  id: number,
  options?: OptionCallback<PaymentPackTemplateAPI>,
) {
  return async (dispatch: Dispatch) => {
    dispatch(restoreUniversalPaymentPackTemplateActions.error(null));
    dispatch(restoreUniversalPaymentPackTemplateActions.isLoading(true));
    try {
      const response = await restoreUniversalPaymentPackTemplateAPI(id);
      dispatch(
        restoreUniversalPaymentPackTemplateActions.success(response.data),
      );

      if (options && options.onSuccess) {
        options.onSuccess(response.data);
        dispatch(
          snackbarSuccess(
            `paymentPack.universalPaymentPackTemplateRestored.success`,
          ),
        );
      }
    } catch (err) {
      console.error(err);
      dispatch(
        snackbarError(`paymentPack.universalPaymentPackTemplateRestored.error`),
      );
      dispatch(restoreUniversalPaymentPackTemplateActions.error(err as Error));
      options?.onError?.(err as Error);
    }
    dispatch(restoreUniversalPaymentPackTemplateActions.isLoading(false));
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

export const isPaymentPackUsedInComboActions = {
  isLoading: createAction('PAYMENT_PACK/COMBO_USE/IS_LOADING'),
  error: createAction('PAYMENT_PACK/COMBO_USE/ERROR'),
  success: createAction('PAYMENT_PACK/COMBO_USE/SUCCESS'),
};

export function isPaymentPackUsedInCombo(id: number, options?: OptionCallback) {
  return async (dispatch: Dispatch) => {
    dispatch(isPaymentPackUsedInComboActions.error(null));
    dispatch(isPaymentPackUsedInComboActions.isLoading(true));
    try {
      const response = await isPaymentPackUsedInComboAPI(id);
      dispatch(isPaymentPackUsedInComboActions.success(response.data));

      if (options && options.onSuccess) {
        options.onSuccess(response.data);
      }
    } catch (err) {
      console.error(err);
      dispatch(isPaymentPackUsedInComboActions.error(err));
      if (options && options.onError) options.onError(err);
    }
    dispatch(isPaymentPackUsedInComboActions.isLoading(false));
  };
}

export const fetchPaymentPackMassExtensionListActions = {
  isLoading: createAction<boolean>('PAYMENT_PACK/MASS_EXTENSION/LOADING'),
  error: createAction<Error | null>('PAYMENT_PACK/MASS_EXTENSION/ERROR'),
  success: createAction<PaginatedResponse<PaymentPackMassExtension>>(
    'PAYMENT_PACK/MASS_EXTENSION/SUCCESS',
  ),
};

/**
 * Fetch the list of mass extensions for a specific payment pack
 * @param params Object containing the required `payment_pack` ID + optional pagination params
 */
export function fetchPaymentPackMassExtensionList(
  params: PaymentPackMassExtensionParams,
  options?: OptionCallback<PaginatedResponse<PaymentPackMassExtension>>,
) {
  return async (dispatch: Dispatch, getState: () => RootState) => {
    dispatch(fetchPaymentPackMassExtensionListActions.isLoading(true));
    dispatch(fetchPaymentPackMassExtensionListActions.error(null));

    const page = getState().paymentPack.massExtension.page ?? 1;
    try {
      const response = await fetchPaymentPackMassExtensionListAPI({
        ...params,
        page: params.page ?? page,
        page_size: PAYMENT_PACK_MASS_EXTENSION_PAGE_SIZE,
      });

      dispatch(fetchPaymentPackMassExtensionListActions.success(response.data));
      options?.onSuccess?.(response.data);
    } catch (error) {
      console.error(error);
      dispatch(fetchPaymentPackMassExtensionListActions.error(error));
      options?.onError?.();
    } finally {
      dispatch(fetchPaymentPackMassExtensionListActions.isLoading(false));
    }
  };
}

export const createPaymentPackMassExtensionActions = {
  isLoading: createAction<boolean>(
    'PAYMENT_PACK/MASS_EXTENSION/CREATE/LOADING',
  ),
  error: createAction<Error | null>('PAYMENT_PACK/MASS_EXTENSION/CREATE/ERROR'),
};

/**
 * Create an extension for a payment pack
 * @param data The payload sent for the creation of the extension
 */
export function createPaymentPackMassExtension(
  data: PaymentPackMassExtensionCreate,
  options?: OptionCallback<PaymentPackMassExtension>,
) {
  return async (dispatch: Dispatch) => {
    dispatch(createPaymentPackMassExtensionActions.isLoading(true));
    dispatch(createPaymentPackMassExtensionActions.error(null));
    try {
      const response = await createPaymentPackMassExtensionAPI(data);

      options?.onSuccess?.(response.data);
      const backgroundTaskUuid = response.headers['x-background-task-uuid'];
      dispatch(
        monitorBackgroundTask(backgroundTaskUuid, {
          // @ts-expect-error
          onSuccess: options?.onSuccess,
        }),
      );
    } catch (error) {
      console.error(error);
      dispatch(createPaymentPackMassExtensionActions.error(error));
      options?.onError?.();
    } finally {
      dispatch(createPaymentPackMassExtensionActions.isLoading(false));
    }
  };
}

export const deletePaymentPackMassExtensionActions = {
  isLoading: createAction<boolean>(
    'PAYMENT_PACK/MASS_EXTENSION/DELETE/LOADING',
  ),
  error: createAction<Error | null>('PAYMENT_PACK/MASS_EXTENSION/DELETE/ERROR'),
};

/**
 * Delete a payment pack extension
 * @param id The ID of the extension to delete
 */
export function deletePaymentPackMassExtension(
  id: number,
  options?: OptionCallback<number>,
) {
  return async (dispatch: Dispatch) => {
    dispatch(deletePaymentPackMassExtensionActions.isLoading(true));
    dispatch(deletePaymentPackMassExtensionActions.error(null));
    try {
      const response = await deletePaymentPackMassExtensionAPI(id);

      options?.onSuccess?.(id);
      const backgroundTaskUuid = response.headers['x-background-task-uuid'];
      dispatch(
        monitorBackgroundTask(backgroundTaskUuid, {
          // @ts-expect-error
          onSuccess: options?.onSuccess,
        }),
      );
    } catch (error) {
      console.error(error);
      dispatch(deletePaymentPackMassExtensionActions.error(error));
      options?.onError?.();
    } finally {
      dispatch(deletePaymentPackMassExtensionActions.isLoading(false));
    }
  };
}
