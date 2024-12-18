import Immutable from 'seamless-immutable';
import { handleActions } from 'redux-actions';

import {
  snackbarDisplay,
  snackbarDestroy,
  backgroundSnackbarDestroy,
  backgroundSnackbarDisplay,
  bottomSnackbarDisplay,
  bottomSnackbarDestroy,
  accessControlSnackBarDisplay,
  accessControlSnackBarDestroy,
} from './actions';
import {
  AccessControlSnack,
  BackgroundSnack,
  Snack,
  SnackbarState,
} from './types';

const getTopMessages = (state: Immutable.Immutable<SnackbarState>) =>
  state.topMessages.asMutable();

const getBottomMessages = (state: Immutable.Immutable<SnackbarState>) =>
  state.bottomMessages.asMutable();

const getBackgroundMessages = (state: Immutable.Immutable<SnackbarState>) =>
  state.backgroundMessages.asMutable();

const getAccessControlMessages = (state: Immutable.Immutable<SnackbarState>) =>
  state.accessControlMessages.asMutable();

const initialState: Immutable.Immutable<SnackbarState> = Immutable({
  topMessages: [],
  bottomMessages: [],
  backgroundMessages: [],
  accessControlMessages: [],
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
      const position = topMessages.findIndex((snack) => snack.id === payload);
      if (position === -1) {
        return state;
      }
      topMessages.splice(position, 1);
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
      const position = backgroundMessages.findIndex(
        (snack) => snack.uuid === payload,
      );
      if (position === -1) {
        return state;
      }
      backgroundMessages.splice(position, 1);
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
      const position = bottomMessages.findIndex(
        (snack) => snack.id === payload,
      );
      if (position === -1) {
        return state;
      }
      bottomMessages.splice(position, 1);
      return state.merge({ bottomMessages: bottomMessages || [] });
    },
    [accessControlSnackBarDisplay.toString()]: (
      state,
      { payload }: { payload: AccessControlSnack },
    ) => {
      const accessControlMessages = getAccessControlMessages(state);
      accessControlMessages.push(Immutable(payload));
      return state.merge({ accessControlMessages });
    },
    [accessControlSnackBarDestroy.toString()]: (
      state,
      { payload }: { payload: number },
    ) => {
      const accessControlMessages = getAccessControlMessages(state);
      const position = accessControlMessages.findIndex(
        (snack) => snack.id === payload,
      );
      if (position === -1) {
        return state;
      }
      accessControlMessages.splice(position, 1);
      return state.merge({
        accessControlMessages: accessControlMessages || [],
      });
    },
  },
  initialState,
);
