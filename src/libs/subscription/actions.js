// @flow

import { createAction } from 'redux-actions';

import api from './api';

import type { Dispatch, ThunkAction } from '../../state/types';

export const detailActions = {
  error: createAction('SUBSCRIPTION/LOAD/ERROR'),
  isLoading: createAction('SUBSCRIPTION/LOAD/IS_LOADING'),
  success: createAction('SUBSCRIPTION/LOAD/SUCCESS'),
};

export const stopActions = {
  error: createAction('SUBSCRIPTION/STOP/ERROR'),
  isLoading: createAction('SUBSCRIPTION/STOP/IS_LOADING'),
  success: createAction('SUBSCRIPTION/STOP/SUCCESS'),
};

export function fetch(id: number): ThunkAction {
  return async (dispatch: Dispatch) => {
    dispatch(detailActions.isLoading(true));
    dispatch(detailActions.error(null));

    try {
      const response = await api.fetchDetail(id);

      dispatch(detailActions.success(response.data));
    } catch (error) {
      dispatch(detailActions.error(error));
    }

    dispatch(detailActions.isLoading(false));
  };
}

export function stop(id: number): ThunkAction {
  return async (dispatch: Dispatch) => {
    dispatch(stopActions.isLoading(true));
    dispatch(stopActions.error(null));

    try {
      const response = await api.stop(id);

      dispatch(detailActions.success(response.data));
    } catch (error) {
      dispatch(stopActions.error(error));
    }

    dispatch(stopActions.isLoading(false));
  };
}
