// @flow

import { createAction } from 'redux-actions';

import * as Sentry from '@sentry/browser';
import {
  snackbarSuccess,
  snackbarError,
} from '../../../actions/snackbar.actions';
import {
  updateMetaActivity,
  addMetaActivity,
  deleteMetaActivity as deleteMetaActivityAPI,
} from '../api/common';
import { fetchAll as fetchAllAPI } from '../api/workshop-activity';

import type { Dispatch, ThunkAction } from '../../../state/types';

import { postAuth, deleteAuth, API_URI } from '../../../http';

export const listingActions = {
  isLoading: createAction('WORKSHOP/LIST/IS_LOADING'),
  error: createAction('WORKSHOP/LIST/ERROR'),
  success: createAction('WORKSHOP/LIST/SUCCESS'),
};

export const deleteAction = {
  isLoading: createAction('WORKSHOP/DELETE/IS_LOADING'),
  error: createAction('WORKSHOP/DELETE/ERROR'),
  success: createAction('WORKSHOP/DELETE/SUCCESS'),
};

export function deleteWorkshop(
  id: number,
  options: ?{ onSuccess: ?() => void, onError: ?() => void },
): ThunkAction {
  return async (dispatch: Dispatch) => {
    dispatch(deleteAction.isLoading(true));
    dispatch(deleteAction.error(null));

    try {
      await deleteMetaActivityAPI(id);
      dispatch(deleteAction.success(id));
      dispatch(fetchAll());
      if (options && options.onSuccess) options.onSuccess();
    } catch (err) {
      dispatch(deleteAction.error(err));
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

export const upsertActions = {
  isLoading: createAction('WORKSHOP/UPSERT/IS_LOADING'),
  error: createAction('WORKSHOP/UPSERT/ERROR'),
  success: createAction('WORKSHOP/UPSERT/SUCCESS'),
};

export function upsert(workshopActivityData: *, options: *) {
  return async (dispatch: Dispatch) => {
    dispatch(upsertActions.isLoading(true));
    dispatch(upsertActions.error(null));

    const createOrUpdate = workshopActivityData.has('id')
      ? updateMetaActivity
      : addMetaActivity;
    try {
      const response = await createOrUpdate(workshopActivityData);
      dispatch(upsertActions.success(response.data));
      const key = workshopActivityData.has('id') ? 'update' : 'create';
      dispatch(snackbarSuccess(`workshopActivity.forms.${key}.success`));
      dispatch(fetchAll());
      if (options && options.onSuccess) options.onSuccess();
    } catch (error) {
      console.error(error);
      dispatch(snackbarError('workshop.forms.error'));
      dispatch(upsertActions.error(error));
      if (options && options.onError) options.onError(error);
    }
    dispatch(upsertActions.isLoading(false));
  };
}

export const addImage = {
  isLoading: createAction('WORKSHOP/ADD_IMAGE/IS_LOADING'),
  error: createAction('WORKSHOP/ADD_IMAGE/ERROR'),
  success: createAction('WORKSHOP/ADD_IMAGE/SUCCESS'),
};

export function addImageToWorkshop(id: number, image: File) {
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
  isLoading: createAction('WORKSHOP/REMOVE_IMAGE/IS_LOADING'),
  error: createAction('WORKSHOP/REMOVE_IMAGE/ERROR'),
  success: createAction('WORKSHOP/REMOVE_IMAGE/SUCCESS'),
};

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
