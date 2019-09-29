// @flow

import { createAction } from 'redux-actions';

import {
  fetchTempPassword as fetchTempPasswordAPI,
  generateTempPassword as generateTempPasswordAPI,
} from './api';

import type { Dispatch, ThunkAction } from '../../state/types';

export const tempPasswordActions = {
  error: createAction('LOGIN/TEMP_PASSWORD/ERROR'),
  success: createAction('LOGIN/TEMP_PASSWORD/SUCCESS'),
  isLoading: createAction('LOGIN/TEMP_PASSWORD/IS_LOADING'),
};

export function fetchTempPassword(): ThunkAction {
  return async (dispatch: Dispatch) => {
    dispatch(tempPasswordActions.isLoading(true));
    dispatch(tempPasswordActions.error(null));
    try {
      const response = await fetchTempPasswordAPI();
      dispatch(tempPasswordActions.success(response.data));
    } catch (err) {
      console.error(err);
      dispatch(tempPasswordActions.error(err));
    }
    dispatch(tempPasswordActions.isLoading(false));
  };
}

export function generateTempPassword(): ThunkAction {
  return async (dispatch: Dispatch) => {
    dispatch(tempPasswordActions.isLoading(true));
    dispatch(tempPasswordActions.error(null));
    try {
      const response = await generateTempPasswordAPI();
      dispatch(tempPasswordActions.success(response.data));
    } catch (err) {
      console.error(err);
      dispatch(tempPasswordActions.error(err));
    }
    dispatch(tempPasswordActions.isLoading(false));
  };
}
