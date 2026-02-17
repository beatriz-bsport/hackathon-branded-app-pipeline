import * as Sentry from '@sentry/react';
import { createAction } from 'redux-actions';
import uniq from 'lodash/uniq';
import { snackbarSuccess, snackbarError } from '../snackbar/actions';
import type {
  Dispatch,
  ThunkAction,
  OptionCallback,
  PaginatedResponse,
} from '../../state/types';

import { getFreshPureMetaActivityList } from './selectors';

import {
  fetchMetaActivityDetails as fetchMetaActivityDetailsAPI,
  updateMetaActivity as updateMetaActivityAPI,
  addMetaActivity as addMetaActivityAPI,
  fetchAllActivities as fetchAllActivitiesAPI,
  fetchAllActivities as fetchMetaActivityListAPI,
  deleteMetaActivity as deleteMetaActivityAPI,
  fetchMetaActivityFavorite as fetchMetaActivityFavoriteAPI,
  makeActivityCopy as makeActivityCopyAPI,
  restoreMetaActivity as restoreMetaActivityAPI,
  editOrderMetaActivity as editOrderMetaActivityAPI,
  fetchAllMetaActivityCategory as fetchAllMetaActivityCategoryAPI,
  updateMetaActivityCategory as updateMetaActivityCategoryAPI,
  deleteMetaActivityCategory as deleteMetaActivityCategoryAPI,
  editCategoryOrder as editCategoryOrderAPI,
  createMetaActivityCategory as createMetaActivityCategoryAPI,
  fetchIsMetaActivityPublishedOnUSC as fetchIsMetaActivityPublishedOnUSCAPI,
} from './api/common';

import { fetchMetaActivities as fetchMetaActivitiesAPI } from './api/workshop-activity';
import { areAllInCache } from '../../utils/reduxHelper';

import {
  MetaActivity,
  MetaActivityCategory,
  MetaActivityCategoryWithActivities,
  MetaActivityFilter,
} from './types';

import { PAGINATION_SIZE } from './constants';

export const metaActivityBulkActions = {
  isLoading: createAction('META_ACTIVITIES/BULK/IS_LOADING'),
  error: createAction('META_ACTIVITIES/BULK/ERROR'),
  success: createAction('META_ACTIVITIES/BULK/SUCCESS'),
};

export function fetchMetaActivityBulk(
  ids: Array<number>,
  options?: OptionCallback<MetaActivity[]>,
  useCacheMilliseconds?: number,
): ThunkAction {
  return async (dispatch: Dispatch, getState) => {
    const freshIdList = getFreshPureMetaActivityList(getState());

    const ids_uniq = uniq(ids)
      .filter((id) => !!id)
      .filter((id) => !freshIdList.includes(id));
    if (ids_uniq.length === 0) {
      return;
    }

    if (useCacheMilliseconds) {
      const cachedIds = getState().metaActivity.cachedIds;
      if (areAllInCache(ids_uniq, cachedIds, useCacheMilliseconds)) return;
    }

    dispatch(metaActivityBulkActions.isLoading(true));
    dispatch(metaActivityBulkActions.error(null));

    try {
      const response = await fetchMetaActivityListAPI({
        id__in: ids_uniq,
        page_size: null,
      });
      dispatch(metaActivityBulkActions.success(response.data));
      if (options && options.onSuccess) options.onSuccess();
    } catch (err) {
      dispatch(metaActivityBulkActions.error(err));
      Sentry.captureException(err);
      if (options && options.onError) options.onError();
    }
    dispatch(metaActivityBulkActions.isLoading(false));
  };
}

/*
 * We have to declare this other action for the widget, the onsuccess method needs to use response.data as params
 * to make things work on the call handler.
 */
export function fetchMetaActivityBulkWidget(
  ids: Array<number>,
  options?: OptionCallback<MetaActivity[]>,
): ThunkAction {
  return async (dispatch: Dispatch, getState) => {
    const freshIdList = getFreshPureMetaActivityList(getState());

    const ids_uniq = uniq(ids)
      .filter((id) => !!id)
      .filter((id) => !freshIdList.includes(id));
    if (ids_uniq.length === 0) {
      return;
    }

    try {
      const response = await fetchMetaActivityListAPI({
        id__in: ids_uniq,
        page_size: null,
      });
      // @ts-expect-error
      if (options && options.onSuccess) options.onSuccess(response.data);
    } catch (err) {
      Sentry.captureException(err);
      console.error(err);
      if (options && options.onError) options.onError(err);
    }
  };
}

export function fetchMetaActivityBulkAfterCategoryDelete(
  ids: Array<number>,
  options?: OptionCallback,
): ThunkAction {
  return async (dispatch: Dispatch) => {
    if (ids.filter((id) => !!id).length === 0) {
      return;
    }
    dispatch(metaActivityBulkActions.isLoading(true));
    dispatch(metaActivityBulkActions.error(null));

    try {
      const response = await fetchMetaActivityListAPI({
        id__in: ids,
        page_size: null,
      });
      dispatch(metaActivityBulkActions.success(response.data));
      if (options && options.onSuccess) options.onSuccess();
    } catch (err) {
      dispatch(metaActivityBulkActions.error(err));
      Sentry.captureException(err);
      if (options && options.onError) options.onError();
    }
    dispatch(metaActivityBulkActions.isLoading(false));
  };
}

export const favoriteActions = {
  isLoading: createAction('META_ACTIVITIES/FAVORITE/IS_LOADING'),
  error: createAction('META_ACTIVITIES/FAVORITE/ERROR'),
  success: createAction('META_ACTIVITIES/FAVORITE/SUCCESS'),
};

export function fetchMetaActivityFavorite(
  company: number,
  options?: OptionCallback<MetaActivity>,
): ThunkAction {
  return async (dispatch: Dispatch) => {
    dispatch(favoriteActions.isLoading(true));
    dispatch(favoriteActions.error(null));

    try {
      const response = await fetchMetaActivityFavoriteAPI(company);
      dispatch(favoriteActions.success(response.data));
      // @ts-expect-error
      if (options && options.onSuccess) options.onSuccess(response.data);
    } catch (err) {
      if (err.response && err.response.status === 404) {
        dispatch(favoriteActions.success(null));
      } else {
        dispatch(favoriteActions.error(err));
        if (options && options.onError) options.onError();
      }
    }
    dispatch(favoriteActions.isLoading(false));
  };
}

export const metaActivityDetailActions = {
  isLoading: createAction('META_ACTIVITIES/DETAIL/IS_LOADING'),
  error: createAction('META_ACTIVITIES/DETAIL/ERROR'),
  success: createAction('META_ACTIVITIES/DETAIL/SUCCESS'),
};
export const deleteAction = {
  isLoading: createAction('META_ACTIVITIES/DELETE/IS_LOADING'),
  error: createAction('META_ACTIVITIES/DELETE/ERROR'),
  success: createAction('META_ACTIVITIES/DELETE/SUCCESS'),
};

export function deleteMetaActivity(
  id: number,
  options: OptionCallback,
): ThunkAction {
  return async (dispatch: Dispatch) => {
    dispatch(deleteAction.isLoading(true));
    dispatch(deleteAction.error(null));

    try {
      const response = await deleteMetaActivityAPI(id);
      const payload = { [response.data.id]: response.data };
      dispatch(snackbarSuccess('metaActivity.del.success'));
      dispatch(deleteAction.success(id));
      // Update the dict
      dispatch(metaActivityDetailActions.success(payload));
      if (!response.data.customer_enabled) {
        // we can safely add it to the disabled list
        dispatch(disabledMetaActivitiesActions.add(id));
      }
      if (options && options.onSuccess) options.onSuccess();
    } catch (err) {
      dispatch(deleteAction.error(err));
      dispatch(snackbarError('metaActivity.del.error'));
      Sentry.captureException(err);
      if (options && options.onError) options.onError();
    }
    dispatch(deleteAction.isLoading(false));
  };
}

export function fetchMetaActivityDetails(id: number): ThunkAction {
  return async (dispatch: Dispatch) => {
    dispatch(metaActivityDetailActions.isLoading(true));
    dispatch(metaActivityDetailActions.error(null));

    try {
      const response = await fetchMetaActivityDetailsAPI(id);
      const metaActivityDictObject = { [response.data.id]: response.data };
      dispatch(metaActivityDetailActions.success(metaActivityDictObject));
    } catch (err) {
      dispatch(metaActivityDetailActions.error(err));
      Sentry.captureException(err);
    }
    dispatch(metaActivityDetailActions.isLoading(false));
  };
}

export const copyActions = {
  isLoading: createAction('META_ACTIVITIES/COPY/IS_LOADING'),
  error: createAction('META_ACTIVITIES/COPY/ERROR'),
  success: createAction('META_ACTIVITIES/COPY/SUCCESS'),
};

export function makeActivityCopy(
  id: number,
  suffix: string,
  options: OptionCallback,
): ThunkAction {
  return async (dispatch: Dispatch) => {
    dispatch(copyActions.isLoading(true));
    dispatch(copyActions.error(null));

    try {
      const response = await makeActivityCopyAPI(id, suffix);
      dispatch(copyActions.success(response.data));
      if (options && options.onSuccess) {
        // @ts-expect-error
        options.onSuccess(response.data);
      }
    } catch (err) {
      console.error(err);
      dispatch(copyActions.error(err));
      Sentry.captureException(err);
      if (options && options.onError) {
        options.onError(err);
      }
    }
    dispatch(copyActions.isLoading(false));
  };
}

export const metaActivityListActions = {
  isLoading: createAction('META_ACTIVITIES/LIST/IS_LOADING'),
  error: createAction('META_ACTIVITIES/LIST/ERROR'),
  success: createAction('META_ACTIVITIES/LIST/SUCCESS'),
};

export function fetchActivitiesCompany(
  company: number,
  params?: any,
  options?: OptionCallback,
): ThunkAction {
  return async (dispatch: Dispatch) => {
    if (!company) return;
    dispatch(metaActivityListActions.isLoading(true));
    dispatch(metaActivityListActions.error(null));

    try {
      const response = await fetchAllActivitiesAPI({
        page_size: null,
        company,
        ...(params ?? {}),
      });
      dispatch(metaActivityListActions.success(response.data));
      if (options && options.onSuccess) {
        // @ts-expect-error
        options.onSuccess(response.data);
      }
    } catch (err) {
      if (options && options.onError) {
        options.onError(err);
      }
      console.error(err);
      dispatch(metaActivityListActions.error(err));
      Sentry.captureException(err);
    }
    dispatch(metaActivityListActions.isLoading(false));
  };
}

export function fetchCompanyActivities(id: number): ThunkAction {
  return async (dispatch: Dispatch) => {
    dispatch(metaActivityListActions.isLoading(true));
    dispatch(metaActivityListActions.error(null));

    try {
      const response = await fetchAllActivitiesAPI({
        page_size: null,
        company: id,
      });
      dispatch(metaActivityListActions.success(response.data));
    } catch (err) {
      console.error(err);
      dispatch(metaActivityListActions.error(err));
      Sentry.captureException(err);
    }
    dispatch(metaActivityListActions.isLoading(false));
  };
}

export const upsertActions = {
  isLoading: createAction('META_ACTIVITY/UPSERT/IS_LOADING'),
  error: createAction('META_ACTIVITY/UPSERT/ERROR'),
  success: createAction('META_ACTIVITY/UPSERT/SUCCESS'),
};

export function upsert(
  metaActivityData: any,
  options?: OptionCallback,
): ThunkAction {
  return async (dispatch: Dispatch) => {
    dispatch(upsertActions.isLoading(true));
    dispatch(upsertActions.error(null));
    const key = metaActivityData.has('id') ? 'update' : 'create';
    const createOrUpdate = metaActivityData.has('id')
      ? updateMetaActivityAPI
      : addMetaActivityAPI;

    try {
      const response = await createOrUpdate(metaActivityData);
      dispatch(upsertActions.success(response.data));
      dispatch(snackbarSuccess(`activity.${key}.success`));
      if (options && options.onSuccess) options.onSuccess();
    } catch (error) {
      console.error(error);
      dispatch(snackbarError(`activity.${key}error`));
      dispatch(upsertActions.error(error));
      if (options && options.onError) options.onError(error);
    }
    dispatch(upsertActions.isLoading(false));
  };
}

export const listingActions = {
  isLoading: createAction('WORKSHOP/LIST/IS_LOADING'),
  error: createAction('WORKSHOP/LIST/ERROR'),
  success: createAction('WORKSHOP/LIST/SUCCESS'),
};

export function deleteWorkshop(
  id: number,
  options: OptionCallback<MetaActivity[]>,
): ThunkAction {
  return async (dispatch: Dispatch) => {
    dispatch(deleteAction.isLoading(true));
    dispatch(deleteAction.error(null));

    try {
      await deleteMetaActivityAPI(id);
      dispatch(deleteAction.success(id));
      dispatch(snackbarSuccess('metaActivity.del.success'));
      dispatch(fetchMetaActivities());
      if (options && options.onSuccess) options.onSuccess();
    } catch (err) {
      dispatch(deleteAction.error(err));
      dispatch(snackbarError('metaActivity.del.error'));
      Sentry.captureException(err);
      if (options && options.onError) options.onError();
    }
    dispatch(deleteAction.isLoading(false));
  };
}

export function fetchMetaActivities(
  params?: MetaActivityFilter,
  options?: OptionCallback<MetaActivity[]>,
) {
  return async (dispatch: Dispatch) => {
    dispatch(listingActions.isLoading(true));
    dispatch(listingActions.error(null));
    try {
      // @ts-expect-error
      const response = await fetchMetaActivitiesAPI(params ?? {});
      dispatch(listingActions.success(response.data));
      // @ts-expect-error
      if (options && options.onSuccess) options.onSuccess(response.data);
    } catch (error) {
      console.error(error);
      dispatch(listingActions.error(error));
      if (options && options.onError) options.onError(error);
    }
    dispatch(listingActions.isLoading(false));
  };
}

export const workshopListingActions = {
  isLoading: createAction('META_ACTIVITY/WORKSHOP/LIST/IS_LOADING'),
  error: createAction('META_ACTIVITY/WORKSHOP/LIST/ERROR'),
  success: createAction('META_ACTIVITY/WORKSHOP/LIST/SUCCESS'),
};

export function fetchWorkshopList(
  params?: MetaActivityFilter,
  options?: OptionCallback<MetaActivity[]>,
) {
  return async (dispatch: Dispatch) => {
    dispatch(workshopListingActions.isLoading(true));
    dispatch(workshopListingActions.error(null));
    try {
      const response = await fetchMetaActivitiesAPI({
        ...params,
        // @ts-expect-error
        is_workshop: true,
      });
      dispatch(workshopListingActions.success(response.data));
      // @ts-expect-error
      if (options && options.onSuccess) options.onSuccess(response.data);
    } catch (error) {
      console.error(error);
      dispatch(workshopListingActions.error(error));
      if (options && options.onError) options.onError(error);
    }
    dispatch(workshopListingActions.isLoading(false));
  };
}

export const metaActivityRestoreActions = {
  isLoading: createAction('META_ACTIVITIES/BULK/IS_LOADING'),
};

export function restoreMetaActivity(id: number, options: OptionCallback) {
  return async (dispatch: Dispatch) => {
    dispatch(metaActivityRestoreActions.isLoading(true));
    try {
      const response = await restoreMetaActivityAPI(id);
      // @ts-expect-error
      const payload = { [response.data.id]: response.data };
      dispatch(metaActivityDetailActions.success(payload));
      // @ts-expect-error
      if (response.data.customer_enabled) {
        // we can safely remove it from the disabled list
        dispatch(disabledMetaActivitiesActions.remove(id));
      }
      dispatch(snackbarSuccess('metaActivity.restore.success'));
      // @ts-expect-error
      if (options && options.onSuccess) options.onSuccess(response.data);
    } catch (err) {
      console.error(err);
      dispatch(metaActivityDetailActions.error(err));
      dispatch(snackbarSuccess('metaActivity.restore.error'));
      if (options && options.onError) options.onError(err);
    }
    dispatch(metaActivityRestoreActions.isLoading(false));
  };
}

export const metaActivityUpdateOrderActions = {
  error: createAction('META_ACTIVITIES/UPDATE_ORDER/ERROR'),
  loading: createAction('META_ACTIVITIES/UPDATE_ORDER/IS_LOADING'),
  success: createAction('META_ACTIVITIES/UPDATE_ORDER/SUCCESS'),
};

export function editOrderMetaActivity(
  data: Array<{ id: number; ordering_in_category: number }>,
  options?: OptionCallback,
) {
  return async (dispatch: Dispatch) => {
    dispatch(metaActivityUpdateOrderActions.loading(true));
    dispatch(metaActivityUpdateOrderActions.error(null));
    try {
      const response = await editOrderMetaActivityAPI(data);
      dispatch(metaActivityUpdateOrderActions.success(response.data));
      // @ts-expect-error
      if (options && options.onSuccess) options.onSuccess(response.data);
    } catch (err) {
      console.error(err);
      dispatch(metaActivityUpdateOrderActions.error(err));
      if (options && options.onError) options.onError(err);
    }
    dispatch(metaActivityUpdateOrderActions.loading(false));
  };
}

export const listAllMetaActivityCategoryActions = {
  loading: createAction('META_ACTIVITIES_CATEGORY/LIST/IS_LOADING'),
  error: createAction('META_ACTIVITIES_CATEGORY/LIST/ERROR'),
  success: createAction('META_ACTIVITIES_CATEGORY/LIST/SUCCESS'),
};

export function fetchAllMetaActivityCategory(companyId?: number) {
  return async (dispatch: Dispatch) => {
    dispatch(listAllMetaActivityCategoryActions.loading(true));
    dispatch(listAllMetaActivityCategoryActions.error(null));
    try {
      const response = await fetchAllMetaActivityCategoryAPI({ companyId });
      const MetaActivities = response.data;
      dispatch(listAllMetaActivityCategoryActions.success(MetaActivities));
    } catch (err) {
      console.error(err);
      dispatch(listAllMetaActivityCategoryActions.error(err));
    }
    dispatch(listAllMetaActivityCategoryActions.loading(false));
  };
}

export const updateMetaActivityCategoryOrderActions = {
  loading: createAction('META_ACTIVITIES_CATEGORY/UPDATE_ORDER/IS_LOADING'),
  error: createAction('META_ACTIVITIES_CATEGORY/UPDATE_ORDER/ERROR'),
  success: createAction('META_ACTIVITIES_CATEGORY/UPDATE_ORDER/SUCCESS'),
};

export function updateMetaActivityCategoryOrder(
  data: Array<{ id: number; category_ordering: number }>,
  options?: OptionCallback,
) {
  return async (dispatch: Dispatch) => {
    dispatch(updateMetaActivityCategoryOrderActions.loading(true));
    dispatch(updateMetaActivityCategoryOrderActions.error(null));
    try {
      const response = await editCategoryOrderAPI(data);
      dispatch(updateMetaActivityCategoryOrderActions.success(response.data));
      if (options && options.onSuccess) options.onSuccess(response.data);
    } catch (error) {
      dispatch(snackbarError(`paymentPack.category.update.error`));
      dispatch(
        updateMetaActivityCategoryOrderActions.error(error.response.data),
      );
      if (options && options.onError) options.onError();
    }
    dispatch(updateMetaActivityCategoryOrderActions.loading(false));
  };
}

export const upsertMetaActivityCategoryActions = {
  loading: createAction('META_ACTIVITIES_CATEGORY/UPSERT/IS_LOADING'),
  error: createAction('META_ACTIVITIES_CATEGORY/UPSERT/ERROR'),
  success: createAction('META_ACTIVITIES_CATEGORY/UPSERT/SUCCESS'),
};

export function upsertMetaActivityCategory(
  category: MetaActivityCategory,
  options?: OptionCallback,
) {
  return async (dispatch: Dispatch) => {
    dispatch(upsertMetaActivityCategoryActions.loading(true));
    dispatch(upsertMetaActivityCategoryActions.error(null));
    const kind = category.id ? 'update' : 'create';
    try {
      const response = category.id
        ? await updateMetaActivityCategoryAPI(category)
        : await createMetaActivityCategoryAPI(category);
      dispatch(upsertMetaActivityCategoryActions.success(response.data));
      dispatch(snackbarSuccess(`paymentPack.category.${kind}.success`));
      if (options && options.onSuccess) options.onSuccess(response.data);
    } catch (error) {
      dispatch(snackbarError(`paymentPack.category.${kind}.error`));
      dispatch(upsertMetaActivityCategoryActions.error(error.response.data));
      if (options && options.onError) options.onError();
    }
    dispatch(upsertMetaActivityCategoryActions.loading(false));
  };
}

export const deleteMetaActivityCategoryActions = {
  error: createAction('META_ACTIVITIES_CATEGORY/DELETE/ERROR'),
  loading: createAction('META_ACTIVITIES_CATEGORY/DELETE/IS_LOADING'),
  success: createAction('META_ACTIVITIES_CATEGORY/DELETE/SUCCESS'),
};

export function deleteMetaActivityCategory(
  category: MetaActivityCategoryWithActivities,
  options?: OptionCallback<MetaActivityCategoryWithActivities>,
) {
  return async (dispatch: Dispatch) => {
    dispatch(deleteMetaActivityCategoryActions.loading(true));
    try {
      await deleteMetaActivityCategoryAPI(category);
      dispatch(deleteMetaActivityCategoryActions.success(category));
      dispatch(snackbarSuccess('paymentPack.category.delete.success'));
      if (options && options.onSuccess) options.onSuccess(category);
    } catch (_error) {
      dispatch(deleteMetaActivityCategoryActions.error(category));
      dispatch(snackbarError('paymentPack.category.delete.error'));
      if (options && options.onError) options.onError();
    }
    dispatch(deleteMetaActivityCategoryActions.loading(false));
  };
}

export const disabledMetaActivitiesActions = {
  error: createAction<Error>('DISABLED_META_ACTIVITY/PAGINATED_LIST/ERROR'),
  isLoading: createAction<boolean>(
    'DISABLED_META_ACTIVITY/PAGINATED_LIST/IS_LOADING',
  ),
  success: createAction<PaginatedResponse<MetaActivity>>(
    'DISABLED_META_ACTIVITY/PAGINATED_LIST/SUCCESS',
  ),
  add: createAction<number>('DISABLED_META_ACTIVITY/UPDATE_LIST/ADD'),
  remove: createAction<number>('DISABLED_META_ACTIVITY/UPDATE_LIST/REMOVE'),
};

export function fetchDisabledMetaActivityPaginatedList(
  companyId: number,
  queryParams: {
    page?: number;
    pageSize?: number;
    isWorkshop?: boolean;
  },
  options?: OptionCallback<PaginatedResponse<MetaActivity>>,
): ThunkAction {
  return async (dispatch: Dispatch) => {
    if (!companyId) return;
    dispatch(disabledMetaActivitiesActions.isLoading(true));
    dispatch(disabledMetaActivitiesActions.error(null));

    try {
      const { page, pageSize, isWorkshop } = queryParams;
      const response = await fetchAllActivitiesAPI({
        page_size: pageSize || PAGINATION_SIZE,
        companyId,
        page: page || 1,
        customer_enabled: false,
        ...(isWorkshop !== undefined ? { is_workshop: isWorkshop } : {}),
      });
      dispatch(disabledMetaActivitiesActions.success(response.data));
      if (options && options.onSuccess) {
        options.onSuccess(response.data);
      }
    } catch (err) {
      if (options && options.onError) {
        options.onError(err);
      }
      console.error(err);
      dispatch(disabledMetaActivitiesActions.error(err));
    }
    dispatch(disabledMetaActivitiesActions.isLoading(false));
  };
}

export const fetchIsMetaActivityPublishedOnUSCActions = {
  success: createAction<{ id: number; isPublished: boolean }>(
    'META_ACTIVITY/IS_PUBLISHED_ON_USC/SUCCESS',
  ),
};

export function fetchIsMetaActivityPublishedOnUSC(
  metaActivityId: number,
  options?: OptionCallback<boolean>,
): ThunkAction {
  return async (dispatch: Dispatch) => {
    try {
      const response = await fetchIsMetaActivityPublishedOnUSCAPI(
        metaActivityId,
      );
      dispatch(
        fetchIsMetaActivityPublishedOnUSCActions.success({
          id: metaActivityId,
          isPublished: response.data,
        }),
      );
      options?.onSuccess?.(response.data);
    } catch (err) {
      if (options && options.onError) {
        options.onError(err);
      }
      console.error(err);
    }
  };
}
