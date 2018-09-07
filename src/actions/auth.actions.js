import api from '../api';
import types from './auth.types';

export function updateProfile({ email, firstname, lastname }) {
  console.log({ email, firstname, lastname });
  // TODO update firstname email and lastname
  api.auth.updateProfile({ email });
  return { email, firstname, lastname, type: types.PROFILE_UPDATED };
}

export function signUpPhone({ phone, code, email, firstname, lastname }) {
  return async (dispatch) => {
    dispatch(validatePhone({ phone, code }));
    dispatch(updateProfile({ email, firstname, lastname }));
  };
}

export function validatePhone({ phone, code }) {
  return async (dispatch) => {
    dispatch(initiatedLogin(phone));
    try {
      const response = await api.auth.validatePhone(phone, code);
      const { token } = response.data;

      const response_ = await api.auth.accessLevel(token);
      const { is_manager, is_coach, is_consumer } = response_.data;

      if (token) {
        dispatch(
          setLogin({
            username: phone,
            token,
            is_manager,
            is_coach,
            is_consumer,
          }),
        );
      } else {
        dispatch(errorLogin());
      }
    } catch (err) {
      dispatch(errorLogin());
    }
  };
}

export function requestLogin(username, password) {
  return async (dispatch) => {
    dispatch(initiatedLogin(username));

    try {
      const response = await api.auth.login(username, password);
      const { token } = response.data;

      const response_ = await api.auth.accessLevel(token);
      const { is_manager, is_coach, is_consumer } = response_.data;

      if (token) {
        dispatch(
          setLogin({
            username,
            token,
            is_manager,
            is_coach,
            is_consumer,
          }),
        );
      } else {
        dispatch(errorLogin());
      }
    } catch (err) {
      dispatch(errorLogin());
    }
  };
}

export function setLogin({
  username,
  token,
  is_manager,
  is_coach,
  is_consumer,
}) {
  return {
    type: types.LOGIN_SUCCESSFUL,
    username,
    token,
    is_manager,
    is_coach,
    is_consumer,
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

    alert(`response : ${JSON.stringify(response)}`);

    const json = await response.json();
    return json;
  } catch (e) {
    alert(`error : ${JSON.stringify(e)}`);
  }
}
