// @flow
import { createAction } from 'redux-actions';

import {
  fetchCompanyList as fetchCompanyListAPI,
  createCompany as createCompanyAPI,
  attachExternalAccount as attachExternalAccountAPI,
} from './api';
import type { Dispatch, OptionCallback } from '../../state/types';

export const searchActions = {
  success: createAction('COMPANY/SEARCH/SUCCESS'),
  isLoading: createAction('COMPANY/SEARCH/IS_LOADING'),
  error: createAction('COMPANY/SEARCH/ERROR'),
};

export function searchCompany(text: string, options: OptionCallback) {
  return async (dispatch: Dispatch) => {
    dispatch(searchActions.isLoading(true));
    dispatch(searchActions.error(null));

    try {
      const response = await fetchCompanyListAPI({
        search: text,
      });
      dispatch(searchActions.success(response.data));
      if (options && options.onSuccess) {
        options.onSuccess(response.data);
      }
    } catch (err) {
      console.error(err);
      dispatch(searchActions.error(err));
      if (options && options.onError) options.onError(err);
    }
    dispatch(searchActions.isLoading(false));
  };
}

export const createCompanyActions = {
  success: createAction('COMPANY/CREATE/SUCCESS'),
  isLoading: createAction('COMPANY/CREATE/IS_LOADING'),
  error: createAction('COMPANY/CREATE/ERROR'),
};

export function createCompany(
  data: { email: string, password: string, name: string, country: string },
  options: OptionCallback,
) {
  return async (dispatch: Dispatch) => {
    dispatch(createCompanyActions.isLoading(true));
    dispatch(createCompanyActions.error(null));

    try {
      const response = await createCompanyAPI(data);
      dispatch(createCompanyActions.success(response.data));
      if (options && options.onSuccess) {
        options.onSuccess(response.data);
      }
    } catch (err) {
      console.error(err);
      dispatch(createCompanyActions.error(err));
      if (options && options.onError) options.onError(err);
    }
    dispatch(createCompanyActions.isLoading(false));
  };
}

export const attachExternalAccountActions = {
  success: createAction('COMPANY/ATTACH_EXTERNAL_ACCOUNT/SUCCESS'),
  isLoading: createAction('COMPANY/ATTACH_EXTERNAL_ACCOUNT/IS_LOADING'),
  error: createAction('COMPANY/ATTACH_EXTERNAL_ACCOUNT/ERROR'),
};

export function attachExternalAccount(token: string, options: OptionCallback) {
  return async (dispatch: Dispatch) => {
    dispatch(attachExternalAccountActions.isLoading(true));
    dispatch(attachExternalAccountActions.error(null));

    try {
      const response = await attachExternalAccountAPI(token);
      dispatch(attachExternalAccountActions.success(response.data));
      if (options && options.onSuccess) {
        options.onSuccess(response.data);
      }
    } catch (err) {
      console.error(err);
      dispatch(attachExternalAccountActions.error(err));
      if (options && options.onError) options.onError(err);
    }
    dispatch(attachExternalAccountActions.isLoading(false));
  };
}
