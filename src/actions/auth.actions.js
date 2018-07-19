import { post, get } from '../http';
import axios from 'axios';
import api from '../api';
import types from './auth.types';

export function requestLogin(username, password) {
  return async (dispatch) => {
    dispatch(initiatedLogin(username));

    try {
      const response = await api.auth.login(username, password);
      const { token } = response.data;

      const response_ = await api.auth.accessLevel(token);
      console.log(response_.data);
      const { is_manager, is_coach } = response_.data;

      if (token) {
        dispatch(setLogin({ username, password, token, is_manager, is_coach }));
      } else {
        dispatch(errorLogin());
      }
    } catch (err) {
      dispatch(errorLogin());
    }
  };
}

export function setLogin({ username, password, token, is_manager, is_coach }) {
  return {
    type: types.LOGIN_SUCCESSFUL,
    username,
    password,
    token,
    is_manager,
    is_coach,
  };
}

export function resetPassword(email) {
  api.auth.resetPassword(email);
  return { type: types.PASSWORD_RESET };
}

export function errorLogin() {
  return { type: types.LOGIN_FAILED };
}

export function initiatedLogin(username) {
  return { type: types.LOGIN_INITIATED, username };
}

export function disconnect() {
  return { type: types.DISCONNECT };
}

export async function fpost(uri: string, data: Object, headers: Object) {
  const baseHeaders = {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  };

  try {
    const response = fetch(uri, {
      method: 'POST',
      headers: Object.assign(baseHeaders, headers),
      body: JSON.stringify(data),
    });

    alert('response : ' + JSON.stringify(response));

    const json = await response.json();
    return json;
  } catch (e) {
    alert('error : ' + JSON.stringify(e));
  }
}
