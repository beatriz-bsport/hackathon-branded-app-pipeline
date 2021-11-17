import Immutable from 'seamless-immutable';
import { handleActions } from 'redux-actions';

import {
  snackbarDisplay,
  snackbarDestroy,
  backgroundSnackbarDestroy,
  backgroundSnackbarDisplay,
} from './actions';
import { SnackbarState } from './types';

const initialState: Immutable.Immutable<SnackbarState> = Immutable({
  messages: [],
  backgroundMessages: [],
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
    [backgroundSnackbarDisplay]: (state, { payload }) => {
      const backgroundMessages = state.backgroundMessages.asMutable();
      backgroundMessages.push({
        backgroundMessage: payload.backgroundMessage,
        uuid: payload.uuid,
        kind: payload.kind,
      });
      return state.merge({ backgroundMessages });
    },
    [backgroundSnackbarDestroy]: (state, { payload }) => {
      const backgroundMessages = state.backgroundMessages.asMutable();
      const pos = backgroundMessages.findIndex((k) => k.uuid === payload);
      if (pos === -1) {
        return state;
      }
      backgroundMessages.splice(pos, 1);
      return state.merge({ backgroundMessages: backgroundMessages || [] });
    },
  },
  initialState,
);
