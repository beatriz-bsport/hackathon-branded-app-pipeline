// @flow
import { Dispatch } from 'redux';
import { createAction } from 'redux-actions';
import { OptionCallback } from '../../state/types';

import {
  fetchLevelList as fetchLevelListAPI,
  fetchLevel as fetchLevelAPI,
  updateLevel as updateLevelAPI,
  createLevel as createLevelAPI,
  deleteLevel as deleteLevelAPI,
} from './api';
import { Level, LevelFilterSet } from './types';

export const fetchLevelListActions = {
  error: createAction('LEVEL/FETCH_LIST/ERROR'),
  loading: createAction('LEVEL/FETCH_LIST/LOADING'),
  success: createAction('LEVEL/FETCH_LIST/SUCCESS'),
};

export const fetchLevelList = (
  params: LevelFilterSet = {},
  options?: OptionCallback<Level[]>,
) => {
  return async (dispatch: Dispatch) => {
    dispatch(fetchLevelListActions.loading(true));
    dispatch(fetchLevelListActions.error(null));

    try {
      const response = await fetchLevelListAPI(params);

      dispatch(fetchLevelListActions.success(response.data));
      options?.onSuccess(response.data);
    } catch (error) {
      dispatch(fetchLevelListActions.error(error));
      options?.onError(error);
    }
    dispatch(fetchLevelListActions.loading(false));
  };
};

export const fetchLevelActions = {
  error: createAction('LEVEL/FETCH_DETAIL/ERROR'),
  loading: createAction('LEVEL/FETCH_DETAIL/LOADING'),
  success: createAction('LEVEL/FETCH_DETAIL/SUCCESS'),
};

export const fetchLevel = (id: number, options?: OptionCallback<Level>) => {
  return async (dispatch: Dispatch) => {
    dispatch(fetchLevelActions.loading(true));
    dispatch(fetchLevelActions.error(null));

    try {
      const response = await fetchLevelAPI(id);
      dispatch(fetchLevelActions.success(response.data));
      options?.onSuccess(response.data);
    } catch (error) {
      dispatch(fetchLevelActions.error(error));
      options?.onError(error);
    }
    dispatch(fetchLevelActions.loading(false));
  };
};

export const updateLevelActions = {
  error: createAction('LEVEL/UPDATE/ERROR'),
  loading: createAction('LEVEL/UPDATE/LOADING'),
  success: createAction('LEVEL/UPDATE/SUCCESS'),
};

export const updateLevel = (
  id: number,
  data: Level,
  options?: OptionCallback<Level>,
) => {
  return async (dispatch: Dispatch) => {
    dispatch(updateLevelActions.loading(true));
    dispatch(updateLevelActions.error(null));

    try {
      const response = await updateLevelAPI(id, data);
      dispatch(updateLevelActions.success(response.data));
      options?.onSuccess(response.data);
    } catch (error) {
      dispatch(updateLevelActions.error(error));
      options?.onError(error);
    }
    dispatch(updateLevelActions.loading(false));
  };
};

export const createLevelActions = {
  error: createAction('LEVEL/CREATE/ERROR'),
  loading: createAction('LEVEL/CREATE/LOADING'),
  success: createAction('LEVEL/CREATE/SUCCESS'),
};

export const createLevel = (data: Level, options?: OptionCallback<Level>) => {
  return async (dispatch: Dispatch) => {
    dispatch(createLevelActions.loading(true));
    dispatch(createLevelActions.error(null));

    try {
      const response = await createLevelAPI(data);
      dispatch(createLevelActions.success(response.data));
      options?.onSuccess(response.data);
    } catch (error) {
      dispatch(createLevelActions.error(error));
      options?.onError(error);
    }
    dispatch(createLevelActions.loading(false));
  };
};

export const deleteLevelActions = {
  error: createAction('LEVEL/EDIT/ERROR'),
  loading: createAction('LEVEL/EDIT/LOADING'),
  success: createAction('LEVEL/EDIT/SUCCESS'),
};

export const deleteLevel = (id: number, options?: OptionCallback) => {
  return async (dispatch: Dispatch) => {
    dispatch(deleteLevelActions.loading(true));
    dispatch(deleteLevelActions.error(null));

    try {
      const response = await deleteLevelAPI(id);
      dispatch(deleteLevelActions.success(response.data));
      options?.onSuccess(response.data);
    } catch (error) {
      dispatch(deleteLevelActions.error(error));
      options?.onError?.(error);
    }
    dispatch(deleteLevelActions.loading(false));
  };
};
