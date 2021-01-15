// @flow

import * as Sentry from '@sentry/browser';
import { push } from 'connected-react-router';
import { createAction } from 'redux-actions';

import api from '../api';
import types from './auth.types';
import type { Dispatch, ThunkAction } from '../state/types';

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
  username: string,
  options: ?{ company: string, next: ?ThunkAction, onDone: ?() => void },
) {
  return async (dispatch: Dispatch) => {
    try {
      const response = await api.auth.accessLevel(token);
      const { is_manager, is_consumer, role, name } = response.data;

      if (!is_manager && is_consumer) {
        dispatch(errorLogin());
      }
      dispatch(
        setLogin({
          username,
          token,
          is_manager,
          is_consumer,
          role,
          name,
        }),
      );
      if (options && options.next) {
        dispatch(push(options.next));
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

export function requestLogin(
  username: string,
  password: string,
  options: ?{ company: string, next: ?ThunkAction, onDone: ?() => void },
) {
  return async (dispatch: Dispatch) => {
    dispatch(initiatedLogin(username));

    try {
      const response = await api.auth.login(username, password);
      const { token } = response.data;

      if (!token) {
        throw new Error('No token');
      }
      dispatch(fetchAccessLevel(token, username, options));
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

export function checkEmailExists(email: string) {
  return async (dispatch: Dispatch) => {
    dispatch(checkEmailExistsLoading(true));
    try {
      const response = await api.auth.checkEmailExists(email);
      dispatch(checkEmailExistsSuccess(response.data.exists));
    } catch (error) {
      dispatch(checkEmailExistsError(error));
      dispatch(checkEmailExistsSuccess(false));
    }
    dispatch(checkEmailExistsLoading(false));
  };
}

export function setLogin({
  username,
  token,
  is_manager,
  is_consumer,
  role,
  name,
}: {
  username: string,
  token: string,
  is_manager: boolean,
  is_consumer: boolean,
  role: number,
  name: string,
}) {
  try {
    Sentry.configureScope((scope) => {
      scope.setUser({ email: username });
    });
  } catch (err) {
    console.error(err);
  }
  return {
    type: types.LOGIN_SUCCESSFUL,
    username,
    name: name || '',
    token,
    role,
    is_manager,
    is_coach: false,
    is_consumer,
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
  options: ?{ next: ?ThunkAction, onDone: ?() => void },
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
        response.data.message
      ) {
        alert(response.data.message);
      }
    } catch (err) {
      /* eslint-disable */
      alert(
        "Impossible de créer votre compte pour le moment, veuillez réessayer d'ici quelques minutes",
      );
      /* eslint-enable */
    }
    return dispatch(errorLogin());
  };
}
