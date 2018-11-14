// @flow

import Immutable from 'seamless-immutable';
import { handleActions } from 'redux-actions';

import { snackbarDisplay, snackbarDestroy } from '../actions/snackbar.actions';

const initialState = Immutable({
  messages: [],
});

export default handleActions(
  {
    [snackbarDisplay]: (state, { payload }) => {
      const messages = state.messages.asMutable();
      messages.push({
        message: payload.message,
        id: payload.id,
        kind: payload.kind,
      });
      return state.merge({ messages });
    },

    [snackbarDestroy]: (state, { payload }) => {
      const messages = state.messages.asMutable();
      const pos = messages.findIndex((k) => k.id === payload);
      if (pos === -1) {
        return state;
      }
      messages.splice(pos, 1);
      return state.merge({ messages: messages || [] });
    },
  },
  initialState,
);
