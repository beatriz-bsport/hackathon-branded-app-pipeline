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
        // @ts-expect-error
        id: payload.uuid,
        // @ts-expect-error
        title: payload.title,
        // @ts-expect-error
        message: payload.message,
        // @ts-expect-error
        link: payload.link,
        // @ts-expect-error
        displayMode: payload.displayMode,
        // @ts-expect-error
        actionMode: payload.actionMode,
        // @ts-expect-error
        customDialogComponent: payload.customDialogComponent,
      });
      return state.merge({ messages });
    },
    [backgroundDialogDestroy.toString()]: (state, { payload }) => {
      const messages = state.messages.asMutable();
      // @ts-expect-error
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
