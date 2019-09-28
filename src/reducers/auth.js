import Immutable from 'seamless-immutable';

import { setAuthToken } from '../http';
import actionTypes from '../actions/auth.types';

const initialState = Immutable({
  username: '',
  token: '',
  authenticated: false,
  error: false,
  loading: false,
  is_manager: true,
  is_coach: false,
  is_consumer: true,
  initializating: false,
  invalidFields: null,
  emailExists: {
    loading: false,
    error: null,
    exists: false,
  },
});

export default function authReducer(state = initialState, action = {}) {
  switch (action.type) {
    case 'initiate':
      return state.set('initializating', action.payload);
    case actionTypes.DISCONNECT:
      return initialState;

    case actionTypes.LOGIN_INITIATED:
      return state
        .set('username', action.username)
        .set('loading', true)
        .set('error', false);

    case actionTypes.LOGIN_SUCCESSFUL: {
      const {
        username,
        token,
        is_manager,
        is_coach,
        is_consumer,
        role,
      } = action;
      setAuthToken(token);
      return state
        .set('username', username)
        .set('token', token)
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
