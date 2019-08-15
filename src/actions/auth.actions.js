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

export function fetchAccessLevel(
  token: string,
  username: string,
  options: ?{ next: ?ThunkAction, onDone: ?() => void },
) {
  return async (dispatch: Dispatch) => {
    try {
      const response = await api.auth.accessLevel(token);
      const { is_manager, is_consumer, role } = response.data;

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
        }),
      );
      const next = options && options.next;
      if (next) dispatch(push(next));
    } catch (err) {
      dispatch(errorLogin());
    }
    if (options && options.onDone) options.onDone();
  };
}

export function requestLogin(
  username: string,
  password: string,
  options: ?{ next: ?ThunkAction, onDone: ?() => void },
) {
  return async (dispatch: Dispatch) => {
    dispatch(initiatedLogin(username));

    try {
      const response = await api.auth.login(username, password);
      const { token } = response.data;

      if (!token) {
        throw new Error('No token');
      }
      try {
        Sentry.configureScope((scope) => {
          scope.setUser({ email: username });
        });
      } catch (err) {
        console.error(err);
      }

      dispatch(fetchAccessLevel(token, username, options));
    } catch (err) {
      dispatch(errorLogin());
    }
  };
}

export function setLogin({
  username,
  token,
  is_manager,
  is_consumer,
  role,
}: {
  username: string,
  token: string,
  is_manager: boolean,
  is_consumer: boolean,
  role: number,
}) {
  return {
    type: types.LOGIN_SUCCESSFUL,
    username,
    token,
    role,
    is_manager,
    is_coach: false,
    is_consumer,
  };
}

export function resetPassword(email: string) {
  api.auth.resetPassword(email);
  return { type: types.PASSWORD_RESET };
}

export function errorLogin() {
  return { type: types.LOGIN_FAILED };
}

export function initiatedLogin(username: string) {
  return { type: types.LOGIN_INITIATED, username };
}

export function disconnect() {
  try {
    Sentry.configureScope((scope) => {
      scope.setUser({ email: '' });
    });
  } catch (err) {
    console.error(err);
  }

  return { type: types.DISCONNECT };
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
