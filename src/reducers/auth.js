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
});

export default function authReducer(state = initialState, action = {}) {
  switch (action.type) {
    case 'initiate':
      return state.set('initializating', action.payload);
    case actionTypes.DISCONNECT:
      return initialState;

    case actionTypes.LOGIN_INITIATED:
      return Immutable.merge(state, {
        username: action.username,
        loading: true,
        error: false,
      });

    case actionTypes.LOGIN_SUCCESSFUL: {
      const { username, token, is_manager, is_coach, is_consumer } = action;
      setAuthToken(token);
      return Immutable.merge(state, {
        username,
        token,
        is_manager,
        is_coach,
        is_consumer,
        authenticated: true,
        error: false,
        loading: false,
      });
    }

    case actionTypes.LOGIN_FAILED:
      return Immutable.merge(state, {
        username: '',
        token: '',
        authenticated: false,
        error: true,
        loading: false,
      });

    default:
      return state;
  }
}
