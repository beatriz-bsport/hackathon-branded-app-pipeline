import { Record } from 'immutable';

import actionTypes from '../actions/auth.types';

const initialState = new (Record({
  username: '',
  authenticated: false,
}))();

export default function authReducer(state = initialState, action = {}) {
  switch (action.type) {
    case actionTypes.DISCONNECT:
      return initialState;

    default:
      return state;
  }
}
