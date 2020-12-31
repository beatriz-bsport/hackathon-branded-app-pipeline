import Immutable from 'seamless-immutable';

import { setAuthToken } from '../http';
import actionTypes from '../actions/auth.types';

const initialState = Immutable({
  username: '',
  token: '',
  authenticated: false,
  error: false,
  loading: false,
  is_manager: false,
  is_coach: false,
  is_consumer: true,
  initializating: false,
  invalidFields: null,
  emailExists: {
    loading: false,
    error: null,
    exists: false,
  },
  resetPassword: {
    loading: false,
    error: null,
    last_password_reset_request: null,
  },
});

export default function authReducer(state = initialState, action = {}) {
  switch (action.type) {
    case 'initiate':
      return state.set('initializating', action.payload);
    case actionTypes.DISCONNECT:
      setAuthToken(null);
      return initialState;

    case actionTypes.LOGIN_INITIATED:
      return state
        .set('username', action.username)
        .set('loading', true)
        .set('error', false);

    case actionTypes.PASSWORD_RESET_LOADING:
      return state.setIn(['resetPassword', 'loading'], action.payload);

    case actionTypes.PASSWORD_RESET_ERROR:
      return state.setIn(['resetPassword', 'error'], action.payload);
    case actionTypes.RESET_PASSWORD_SENT:
      return state.setIn(
        ['resetPassword', 'last_password_reset_request'],
        action.payload.last_password_reset_request,
      );
    case actionTypes.LOGIN_SUCCESSFUL: {
      const {
        username,
        token,
        is_manager,
        is_coach,
        is_consumer,
        role,
        name,
      } = action;
      setAuthToken(token);
      return state
        .set('username', username)
        .set('token', token)
        .set('name', name || '')
        .set('is_manager', is_manager)
        .set('is_coach', is_coach)
        .set('is_consumer', is_consumer)
        .set('authenticated', true)
        .set('error', false)
        .set('loading', false)
        .set('role', role);
    }

    case actionTypes.LOGIN_FAILED:
      return state
        .set('username', '')
        .set('token', '')
        .set('authenticated', false)
        .set('error', true)
        .set('invalidFields', action.invalidFields)
        .set('loading', false);

    case actionTypes.CHECK_EMAIL_EXISTS_LOADING:
      return state.setIn(['emailExists', 'loading'], action.loading);
    case actionTypes.CHECK_EMAIL_EXISTS_ERROR:
      return state.setIn(['emailExists', 'error'], action.error);
    case actionTypes.CHECK_EMAIL_EXISTS_SUCCESS:
      return state.setIn(['emailExists', 'exists'], action.exists);
    default:
      return state;
  }
}
