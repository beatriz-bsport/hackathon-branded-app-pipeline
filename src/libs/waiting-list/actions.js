// @flow

import { createAction } from 'redux-actions';

import {
  fetchConfiguration as fetchConfigurationAPI,
  patchConfiguration as patchConfigurationAPI,
} from './api';

import type { Dispatch, ThunkAction } from '../../state/types';

export const configurationDetail = {
  error: createAction('WAITING_LIST_CONFIGURATION/DETAIL/ERROR'),
  isLoading: createAction('WAITING_LIST_CONFIGURATION/DETAIL/IS_LOADING'),
  success: createAction('WAITING_LIST_CONFIGURATION/DETAIL/SUCCESS'),
};

export const configurationUpdate = {
  error: createAction('WAITING_LIST_CONFIGURATION/UPDATE/ERROR'),
  isLoading: createAction('WAITING_LIST_CONFIGURATION/UPDATE/IS_LOADING'),
};

export function patchConfiguration(data: *): ThunkAction {
  return async (dispatch: Dispatch) => {
    dispatch(configurationUpdate.isLoading(true));
    dispatch(configurationUpdate.error(null));

    try {
      const response = await patchConfigurationAPI(data);

      dispatch(configurationDetail.success(response.data));
    } catch (error) {
      dispatch(configurationUpdate.error(error));
    }

    dispatch(configurationUpdate.isLoading(false));
  };
}

export function fetchConfiguration(): ThunkAction {
  return async (dispatch: Dispatch) => {
    dispatch(configurationDetail.isLoading(true));
    dispatch(configurationDetail.error(null));

    try {
      const response = await fetchConfigurationAPI();

      dispatch(configurationDetail.success(response.data));
    } catch (error) {
      dispatch(configurationDetail.error(error));
    }

    dispatch(configurationDetail.isLoading(false));
  };
}
