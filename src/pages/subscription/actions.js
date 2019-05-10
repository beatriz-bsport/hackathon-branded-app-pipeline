// @flow

import { createAction } from 'redux-actions';

import { getAuth, API_URI } from '../../http';

import type { Dispatch, ThunkAction } from '../../state/types';

export const detail = {
  error: createAction('SUBSCRIPTION/LOAD/ERROR'),
  isLoading: createAction('SUBSCRIPTION/LOAD/IS_LOADING'),
  success: createAction('SUBSCRIPTION/LOAD/SUCCESS'),
};

export function fetch(id: number): ThunkAction {
  return async (dispatch: Dispatch) => {
    dispatch(detail.isLoading(true));
    dispatch(detail.error(null));

    try {
      const response = await getAuth(
        `${API_URI}/subscription/billing-plan/${id}/`,
      );

      dispatch(detail.success(response.data));
    } catch (error) {
      dispatch(detail.error(error));
    }

    dispatch(detail.isLoading(false));
  };
}
