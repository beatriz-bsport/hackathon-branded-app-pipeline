import Immutable from 'seamless-immutable';
import { handleActions } from 'redux-actions';

import {
  snackbarDisplay,
  snackbarDestroy,
  backgroundSnackbarDestroy,
  backgroundSnackbarDisplay,
  bottomSnackbarDisplay,
  bottomSnackbarDestroy,
} from './actions';
import { BackgroundSnack, Snack, SnackbarState } from './types';

const getTopMessages = (state: Immutable.Immutable<SnackbarState>) =>
  state.topMessages.asMutable();

const getBottomMessages = (state: Immutable.Immutable<SnackbarState>) =>
  state.bottomMessages.asMutable();

const getBackgroundMessages = (state: Immutable.Immutable<SnackbarState>) =>
  state.backgroundMessages.asMutable();

const initialState: Immutable.Immutable<SnackbarState> = Immutable({
  topMessages: [],
  bottomMessages: [],
  backgroundMessages: [],
});

export default handleActions<Immutable.Immutable<SnackbarState>, any>(
  {
    [snackbarDisplay.toString()]: (state, { payload }: { payload: Snack }) => {
      const topMessages = getTopMessages(state);
      topMessages.push(
        Immutable({
          message: payload.message,
          id: payload.id,
          kind: payload.kind,
        }),
      );
      return state.merge({ topMessages });
    },
    [snackbarDestroy.toString()]: (state, { payload }: { payload: number }) => {
      const topMessages = getTopMessages(state);
      const pos = topMessages.findIndex((k) => k.id === payload);
      if (pos === -1) {
        return state;
      }
      topMessages.splice(pos, 1);
      return state.merge({ topMessages: topMessages || [] });
    },
    [backgroundSnackbarDisplay.toString()]: (
      state,
      { payload }: { payload: BackgroundSnack },
    ) => {
      const backgroundMessages = getBackgroundMessages(state);
      backgroundMessages.push(
        Immutable({
          backgroundMessage: payload.backgroundMessage,
          uuid: payload.uuid,
          kind: payload.kind,
        }),
      );
      return state.merge({ backgroundMessages });
    },
    [backgroundSnackbarDestroy.toString()]: (
      state,
      { payload }: { payload: string },
    ) => {
      const backgroundMessages = getBackgroundMessages(state);
      const pos = backgroundMessages.findIndex((k) => k.uuid === payload);
      if (pos === -1) {
        return state;
      }
      backgroundMessages.splice(pos, 1);
      return state.merge({ backgroundMessages: backgroundMessages || [] });
    },
    [bottomSnackbarDisplay.toString()]: (
      state,
      { payload }: { payload: Snack },
    ) => {
      const bottomMessages = getBottomMessages(state);
      bottomMessages.push(Immutable(payload));
      return state.merge({ bottomMessages });
    },
    [bottomSnackbarDestroy.toString()]: (
      state,
      { payload }: { payload: number },
    ) => {
      const bottomMessages = getBottomMessages(state);
      const pos = bottomMessages.findIndex((k) => k.id === payload);
      if (pos === -1) {
        return state;
      }
      bottomMessages.splice(pos, 1);
      return state.merge({ bottomMessages: bottomMessages || [] });
    },
  },
  initialState,
);
