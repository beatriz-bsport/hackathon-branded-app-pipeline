// @flow

import { createAction } from 'redux-actions';
import type { SnackKind } from '../libs/snackbar/types';
import type { Dispatch } from '../state/types';

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
