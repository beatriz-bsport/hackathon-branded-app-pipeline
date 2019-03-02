// @flow

import { createAction } from 'redux-actions';

import { push } from 'react-router-redux';
import { snackbarSuccess, snackbarError } from './snackbar.actions';
import api from '../api';

import type { Dispatch } from '../state/types';

export const listingActions = {
  isLoading: createAction('META_ACTIVITY/ONESHOT_LIST/IS_LOADING'),
  error: createAction('META_ACTIVITY/ONESHOT_LIST/ERROR'),
  success: createAction('META_ACTIVITY/ONESHOT_LIST/SUCCESS'),
};

export function fetchAll() {
  return async (dispatch: Dispatch) => {
    dispatch(listingActions.isLoading(true));
    dispatch(listingActions.error(null));
    try {
      const response = await api.workshopActivity.fetchAll();
      dispatch(listingActions.success(response.data));
    } catch (error) {
      console.error(error);
      dispatch(listingActions.error(error));
    }
    dispatch(listingActions.isLoading(false));
  };
}

export const upsertActions = {
  isLoading: createAction('META_ACTIVITY/ONESHOT_UPSERT/IS_LOADING'),
  error: createAction('META_ACTIVITY/ONESHOT_UPSERT/ERROR'),
  success: createAction('META_ACTIVITY/ONESHOT_UPSERT/SUCCESS'),
};

export function upsert(workshopActivityData, options) {
  return async (dispatch: Dispatch) => {
    dispatch(upsertActions.isLoading(true));
    dispatch(upsertActions.error(null));

    const createOrUpdate = workshopActivityData.has('id')
      ? api.activity.updateMetaActivity
      : api.activity.addMetaActivity;
    try {
      const response = await createOrUpdate(workshopActivityData);
      dispatch(upsertActions.success(response.data));
      const key = workshopActivityData.has('id') ? 'update' : 'create';
      dispatch(snackbarSuccess(`workshopActivity.forms.${key}.success`));
      dispatch(fetchAll());
      dispatch(push('/workshop-activity'));
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
