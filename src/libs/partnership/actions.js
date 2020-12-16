// @flow

import { createAction } from 'redux-actions';

import {
  fetchPartnershipList as fetchPartnershipListAPI,
  requestPartnership as requestPartnershipAPI,
  updateParntership as updateParntershipAPI,
} from './api';

import type { Dispatch, OptionCallback } from '../../state/types.ts';

export const listPartnershipActions = {
  error: createAction('PARTNERSHIP/LIST/ERROR'),
  isLoading: createAction('PARTNERSHIP/LIST/IS_LOADING'),
  success: createAction('PARTNERSHIP/LIST/SUCCESS'),
};

export function fetchPartnershipList(options: OptionCallback) {
  return async (dispatch: Dispatch) => {
    dispatch(listPartnershipActions.isLoading(true));
    dispatch(listPartnershipActions.error(null));

    try {
      const response = await fetchPartnershipListAPI();
      dispatch(listPartnershipActions.success(response.data));
      dispatch(listPartnershipActions.error(null));
      if (options && options.onSuccess) {
        options.onSuccess(response.data);
      }
    } catch (error) {
      console.error(error);
      dispatch(listPartnershipActions.error(error));
      if (options && options.onError) {
        options.onError(error);
      }
    }

    dispatch(listPartnershipActions.isLoading(false));
  };
}

export const requestPartnershipActions = {
  error: createAction('PARTNERSHIP/REQUEST/ERROR'),
  isLoading: createAction('PARTNERSHIP/REQUESTLIST/IS_LOADING'),
  success: createAction('PARTNERSHIP/REQUEST/SUCCESS'),
};

export function requestPartnership(
  identifier: string,
  options: OptionCallback,
) {
  return async (dispatch: Dispatch) => {
    dispatch(requestPartnershipActions.isLoading(true));
    dispatch(requestPartnershipActions.error(null));

    try {
      const response = await requestPartnershipAPI(identifier);
      dispatch(requestPartnershipActions.success(response.data));
      dispatch(requestPartnershipActions.error(null));
      if (options && options.onSuccess) {
        options.onSuccess(response.data);
      }
    } catch (error) {
      console.error(error);
      dispatch(requestPartnershipActions.error(error));
      if (options && options.onError) {
        options.onError(error);
      }
    }

    dispatch(requestPartnershipActions.isLoading(false));
  };
}

export const updatePartnershipActions = {
  error: createAction('PARTNERSHIP/UPDATE/ERROR'),
  isLoading: createAction('PARTNERSHIP/UPDATE/IS_LOADING'),
  success: createAction('PARTNERSHIP/UPDATE/SUCCESS'),
};

export function updatePartnership(
  id: number,
  data: any,
  options: OptionCallback,
) {
  return async (dispatch: Dispatch) => {
    dispatch(updatePartnershipActions.isLoading(true));
    dispatch(updatePartnershipActions.error(null));

    try {
      const response = await updateParntershipAPI(id, data);
      dispatch(updatePartnershipActions.success(response.data));
      dispatch(updatePartnershipActions.error(null));
      if (options && options.onSuccess) {
        options.onSuccess(response.data);
      }
    } catch (error) {
      console.error(error);
      dispatch(updatePartnershipActions.error(error));
      if (options && options.onError) {
        options.onError(error);
      }
    }

    dispatch(updatePartnershipActions.isLoading(false));
  };
}
