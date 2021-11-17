import Immutable from 'seamless-immutable';
import { handleActions } from 'redux-actions';

import { backgroundDialogDisplay, backgroundDialogDestroy } from './actions';
import { BackgroundDialogState } from './types';

const initialState: Immutable.Immutable<BackgroundDialogState> = Immutable({
  messages: [],
});

export default handleActions(
  {
    [backgroundDialogDisplay.toString()]: (state, { payload }) => {
      const messages = state.messages.asMutable();
      messages.push({
        id: payload.uuid,
        title: payload.title,
        message: payload.message,
        link: payload.link,
      });
      return state.merge({ messages });
    },
    [backgroundDialogDestroy.toString()]: (state, { payload }) => {
      const messages = state.messages.asMutable();
      const pos = messages.findIndex((message) => message.id === payload);
      if (pos === -1) {
        return state;
      }
      messages.splice(pos, 1);
      return state.merge({ messages: messages || [] });
    },
  },
  initialState,
);
