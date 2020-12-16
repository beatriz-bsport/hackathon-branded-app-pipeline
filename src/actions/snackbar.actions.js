// @flow

import { createAction } from 'redux-actions';
import type { SnackKind, BackgroundSnackKind } from '../libs/snackbar/types';
import type { Dispatch } from '../state/types.ts';

export const snackbarDisplay = createAction('SNACKBAR/DISPLAY');
export const snackbarDestroy = createAction('SNACKBAR/DESTROY');

function sleep(time: number) {
  return new Promise((resolve) => {
    setTimeout(resolve, time);
  });
}

const id = 0;
export function displaySnackbar(kind: SnackKind) {
  return (message: string) => async (dispatch: Dispatch) => {
    const myId = id + 1;
    dispatch(snackbarDisplay({ id: myId, message, kind }));
    await sleep(5000);
    dispatch(snackbarDestroy(myId));
  };
}

export function deleteSnackbar(snackbarId: number) {
  return async (dispatch: Dispatch) => {
    dispatch(snackbarDestroy(snackbarId));
  };
}

export const snackbarSuccess = displaySnackbar('success');
export const snackbarError = displaySnackbar('error');
export const snackbarInfo = displaySnackbar('info');
export const snackbarWarning = displaySnackbar('warning');

export const snackbar = {
  success: snackbarSuccess,
  error: snackbarError,
  info: snackbarInfo,
  warning: snackbarWarning,
};

export const backgroundSnackbarDestroy = createAction(
  'BACKGROUND_SNACKBAR/DESTROY',
);
export const backgroundSnackbarDisplay = createAction(
  'BACKGROUND_SNACKBAR/DISPLAY',
);

export function pendingBackgroundSnackbar(
  uuid: string,
  backgroundMessage: string,
) {
  return async (dispatch: Dispatch) => {
    dispatch(
      backgroundSnackbarDisplay({
        uuid,
        backgroundMessage,
        kind: 'pending',
      }),
    );
  };
}

export function displayBackgroundSnackbar(kind: BackgroundSnackKind) {
  return (uuid: string, backgroundMessage: string) => async (
    dispatch: Dispatch,
  ) => {
    dispatch(backgroundSnackbarDisplay({ uuid, backgroundMessage, kind }));
    await sleep(5000);
    dispatch(backgroundSnackbarDestroy(uuid));
  };
}

export function deleteBackgroundSnackbar(uuid: string) {
  return async (dispatch: Dispatch) => {
    dispatch(backgroundSnackbarDestroy(uuid));
  };
}

export const backgroundSnackbarSuccess = displayBackgroundSnackbar('success');
export const backgroundSnackbarError = displayBackgroundSnackbar('error');
export const backgroundSnackbarWarning = displayBackgroundSnackbar('warning');
