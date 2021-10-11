import { createAction } from 'redux-actions';

import {
  fetchQuickbooksApp as fetchQuickbooksAppAPI,
  updateQuickbooksApp as updateQuickbooksAppAPI,
  revokeQuickbooksApp as revokeQuickbooksAppAPI,
  requestQuickBooksAccessToken as requestQuickBooksAccessTokenAPI,
} from './api';

import type { Dispatch, OptionCallback } from '../../state/types';
import type { QuickbooksApp } from './types';

export const retrieveQuickbooksAppActions = {
  success: createAction('QUICKBOOKS_APP/RETRIEVE/SUCCESS'),
  error: createAction('QUICKBOOKS_APP/RETRIEVE/ERROR'),
  isLoading: createAction('QUICKBOOKS_APP/RETRIEVE/IS_LOADING'),
};

export function retrieveQuickbooksApp(
  companyId: number,
  options?: OptionCallback,
) {
  return async (dispatch: Dispatch) => {
    dispatch(retrieveQuickbooksAppActions.error(null));
    dispatch(retrieveQuickbooksAppActions.isLoading(true));
    try {
      const response = await fetchQuickbooksAppAPI(companyId);
      dispatch(retrieveQuickbooksAppActions.success(response.data));
      if (options && options.onSuccess) options.onSuccess();
    } catch (error) {
      console.error(error);
      dispatch(retrieveQuickbooksAppActions.error(error));
      if (options && options.onError) options.onError();
    }
    dispatch(retrieveQuickbooksAppActions.isLoading(false));
  };
}

export const quickbooksAppUpdateActions = {
  success: createAction('QUICKBOOKS_APP/UPDATE/SUCCESS'),
  error: createAction('QUICKBOOKS_APP/UPDATE/ERROR'),
  isLoading: createAction('QUICKBOOKS_APP/UPDATE/IS_LOADING'),
};

export function updateQuickbooksApp(
  companyId: number,
  data: QuickbooksApp,
  options?: OptionCallback,
) {
  return async (dispatch: Dispatch) => {
    dispatch(quickbooksAppUpdateActions.error(null));
    dispatch(quickbooksAppUpdateActions.isLoading(true));
    try {
      const response = await updateQuickbooksAppAPI(companyId, data);
      dispatch(retrieveQuickbooksAppActions.success(response.data));
      if (options && options.onSuccess) {
        options.onSuccess(response.data);
      }
    } catch (error) {
      dispatch(quickbooksAppUpdateActions.error(error));
      if (options && options.onError) {
        options.onError(error);
      }
    }
    dispatch(quickbooksAppUpdateActions.isLoading(false));
  };
}

export const revokeQuickbooksAppActions = {
  error: createAction('QUICKBOOKS_APP/REVOKE/ERROR'),
  isLoading: createAction('QUICKBOOKS_APP/REVOKE/IS_LOADING'),
  success: createAction('QUICKBOOKS_APP/REVOKE/SUCCESS'),
};

export function revokeQuickbooksApp(
  company_id: number,
  options?: OptionCallback,
) {
  return async (dispatch: Dispatch) => {
    dispatch(revokeQuickbooksAppActions.error(null));
    dispatch(revokeQuickbooksAppActions.isLoading(true));
    try {
      const response = await revokeQuickbooksAppAPI(company_id);
      dispatch(revokeQuickbooksAppActions.success(response.data));
      if (options && options.onSuccess) {
        options.onSuccess(response.data);
      }
    } catch (error) {
      console.error(error);
      dispatch(revokeQuickbooksAppActions.error(error));
      if (options && options.onError) {
        options.onError(error);
      }
    }
    dispatch(revokeQuickbooksAppActions.isLoading(false));
  };
}

export const requestQuickBooksAccessTokenActions = {
  success: createAction('QUICKBOOKS_APP/REQUEST_TOKEN/SUCCESS'),
  error: createAction('QUICKBOOKS_APP/REQUEST_TOKEN/ERROR'),
  isLoading: createAction('QUICKBOOKS_APP/REQUEST_TOKEN/IS_LOADING'),
};

export function requestQuickBooksAccessToken(
  params: {
    companyId: number;
    code: string;
    realm_Id: string;
    redirect_uri: string;
  },
  options?: OptionCallback,
) {
  return async (dispatch: Dispatch) => {
    dispatch(requestQuickBooksAccessTokenActions.error(null));
    dispatch(requestQuickBooksAccessTokenActions.isLoading(true));
    try {
      const response = await requestQuickBooksAccessTokenAPI(params);
      dispatch(requestQuickBooksAccessTokenActions.success(response.data));
      if (options && options.onSuccess) options.onSuccess();
    } catch (error) {
      console.error(error);
      dispatch(requestQuickBooksAccessTokenActions.error(error));
      if (options && options.onError) options.onError();
    }
    dispatch(requestQuickBooksAccessTokenActions.isLoading(false));
  };
}
