// @flow

import { createAction } from 'redux-actions';
import { fetchBackgroundTask as fetchBackgroundTaskAPI } from './api';
import type { State, Dispatch, OptionCallback } from '../../state/types';
import {
  pendingBackgroundSnackbar,
  deleteBackgroundSnackbar,
  backgroundSnackbarSuccess,
  backgroundSnackbarError,
  backgroundSnackbarWarning,
} from '../snackbar/actions';

const BACKGROUND_TASK_STATUS_CODE_PENDING = 0;
const BACKGROUND_TASK_STATUS_CODE_SUCCESS = 1;
const BACKGROUND_TASK_STATUS_CODE_FAILED = 2;

const TIMEOUTS = [
  1, 3, 6, 15, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10,
  10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10,
  10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10,
  10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10,
  10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10,
  10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10,
  27, 60, 180,
];
const MAX_RETRY = 3;
// in seconds
const FETCH_RETRY_DELAY = 3;
let fetchFailedCounter = 0;

export const backgroundTaskDetail = {
  isLoading: createAction('BACKGROUND_TASK/DETAIL/LOADING'),
  error: createAction('BACKGROUND_TASK/DETAIL/ERROR'),
  success: createAction('BACKGROUND_TASK/DETAIL/SUCCESS'),
};

export function fetchBackgroundTask(uuid: string) {
  return async (dispatch: Dispatch) => {
    dispatch(backgroundTaskDetail.isLoading(true));
    dispatch(backgroundTaskDetail.error(null));

    try {
      const response = await fetchBackgroundTaskAPI(uuid);
      dispatch(backgroundTaskDetail.success(response.data));
    } catch (err) {
      console.error(err);
      dispatch(backgroundTaskDetail.error(err));
      fetchFailedCounter += 1;
    }
    dispatch(backgroundTaskDetail.isLoading(false));
  };
}

export function monitorBackgroundTask(uuid: string, options?: OptionCallback) {
  return (dispatch: Dispatch, getState: () => State) => {
    fetchFailedCounter = 0;
    dispatch(pendingBackgroundSnackbar(uuid, 'background.pending'));
    // The param 0 represents the current timeout index
    checkFetchSetTimeoutRecursive(dispatch, getState, 0, uuid, options);
  };
}

const checkFetchSetTimeoutRecursive = async (
  dispatch,
  getState,
  timeout_index,
  uuid,
  options,
) => {
  if (timeout_index >= TIMEOUTS.length) {
    dispatch(deleteBackgroundSnackbar(uuid));
    dispatch(backgroundSnackbarWarning(uuid, 'background.timeout'));
    return;
  }
  if (fetchFailedCounter >= MAX_RETRY) {
    dispatch(deleteBackgroundSnackbar(uuid));
    dispatch(backgroundSnackbarError(uuid, 'background.cannotFetch'));
    return;
  }
  await fetchBackgroundTask(uuid)(dispatch);
  if (
    uuid in getState().backgroundTask.byUuid &&
    getState().backgroundTask.byUuid[uuid].status !==
      BACKGROUND_TASK_STATUS_CODE_PENDING
  ) {
    dispatch(deleteBackgroundSnackbar(uuid));
    if (
      getState().backgroundTask.byUuid[uuid].status ===
      BACKGROUND_TASK_STATUS_CODE_SUCCESS
    ) {
      dispatch(backgroundSnackbarSuccess(uuid, 'background.success'));
      if (options && options.onSuccess) options.onSuccess();
    } else if (
      getState().backgroundTask.byUuid[uuid].status ===
      BACKGROUND_TASK_STATUS_CODE_FAILED
    ) {
      dispatch(backgroundSnackbarError(uuid, 'background.error'));
      if (options && options.onError) options.onError();
    }
  } else {
    setTimeout(
      () =>
        checkFetchSetTimeoutRecursive(
          dispatch,
          getState,
          timeout_index + 1,
          uuid,
          options,
        ),
      fetchFailedCounter > 0
        ? FETCH_RETRY_DELAY * 1000
        : TIMEOUTS[timeout_index] * 1000,
    );
    // If an error occurs during fetch, we retry every FETCH_RETRY_DELAY seconds
    // until the MAX_RETRY limit is reached
  }
};
