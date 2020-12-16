// @flow

import { getCookie } from './http.ts';

import { fetchAccessLevel, initiateInterface } from './actions/auth.actions';

export function initLoginFromCookie(store) {
  store.dispatch(initiateInterface(true));
  const token = getCookie('auth_token');
  if (token) {
    return store.dispatch(
      fetchAccessLevel(token, null, {
        onDone: () => {
          store.dispatch(initiateInterface(false));
        },
      }),
    );
  }
  return store.dispatch(initiateInterface(false));
}
