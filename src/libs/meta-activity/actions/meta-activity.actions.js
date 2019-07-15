// @flow

import * as Sentry from '@sentry/browser';
import { createAction } from 'redux-actions';
import { push } from 'react-router-redux';
import type { Dispatch, ThunkAction } from '../../../state/types';
import {
  snackbarSuccess,
  snackbarError,
} from '../../../actions/snackbar.actions';

import { postAuth, deleteAuth, API_URI } from '../../../http';
import {
  fetchMetaActivityDetails as fetchMetaActivityDetailsAPI,
  updateMetaActivity as updateMetaActivityAPI,
  addMetaActivity as addMetaActivityAPI,
  fetchAllActivities as fetchAllActivitiesAPI,
} from '../api/common';

export const fetchOne = {
  isLoading: createAction('META_ACTIVITIES/DETAIL/IS_LOADING'),
  error: createAction('META_ACTIVITIES/DETAIL/ERROR'),
  success: createAction('META_ACTIVITIES/DETAIL/SUCCESS'),
};

export function fetchMetaActivityDetails(id: number): ThunkAction {
  return async (dispatch: Dispatch) => {
    dispatch(fetchAll.isLoading(true));
    dispatch(fetchAll.error(null));

    try {
      const response = await fetchMetaActivityDetailsAPI(id);
      dispatch(fetchOne.success(response.data));
    } catch (err) {
      dispatch(fetchAll.error(err));
      Sentry.captureException(err);
    }
    dispatch(fetchAll.isLoading(false));
  };
}

export const fetchAll = {
  isLoading: createAction('META_ACTIVITIES/LIST/IS_LOADING'),
  error: createAction('META_ACTIVITIES/LIST/ERROR'),
  success: createAction('META_ACTIVITIES/LIST/SUCCESS'),
};

export function fetchAllActivities(): ThunkAction {
  return async (dispatch: Dispatch) => {
    dispatch(fetchAll.isLoading(true));
    dispatch(fetchAll.error(null));

    try {
      const response = await fetchAllActivitiesAPI();
      dispatch(fetchAll.success(response.data));
    } catch (err) {
      dispatch(fetchAll.error(err));
      Sentry.captureException(err);
    }
    dispatch(fetchAll.isLoading(false));
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

export function upsert(metaActivityData: *, options: *): ThunkAction {
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
      dispatch(snackbarSuccess(`activity.forms.${key}.success`));
      dispatch(push('/activity'));
      if (options && options.onSuccess) options.onSuccess();
    } catch (error) {
      console.error(error);
      dispatch(snackbarError(`activity.forms.${key}error`));
      dispatch(upsertActions.error(error));
      if (options && options.onError) options.onError(error);
    }
    dispatch(upsertActions.isLoading(false));
  };
}
