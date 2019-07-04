// @flow

import { createAction } from 'redux-actions';

import api from './api';

import type { Dispatch, ThunkAction } from '../../state/types';

export const listActions = {
  error: createAction('ALERTING/LIST/ERROR'),
  isLoading: createAction('ALERTING/LIST/IS_LOADING'),
  success: createAction('ALERTING/LIST/SUCCESS'),
};

export const detailActions = {
  error: createAction('ALERTING/DETAIL/ERROR'),
  isLoading: createAction('ALERTING/DETAIL/IS_LOADING'),
  success: createAction('ALERTING/DETAIL/SUCCESS'),
};

export const deleteActions = {
  error: createAction('ALERTING/DELETE/ERROR'),
  isLoading: createAction('ALERTING/DELETE/IS_LOADING'),
  success: createAction('ALERTING/DELETE/SUCCESS'),
};

export function delete_(id: number): ThunkAction {
  return async (dispatch: Dispatch) => {
    dispatch(deleteActions.isLoading(true));
    dispatch(deleteActions.error(null));

    try {
      await api.delete_(id);

      dispatch(deleteActions.success(id));
    } catch (error) {
      dispatch(deleteActions.error(error));
    }

    dispatch(deleteActions.isLoading(false));
  };
}

export function fetch(): ThunkAction {
  return async (dispatch: Dispatch) => {
    dispatch(listActions.isLoading(true));
    dispatch(listActions.error(null));

    try {
      const response = await api.fetchAll();

      dispatch(listActions.success(response.data));
    } catch (error) {
      dispatch(listActions.error(error));
    }

    dispatch(listActions.isLoading(false));
  };
}

export function performAction(id: number, action_name: string): ThunkAction {
  return async (dispatch: Dispatch) => {
    dispatch(detailActions.isLoading({ id, isLoading: true }));
    dispatch(detailActions.error(null));

    try {
      const response = await api.performAction(id, action_name);
      dispatch(detailActions.success(response.data));
    } catch (error) {
      dispatch(detailActions.error(error));
    }

    dispatch(detailActions.error(null));
    dispatch(detailActions.isLoading({ id, isLoading: false }));
  };
}
