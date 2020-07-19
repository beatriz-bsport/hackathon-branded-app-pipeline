// @flow

import { createAction } from 'redux-actions';

import {
  fetchTempPassword as fetchTempPasswordAPI,
  generateTempPassword as generateTempPasswordAPI,
  validateEmail as validateEmailAPI,
  requestValidateEmail as requestValidateEmailAPI,
  checkEmailValidation as checkEmailValidationAPI,
  checkMyEmailValidation as checkMyEmailValidationAPI,
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

export const requestValidateEmailActions = {
  error: createAction('LOGIN/REQUEST_VALIDATE_EMAIL/ERROR'),
  success: createAction('LOGIN/REQUEST_VALIDATE_EMAIL/SUCCESS'),
  isLoading: createAction('LOGIN/REQUEST_VALIDATE_EMAIL/IS_LOADING'),
};

export function requestValidationEmail(email: string, options: any) {
  return async (dispatch: Dispatch) => {
    dispatch(requestValidateEmailActions.error(null));
    dispatch(requestValidateEmailActions.isLoading(true));
    try {
      await requestValidateEmailAPI(email);
      if (options && options.onSuccess) options.onSuccess(email);
    } catch (err) {
      dispatch(requestValidateEmailActions.error(err));
      if (options && options.onError) options.onError(err);
    }
    dispatch(requestValidateEmailActions.isLoading(false));
  };
}

export const validateEmailActions = {
  error: createAction('LOGIN/VALIDATE_EMAIL/ERROR'),
  success: createAction('LOGIN/VALIDATE_EMAIL/SUCCESS'),
  isLoading: createAction('LOGIN/VALIDATE_EMAIL/IS_LOADING'),
};

export function validateEmail(data: any, options: any) {
  return async (dispatch: Dispatch) => {
    dispatch(validateEmailActions.error(null));
    dispatch(validateEmailActions.isLoading(true));
    try {
      const response = await validateEmailAPI(data);
      if (options && options.onSuccess) options.onSuccess(response.data);
    } catch (err) {
      dispatch(validateEmailActions.error(err));
      if (options && options.onError) options.onError(err);
    }
    dispatch(validateEmailActions.isLoading(false));
  };
}

export const checkEmailValidationActions = {
  error: createAction('LOGIN/CHECK_EMAIL_VALIDATION/ERROR'),
  success: createAction('LOGIN/CHECK_EMAIL_VALIDATION/SUCCESS'),
  isLoading: createAction('LOGIN/CHECK_EMAIL_VALIDATION/IS_LOADING'),
};

export function checkEmailValidation(email: string, options: any) {
  return async (dispatch: Dispatch) => {
    dispatch(checkEmailValidationActions.error(null));
    dispatch(checkEmailValidationActions.isLoading(true));
    try {
      let response = null;
      if (email) {
        response = await checkEmailValidationAPI(email);
      } else {
        response = await checkMyEmailValidationAPI();
      }
      if (options && options.onSuccess) options.onSuccess(response.data);
    } catch (err) {
      dispatch(checkEmailValidationActions.error(err));
      if (options && options.onError) options.onError(err);
    }
    dispatch(checkEmailValidationActions.isLoading(false));
  };
}
