import api from '../api';
import types from './auth.types';

export function profileUpdated() {
  // return { email, firstname, lastname, type: types.PROFILE_UPDATED };
  return { type: types.PROFILE_UPDATED };
}
export function updateProfile({ email, firstname, lastname }) {
  return async (dispatch) => {
    // TODO update firstname email and lastname in reducer
    await api.auth.updateProfile({
      email,
      first_name: firstname,
      last_name: lastname,
    });
    dispatch(profileUpdated());
  };
}

export function signUpPhone({ phone, code }) {
  return async (dispatch) => {
    dispatch(validatePhone({ phone, code }));
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
        debugger;
        dispatch(errorLogin());
      }
    } catch (err) {
      debugger;
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
        debugger;
        dispatch(errorLogin());
      }
    } catch (err) {
      debugger;
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
