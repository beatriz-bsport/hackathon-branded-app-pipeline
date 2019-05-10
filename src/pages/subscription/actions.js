// @flow

import { createAction } from 'redux-actions';

import { getAuth, deleteAuth, API_URI } from '../../http';

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
      const response = await getAuth(
        `${API_URI}/subscription/billing-plan/${id}/`,
      );

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
      const response = await deleteAuth(
        `${API_URI}/subscription/billing-plan/${id}/stop/`,
      );

      dispatch(detailActions.success(response.data));
    } catch (error) {
      dispatch(stopActions.error(error));
    }

    dispatch(stopActions.isLoading(false));
  };
}
