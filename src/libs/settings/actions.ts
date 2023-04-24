// @ts-nocheck
import { createAction } from 'redux-actions';
import { OptionCallback, Dispatch } from '../../state/types';
import {
  fetchCustomShopRedirections as fetchCustomShopRedirectionsAPI,
  createCustomShopRedirection as createCustomShopRedirectionAPI,
  editCustomShopRedirection as editCustomShopRedirectionAPI,
  deleteCustomShopRedirection as deleteCustomShopRedirectionAPI,
  fetchCustomMobilePopups as fetchCustomMobilePopupsAPI,
  createCustomMobilePopup as createCustomMobilePopupAPI,
  editCustomMobilePopup as editCustomMobilePopupAPI,
  deleteCustomMobilePopup as deleteCustomMobilePopupAPI,
} from './api';

import { CustomMobilePopup, CustomShopRedirection } from './types';

export const fetchCustomShopRedirectionsActions = {
  isLoading: createAction('SETTINGS/SHOP_REDIRECTION/LIST/IS_LOADING'),
  error: createAction('SETTINGS/SHOP_REDIRECTION/LIST/ERROR'),
  success: createAction('SETTINGS/SHOP_REDIRECTION/LIST/SUCCESS'),
};

export function fetchCustomShopRedirections(options?: OptionCallback) {
  return async (dispatch: Dispatch) => {
    dispatch(fetchCustomShopRedirectionsActions.isLoading(true));
    dispatch(fetchCustomShopRedirectionsActions.error(null));
    try {
      const response = await fetchCustomShopRedirectionsAPI();
      dispatch(fetchCustomShopRedirectionsActions.success(response.data));
      if (options && options.onSuccess) options.onSuccess(response.data);
    } catch (err) {
      console.error(err);
      dispatch(fetchCustomShopRedirectionsActions.error(err));
      if (options && options.onError) options.onError(err);
    }
    dispatch(fetchCustomShopRedirectionsActions.isLoading(false));
  };
}

export const createCustomShopRedirectionActions = {
  isLoading: createAction('SETTINGS/SHOP_REDIRECTION/CREATE/IS_LOADING'),
  error: createAction('SETTINGS/SHOP_REDIRECTION/CREATE/ERROR'),
  success: createAction('SETTINGS/SHOP_REDIRECTION/CREATE/SUCCESS'),
};

export function createCustomShopRedirection(
  data: Omit<CustomShopRedirection, 'id'>,
  options?: OptionCallback,
) {
  return async (dispatch: Dispatch) => {
    dispatch(createCustomShopRedirectionActions.isLoading(true));
    dispatch(createCustomShopRedirectionActions.error(null));
    try {
      const response = await createCustomShopRedirectionAPI(data);
      dispatch(createCustomShopRedirectionActions.success(response.data));
      if (options && options.onSuccess) options.onSuccess(response.data);
    } catch (err) {
      console.error(err);
      dispatch(createCustomShopRedirectionActions.error(err));
      if (options && options.onError) options.onError(err);
    }
    dispatch(createCustomShopRedirectionActions.isLoading(false));
  };
}

export const editCustomShopRedirectionActions = {
  isLoading: createAction('SETTINGS/SHOP_REDIRECTION/UPDATE/IS_LOADING'),
  error: createAction('SETTINGS/SHOP_REDIRECTION/UPDATE/ERROR'),
  success: createAction('SETTINGS/SHOP_REDIRECTION/UPDATE/SUCCESS'),
};

export function updateCustomShopRedirection(
  { id, data }: { id: string; data: CustomShopRedirection },
  options?: OptionCallback,
) {
  return async (dispatch: Dispatch) => {
    dispatch(editCustomShopRedirectionActions.isLoading(true));
    dispatch(editCustomShopRedirectionActions.error(null));
    try {
      const response = await editCustomShopRedirectionAPI(id, data);
      dispatch(editCustomShopRedirectionActions.success(response.data));
      dispatch(fetchCustomShopRedirections());
      if (options && options.onSuccess) options.onSuccess(response.data);
    } catch (err) {
      console.error(err);
      dispatch(editCustomShopRedirectionActions.error(err));
      if (options && options.onError) options.onError(err);
    }
    dispatch(editCustomShopRedirectionActions.isLoading(false));
  };
}

export const deleteCustomShopRedirectionActions = {
  isLoading: createAction('SETTINGS/SHOP_REDIRECTION/DELETE/IS_LOADING'),
  error: createAction('SETTINGS/SHOP_REDIRECTION/DELETE/ERROR'),
  success: createAction('SETTINGS/SHOP_REDIRECTION/DELETE/SUCCESS'),
};

export function deleteCustomShopRedirection(
  id: string,
  options?: OptionCallback,
) {
  return async (dispatch: Dispatch) => {
    dispatch(deleteCustomShopRedirectionActions.isLoading(true));
    dispatch(deleteCustomShopRedirectionActions.error(null));
    try {
      const response = await deleteCustomShopRedirectionAPI(id);
      dispatch(deleteCustomShopRedirectionActions.success(id));
      if (options && options.onSuccess) options.onSuccess(response.data);
    } catch (err) {
      console.error(err);
      dispatch(deleteCustomShopRedirectionActions.error(err));
      if (options && options.onError) options.onError(err);
    }
    dispatch(deleteCustomShopRedirectionActions.isLoading(false));
  };
}

//

export const fetchCustomMobilePopupsActions = {
  isLoading: createAction('SETTINGS/CUSTOM_POPUP/LIST/IS_LOADING'),
  error: createAction('SETTINGS/CUSTOM_POPUP/LIST/ERROR'),
  success: createAction('SETTINGS/CUSTOM_POPUP/LIST/SUCCESS'),
};

export function fetchCustomMobilePopups(options?: OptionCallback) {
  return async (dispatch: Dispatch) => {
    dispatch(fetchCustomMobilePopupsActions.isLoading(true));
    dispatch(fetchCustomMobilePopupsActions.error(null));
    try {
      const response = await fetchCustomMobilePopupsAPI();
      dispatch(fetchCustomMobilePopupsActions.success(response.data));
      if (options && options.onSuccess) options.onSuccess(response.data);
    } catch (err) {
      console.error(err);
      dispatch(fetchCustomMobilePopupsActions.error(err));
      if (options && options.onError) options.onError(err);
    }
    dispatch(fetchCustomMobilePopupsActions.isLoading(false));
  };
}

export const createCustomMobilePopupActions = {
  isLoading: createAction('SETTINGS/CUSTOM_POPUP/CREATE/IS_LOADING'),
  error: createAction('SETTINGS/CUSTOM_POPUP/CREATE/ERROR'),
  success: createAction('SETTINGS/CUSTOM_POPUP/CREATE/SUCCESS'),
};

export function createCustomMobilePopup(
  data: Omit<CustomMobilePopup, 'id'>,
  options?: OptionCallback,
) {
  return async (dispatch: Dispatch) => {
    dispatch(createCustomMobilePopupActions.isLoading(true));
    dispatch(createCustomMobilePopupActions.error(null));
    try {
      const response = await createCustomMobilePopupAPI(data);
      dispatch(createCustomMobilePopupActions.success(response.data));
      if (options && options.onSuccess) options.onSuccess(response.data);
    } catch (err) {
      console.error(err);
      dispatch(createCustomMobilePopupActions.error(err));
      if (options && options.onError) options.onError(err);
    }
    dispatch(createCustomMobilePopupActions.isLoading(false));
  };
}

export const editCustomMobilePopupActions = {
  isLoading: createAction('SETTINGS/CUSTOM_POPUP/UPDATE/IS_LOADING'),
  error: createAction('SETTINGS/CUSTOM_POPUP/UPDATE/ERROR'),
  success: createAction('SETTINGS/CUSTOM_POPUP/UPDATE/SUCCESS'),
};

export function updateCustomMobilePopup(
  { id, data }: { id: string; data: CustomMobilePopup },
  options?: OptionCallback,
) {
  return async (dispatch: Dispatch) => {
    dispatch(editCustomMobilePopupActions.isLoading(true));
    dispatch(editCustomMobilePopupActions.error(null));
    try {
      const response = await editCustomMobilePopupAPI(id, data);
      dispatch(editCustomMobilePopupActions.success(response.data));
      dispatch(fetchCustomMobilePopups());
      if (options && options.onSuccess) options.onSuccess(response.data);
    } catch (err) {
      console.error(err);
      dispatch(editCustomMobilePopupActions.error(err));
      if (options && options.onError) options.onError(err);
    }
    dispatch(editCustomMobilePopupActions.isLoading(false));
  };
}

export const deleteCustomMobilePopupActions = {
  isLoading: createAction('SETTINGS/CUSTOM_POPUP/DELETE/IS_LOADING'),
  error: createAction('SETTINGS/CUSTOM_POPUP/DELETE/ERROR'),
  success: createAction('SETTINGS/CUSTOM_POPUP/DELETE/SUCCESS'),
};

export function deleteCustomMobilePopup(id: string, options?: OptionCallback) {
  return async (dispatch: Dispatch) => {
    dispatch(deleteCustomMobilePopupActions.isLoading(true));
    dispatch(deleteCustomMobilePopupActions.error(null));
    try {
      const response = await deleteCustomMobilePopupAPI(id);
      dispatch(deleteCustomMobilePopupActions.success(id));
      if (options && options.onSuccess) options.onSuccess(response.data);
    } catch (err) {
      console.error(err);
      dispatch(deleteCustomMobilePopupActions.error(err));
      if (options && options.onError) options.onError(err);
    }
    dispatch(deleteCustomMobilePopupActions.isLoading(false));
  };
}
