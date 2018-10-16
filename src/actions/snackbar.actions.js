// @flow

import types from './snackbar.types';

export function snackbarDisplay(message, id, kind = 'success') {
  return { type: types.SNACKBAR_DISPLAY, message, id, kind };
}

export function snackbarDestroy(id) {
  return { type: types.SNACKBAR_DESTROY, id };
}

function sleep(time) {
  return new Promise((resolve) => {
    setTimeout(resolve, time);
  });
}

const id = 0;
export function displaySnackbar(kind) {
  return (message) => async (dispatch) => {
    const myId = id + 1;
    dispatch(snackbarDisplay(message, myId, kind));
    await sleep(5000);
    dispatch(snackbarDestroy(myId));
  };
}

export const snackbarSuccess = displaySnackbar('success');
export const snackbarError = displaySnackbar('error');
export const snackbarInfo = displaySnackbar('info');
export const snackbarWarning = displaySnackbar('warning');
