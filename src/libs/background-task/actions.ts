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
import { BackgroundTask } from './types';

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
    let response = null;
    try {
      response = await fetchBackgroundTaskAPI(uuid);
      dispatch(backgroundTaskDetail.success(response.data));
    } catch (err) {
      console.error(err);
      dispatch(backgroundTaskDetail.error(err));
      fetchFailedCounter += 1;
    }
    dispatch(backgroundTaskDetail.isLoading(false));
    return response;
  };
}

export function monitorBackgroundTask<ReturnedValue>(
  uuid: string,
  options?: OptionCallback<BackgroundTask<ReturnedValue>>,
  hideBackgroundTaskSnackbar: boolean = false,
) {
  return (dispatch: Dispatch, getState: () => State) => {
    fetchFailedCounter = 0;
    if (!hideBackgroundTaskSnackbar)
      dispatch(pendingBackgroundSnackbar(uuid, 'background.pending'));
    // The param 0 represents the current timeout index
    checkFetchSetTimeoutRecursive(
      dispatch,
      getState,
      0,
      uuid,
      options,
      hideBackgroundTaskSnackbar,
    );
  };
}

const checkFetchSetTimeoutRecursive = async (
  dispatch: Dispatch,
  getState: () => State,
  timeout_index: number,
  uuid: string,
  options: OptionCallback<BackgroundTask>,
  hideBackgroundTaskSnackbar: boolean = false,
) => {
  if (timeout_index >= TIMEOUTS.length) {
    if (!hideBackgroundTaskSnackbar) {
      dispatch(deleteBackgroundSnackbar(uuid));
      dispatch(backgroundSnackbarWarning(uuid, 'background.timeout'));
    }
    return;
  }
  if (fetchFailedCounter >= MAX_RETRY) {
    if (!hideBackgroundTaskSnackbar) {
      dispatch(deleteBackgroundSnackbar(uuid));
      dispatch(backgroundSnackbarError(uuid, 'background.cannotFetch'));
    }
    return;
  }
  await fetchBackgroundTask(uuid)(dispatch);

  const data = getState().backgroundTask.byUuid[uuid] || ({} as BackgroundTask);

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
      !hideBackgroundTaskSnackbar &&
        dispatch(backgroundSnackbarSuccess(uuid, 'background.success'));
      if (options && options.onSuccess) options.onSuccess(data);
    } else if (
      getState().backgroundTask.byUuid[uuid].status ===
      BACKGROUND_TASK_STATUS_CODE_FAILED
    ) {
      !hideBackgroundTaskSnackbar &&
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
          hideBackgroundTaskSnackbar,
        ),
      fetchFailedCounter > 0
        ? FETCH_RETRY_DELAY * 1000
        : TIMEOUTS[timeout_index] * 1000,
    );
    // If an error occurs during fetch, we retry every FETCH_RETRY_DELAY seconds
    // until the MAX_RETRY limit is reached
  }
};
