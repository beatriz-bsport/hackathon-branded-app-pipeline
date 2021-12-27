// @flow

import * as Sentry from '@sentry/react';
import { push } from 'connected-react-router';
import { createAction } from 'redux-actions';

import api from '../api';
import types from './auth.types';
import { Dispatch, ThunkAction, OptionCallback } from '../state/types';
import WidgetUtils from '../libs/widget/WidgetUtils';
import { WidgetMessageType } from '../libs/widget/types';
import { snackbarError } from './snackbar.actions';
import { USER_EMAIL_EXISTS } from '../api/constants';
import { getAuthToken } from '../http';
import { segmentIdentify } from '#components/analytics/segment/utils';

export const initiateInterface = createAction('initiate');

export function profileUpdated() {
  // return { email, firstname, lastname, type: types.PROFILE_UPDATED };
  return { type: types.PROFILE_UPDATED };
}

export function updateProfile({
  email,
  firstname,
  lastname,
}: {
  email: string,
  firstname: string,
  lastname: string,
}) {
  return async (dispatch: Dispatch) => {
    // TODO update firstname email and lastname in reducer
    await api.auth.updateProfile({
      email,
      first_name: firstname,
      last_name: lastname,
    });
    dispatch(profileUpdated());
  };
}

export function networkError(error: ?Error) {
  return { type: 'LOGIN/NETWORK_ERROR', error };
}

export function fetchAccessLevel(
  token: string,
  options: ?{
    company: string,
    goNext?: (values: {
      is_manager: Boolean,
      is_consumer: Boolean,
      is_franchisor: Boolean,
    }) => ThunkAction,
    onDone: ?() => void,
  },
) {
  return async (dispatch: Dispatch) => {
    try {
      const response = await api.auth.accessLevel(token);
      const {
        id,
        is_manager,
        is_consumer,
        is_franchisor,
        role,
        name,
        username,
      } = response.data;
      if (!is_manager && !is_franchisor && is_consumer) {
        dispatch(errorLogin());
      }

      dispatch(
        setLogin({
          username,
          token,
          is_manager,
          is_consumer,
          is_franchisor,
          role,
          name,
        }),
      );
      try {
        Sentry.configureScope((scope) => {
          scope.setUser({ email: username });
        });
        if (is_manager || is_franchisor) {
          segmentIdentify({
            userId: id,
            userTraits: {
              email: username,
              manager: is_manager,
              is_franchisor,
              name,
            },
          });
        }
      } catch (err) {
        console.error(err);
      }
      WidgetUtils.DEPRECATEDonLoginSuccess(username);
      WidgetUtils.sendBridgeResponse(
        WidgetMessageType.RESPONSE_AUTHENTICATED_STATUS,
        {
          authenticated: true,
          username,
        },
      );
      if (options && options?.goNext) {
        options.goNext();
      } else if (options && options.company) {
        dispatch(push(`/c/membership-validator/${options.company}/`));
      }
    } catch (err) {
      if (!err.status) {
        dispatch(networkError(err));
      } else {
        dispatch(errorLogin());
      }
    }
    if (options && options.onDone) options.onDone();
  };
}

export function fetchAccessLevelWithoutConnect(
  token: string,
  storingKey: 'previous' | 'current',
  options: ?{
    next: ?ThunkAction,
  },
) {
  return async (dispatch: Dispatch) => {
    try {
      const response = await api.auth.accessLevel(token);
      const { is_manager, is_consumer, is_franchisor, role, name, username } =
        response.data;

      dispatch({
        type: types.CHECK_ACCESS_LEVEL,
        payload: {
          storingKey,
          is_manager,
          is_consumer,
          is_franchisor,
          role,
          name,
          username,
        },
      });

      if (typeof options?.onSuccess === 'function') {
        options?.onSuccess();
      }
    } catch (err) {
      if (!err.status) {
        dispatch(networkError(err));
      } else {
        dispatch(errorLogin());
      }
    }
    if (options && options.onDone) options.onDone();
  };
}

export function requestLogin(
  username: string,
  password: string,
  options: ?{
    company: string,
    goNext?: (values: {
      is_manager: Boolean,
      is_consumer: Boolean,
      is_franchisor: Boolean,
    }) => ThunkAction,
    onDone: ?() => void,
  },
) {
  return async (dispatch: Dispatch) => {
    dispatch(initiatedLogin(username));

    try {
      const response = await api.auth.login(username, password);
      const { token } = response.data;

      if (!token) {
        throw new Error('No token');
      }
      dispatch(fetchAccessLevel(token, options));
    } catch (err) {
      dispatch(
        errorLogin({
          email:
            err.response &&
            err.response.data &&
            err.response.data.errors &&
            err.response.data.errors.email,
          password:
            err.response &&
            err.response.data &&
            err.response.data.errors &&
            err.response.data.errors.password,
        }),
      );
      if (!err.status) {
        console.error(err);
        dispatch(networkError(err));
      }
    }
  };
}

export function checkEmailExistsLoading(loading: boolean) {
  return { type: types.CHECK_EMAIL_EXISTS_LOADING, loading };
}

export function checkEmailExistsError(error: ?Error) {
  return { type: types.CHECK_EMAIL_EXISTS_ERROR, error };
}

export function checkEmailExistsSuccess(exists: boolean) {
  return { type: types.CHECK_EMAIL_EXISTS_SUCCESS, exists };
}

export function checkEmailExists(email: string, options: OptionCallback) {
  return async (dispatch: Dispatch) => {
    dispatch(checkEmailExistsLoading(true));
    try {
      const response = await api.auth.checkEmailExists(email);
      dispatch(checkEmailExistsSuccess(response.data.exists));
      if (options && options.onSuccess) options.onSuccess();
    } catch (error) {
      dispatch(checkEmailExistsError(error));
      dispatch(checkEmailExistsSuccess(false));
      if (options && options.onError) options.onError();
    }
    dispatch(checkEmailExistsLoading(false));
  };
}

export function setLogin({
  username,
  token,
  is_manager,
  is_consumer,
  is_franchisor,
  role,
  name,
}: {
  username: string,
  token: string,
  is_manager: boolean,
  is_consumer: boolean,
  is_franchisor: boolean,
  role: number,
  name: string,
}) {
  return {
    type: types.LOGIN_SUCCESSFUL,
    username,
    name: name || '',
    token,
    role,
    is_manager,
    is_coach: false,
    is_consumer,
    is_franchisor,
  };
}

function isLoadingResetLogin(payload) {
  return { type: types.PASSWORD_RESET_LOADING, payload };
}

function errorResetLogin(payload) {
  return { type: types.PASSWORD_RESET_ERROR, payload };
}

function resetPasswordSent(payload) {
  return { type: types.RESET_PASSWORD_SENT, payload };
}

export function resetPassword(email: string, options: any) {
  return async (dispatch: Dispatch) => {
    dispatch(errorResetLogin(null));
    dispatch(isLoadingResetLogin(true));
    try {
      const response = await api.auth.resetPassword(email);
      dispatch(resetPasswordSent(response.data));
      if (options && options.onSuccess) options.onSuccess();
    } catch (err) {
      dispatch(errorResetLogin(err));
      if (options && options.onError) options.onError();
    }
    dispatch(isLoadingResetLogin(false));
  };
}

export function errorLogin(
  invalidFields: ?{ email: ?string, password: ?string },
) {
  return { type: types.LOGIN_FAILED, invalidFields };
}

export function initiatedLogin(username: string) {
  return { type: types.LOGIN_INITIATED, username };
}

export function disconnect(callback: ?() => void) {
  return async (dispatch: Dispatch) => {
    try {
      Sentry.configureScope((scope) => {
        scope.setUser({ email: '' });
      });
    } catch (err) {
      console.error(err);
    }

    dispatch((() => ({ type: types.DISCONNECT }))());
    if (callback && typeof callback === 'function') callback();
  };
}

export function signup(
  data: any,
  options: ?{ goNext: ?ThunkAction, onDone: ?() => void },
) {
  return async (dispatch: Dispatch) => {
    try {
      const response = await api.auth.signup(data);
      if (response && response.status === 201) {
        return dispatch(requestLogin(data.email, data.password, options));
      }
      if (
        response &&
        response.status === 200 &&
        response.data &&
        response.data.error_code === USER_EMAIL_EXISTS
      ) {
        dispatch(snackbarError('signup.emailAlreadyExists'));
      }
    } catch (err) {
      dispatch(snackbarError('signup.failedCreation'));
    }
    return dispatch(errorLogin());
  };
}

export function signupV2(
  formaData: any,
  options: ?{
    next?: (values: {
      is_manager: Boolean,
      is_consumer: Boolean,
      is_franchisor: Boolean,
    }) => ThunkAction,
    onDone: ?() => void,
    onError?: () => void,
  },
) {
  return async (dispatch: Dispatch) => {
    try {
      const response = await api.auth.signup(formaData);
      if (response && response.status === 201) {
        return dispatch(
          requestLogin(
            formaData.get('email'),
            formaData.get('password'),
            options,
          ),
        );
      }
      if (
        response &&
        response.status === 200 &&
        response.data &&
        response.data.error_code === USER_EMAIL_EXISTS
      ) {
        dispatch(snackbarError('signup.emailAlreadyExists'));
        if (options && options.onError) {
          options.onError();
        }
      }
    } catch (err) {
      dispatch(snackbarError('signup.failedCreation'));
      if (options && options.onError) {
        options.onError();
      }
    }
    return dispatch(errorLogin());
  };
}

export function impersonateManagerLoading(loading: boolean) {
  return { type: types.IMPERSONATE_MANAGER_LOADING, loading };
}

export function navigateAsCompanyAdmin(
  companyId: number,
  url?: string,
  options: OptionCallback,
) {
  return async (dispatch: Dispatch) => {
    try {
      dispatch(impersonateManagerLoading(true));
      const franchiseConnexionToken = getAuthToken();

      const response = await api.auth.impersonateAdmin({
        token: franchiseConnexionToken,
        companyId,
      });

      const newToken = response.data.token;

      if (!newToken) {
        throw new Error('No token');
      }
      const storage = window.localStorage;
      storage.setItem('bsport:franchise:http:token', franchiseConnexionToken);

      const {
        data: {
          id,
          is_manager,
          is_consumer,
          is_franchisor,
          role,
          name,
          username,
        },
      } = await api.auth.accessLevel(newToken);

      dispatch((() => ({ type: types.RESET_STORE }))());

      // Set new access level
      await dispatch(
        setLogin({
          id,
          username,
          token: newToken,
          is_manager,
          is_consumer,
          is_franchisor,
          role,
          name,
        }),
      );

      dispatch(impersonateManagerLoading(false));
      if (url) {
        dispatch(push(url));
      }

      if (typeof options?.onSuccess === 'function') {
        options?.onSuccess();
      }
      return;
    } catch (err) {
      // Disconnect to avoid users stuck in a loop
      dispatch((() => ({ type: types.DISCONNECT }))());

      dispatch(snackbarError('signup.changeWorkspaceError'));
      options?.onError();
      dispatch(errorLogin());
    }
  };
}

export function navigateBackToFranchise() {
  return async (dispatch: Dispatch) => {
    try {
      dispatch(impersonateManagerLoading(true));

      const storage = window.localStorage;
      const newToken = storage.getItem('bsport:franchise:http:token');

      const {
        data: { is_manager, is_consumer, is_franchisor, role, name, username },
      } = await api.auth.accessLevel(newToken);

      storage.removeItem('bsport:franchise:http:token');
      dispatch((() => ({ type: types.RESET_STORE }))());

      // Set new access level
      await dispatch(
        setLogin({
          username,
          token: newToken,
          is_manager,
          is_consumer,
          is_franchisor,
          role,
          name,
        }),
      );

      dispatch(impersonateManagerLoading(false));

      return;
    } catch (err) {
      // Disconnect to avoid users stuck in a loop
      dispatch((() => ({ type: types.DISCONNECT }))());

      dispatch(snackbarError('signup.changeWorkspaceError'));
      dispatch(errorLogin());
    }
  };
}
