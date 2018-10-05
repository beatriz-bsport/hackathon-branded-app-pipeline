// @flow

import Immutable from 'seamless-immutable';

import actionTypes from '../actions/snackbar.types';

const initialState = Immutable({
  messages: [],
});

export default function snackbarReducer(state = initialState, action = {}) {
  switch (action.type) {
    case actionTypes.SNACKBAR_DISPLAY: {
      const messages = state.messages.asMutable();
      messages.push({
        message: action.message,
        id: action.id,
        kind: action.kind,
      });
      return state.merge({ messages });
    }

    case actionTypes.SNACKBAR_DESTROY: {
      const messages = state.messages.asMutable();
      const pos = messages.findIndex((k) => k.id === action.id);
      if (pos === -1) {
        return state;
      }
      messages.splice(pos, pos);
      return state.merge({ messages: messages ? messages : [] });
    }

    default:
      return state;
  }
}
