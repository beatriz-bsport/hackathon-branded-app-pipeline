import * as Sentry from '@sentry/react';
import { createAction } from 'redux-actions';
import uniq from 'lodash/uniq';
import { snackbarSuccess, snackbarError } from '../snackbar/actions';
import type { Dispatch, ThunkAction, OptionCallback } from '../../state/types';

import { getFreshMetaActivityList } from './selectors';

import { postAuth, deleteAuth, API_URI } from '../../http';
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
} from './api/common';

import { fetchAll as fetchAllAPI } from './api/workshop-activity';
import {
  MetaActivity,
  MetaActivityCategory,
  MetaActivityCategoryWithActivities,
} from './types';

export const metaActivityBulkActions = {
  isLoading: createAction('META_ACTIVITIES/BULK/IS_LOADING'),
  error: createAction('META_ACTIVITIES/BULK/ERROR'),
  success: createAction('META_ACTIVITIES/BULK/SUCCESS'),
};

export function fetchMetaActivityBulk(
  ids: Array<number>,
  options?: OptionCallback,
): ThunkAction {
  return async (dispatch: Dispatch, getState) => {
    const freshIdList = getFreshMetaActivityList(getState());

    const ids_uniq = uniq(ids).filter((id) => !freshIdList.includes(id));
    if (ids_uniq.length === 0) {
      return;
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

export function fetchMetaActivityBulkAfterCategoryDelete(
  ids: Array<number>,
  options?: OptionCallback,
): ThunkAction {
  return async (dispatch: Dispatch) => {
    if (ids.length === 0) {
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
      await deleteMetaActivityAPI(id);
      dispatch(snackbarSuccess('metaActivity.del.success'));
      dispatch(fetchAllActivities());
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

export function fetchAllActivities(params: any = {}): ThunkAction {
  return async (dispatch: Dispatch) => {
    dispatch(metaActivityListActions.isLoading(true));
    dispatch(metaActivityListActions.error(null));

    try {
      const response = await fetchAllActivitiesAPI({
        page_size: null,
        ...params,
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

export const addImage = {
  isLoading: createAction('META_ACTIVITIES/ADD_IMAGE/IS_LOADING'),
  error: createAction('META_ACTIVITIES/ADD_IMAGE/ERROR'),
  success: createAction('META_ACTIVITIES/ADD_IMAGE/SUCCESS'),
};

export function addImageToMetaActivity(id: number, image: File): ThunkAction {
  return async (dispatch: Dispatch) => {
    dispatch(addImage.isLoading({ id, loading: true }));
    dispatch(addImage.error(null));

    try {
      const data = new FormData();
      data.append('image', image);

      const response = await postAuth(
        `${API_URI}/meta-activities/${id}/images/`,
        data,
      );
      dispatch(addImage.success({ id, image: response.data }));
    } catch (error) {
      console.error(error);
      dispatch(addImage.error(error));
      Sentry.captureException(error);
    }
    dispatch(addImage.isLoading({ id, loading: false }));
  };
}

export const removeImage = {
  isLoading: createAction('META_ACTIVITIES/REMOVE_IMAGE/IS_LOADING'),
  error: createAction('META_ACTIVITIES/REMOVE_IMAGE/ERROR'),
  success: createAction('META_ACTIVITIES/REMOVE_IMAGE/SUCCESS'),
};

export function removeImageFromMetaActivity(
  id: number,
  imageId: number,
): ThunkAction {
  return async (dispatch: Dispatch) => {
    dispatch(removeImage.isLoading({ id, imageId, loading: true }));
    dispatch(removeImage.error(null));

    try {
      await deleteAuth(`${API_URI}/meta-activities/${id}/images/${imageId}/`);
      dispatch(removeImage.success({ id, imageId }));
    } catch (error) {
      console.error(error);
      dispatch(removeImage.error(error));
      Sentry.captureException(error);
    }
    dispatch(removeImage.isLoading({ id, imageId, loading: false }));
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
  options: OptionCallback,
): ThunkAction {
  return async (dispatch: Dispatch) => {
    dispatch(deleteAction.isLoading(true));
    dispatch(deleteAction.error(null));

    try {
      await deleteMetaActivityAPI(id);
      dispatch(deleteAction.success(id));
      dispatch(snackbarSuccess('metaActivity.del.success'));
      dispatch(fetchAll());
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

export function fetchAll() {
  return async (dispatch: Dispatch) => {
    dispatch(listingActions.isLoading(true));
    dispatch(listingActions.error(null));
    try {
      const response = await fetchAllAPI();
      dispatch(listingActions.success(response.data));
    } catch (error) {
      console.error(error);
      dispatch(listingActions.error(error));
    }
    dispatch(listingActions.isLoading(false));
  };
}

export function removeImageFromWorkshop(id: number, imageId: number) {
  return async (dispatch: Dispatch) => {
    dispatch(removeImage.isLoading({ id, imageId, loading: true }));
    dispatch(removeImage.error(null));

    try {
      await deleteAuth(`${API_URI}/meta-activities/${id}/images/${imageId}/`);
      dispatch(removeImage.success({ id, imageId }));
    } catch (error) {
      console.error(error);
      dispatch(removeImage.error(error));
      Sentry.captureException(error);
    }
    dispatch(removeImage.isLoading({ id, imageId, loading: false }));
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
      const payload = { [response.data.id]: response.data };
      dispatch(metaActivityDetailActions.success(payload));
      dispatch(snackbarSuccess('metaActivity.restore.success'));
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
    } catch (error) {
      dispatch(deleteMetaActivityCategoryActions.error(category));
      dispatch(snackbarError('paymentPack.category.delete.error'));
      if (options && options.onError) options.onError();
    }
    dispatch(deleteMetaActivityCategoryActions.loading(false));
  };
}
