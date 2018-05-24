import types from './auth.types';

export function requestLogin({ username, password }) {
  return { type: types.LOGIN, username, password };
}

export function disconnect() {
  return { type: types.DISCONNECT };
}

