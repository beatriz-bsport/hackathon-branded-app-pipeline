// @flow

import { createAction } from 'redux-actions';

export const snackbarDisplay = createAction('SNACKBAR/DISPLAY');
export const snackbarDestroy = createAction('SNACKBAR/DESTROY');

function sleep(time) {
  return new Promise((resolve) => {
    setTimeout(resolve, time);
  });
}

const id = 0;
export function displaySnackbar(kind) {
  return (message) => async (dispatch) => {
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
