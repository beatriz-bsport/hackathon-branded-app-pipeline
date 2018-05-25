import Immutable from 'seamless-immutable';

import actionTypes from '../actions/auth.types';

const initialState = Immutable({
  username: '',
  authenticated: false,
});

export default function authReducer(state = initialState, action = {}) {
  switch (action.type) {
    case actionTypes.DISCONNECT:
      return initialState;

    default:
      return state;
  }
}
