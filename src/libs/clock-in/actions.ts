import { createAction } from 'redux-actions';

import { Dispatch, OptionCallback } from '../../state/types';
import { snackbarWarning } from '../snackbar/actions';

import {
  clockIn as clockInAPI,
  clockOut as clockOutAPI,
  editClockIn as editClockInAPI,
  deleteClockIn as deleteClockInAPI,
  fetchLastClockInList as fetchLastClockInListAPI,
  getStaffsAttendanceHistory as getStaffsAttendanceHistoryAPI,
  exportStaffAttendanceHistory as exportStaffAttendanceHistoryAPI,
} from './api';
import type { ClockInData, ClockInQueryParams } from './types';
import { displayBackgroundDialog } from '../background-dialog/actions';
import { monitorBackgroundTask } from '../background-task/actions';

import { isErrorWithCustomCode } from '#libs/utils';

export const retrieveLastClockInActions = {
  error: createAction('CLOCKIN/GET_LAST/ERROR'),
  loading: createAction('CLOCKIN/GET_LAST/IS_LOADING'),
  success: createAction('CLOCKIN/GET_LAST/SUCCESS'),
};

export const getLastClockin = ({ options }: { options?: OptionCallback }) => {
  return async (dispatch: Dispatch) => {
    dispatch(retrieveLastClockInActions.loading(true));
    dispatch(retrieveLastClockInActions.error(null));
    try {
      const response = await fetchLastClockInListAPI({});

      dispatch(
        // @ts-expect-error
        retrieveLastClockInActions.success(response.data?.results?.[0] ?? {}),
      );
      if (options && options.onSuccess) options.onSuccess();
    } catch (error) {
      console.error(error);
      dispatch(retrieveLastClockInActions.error(error));
      if (options && options.onError) options.onError();
    }
    dispatch(retrieveLastClockInActions.loading(false));
  };
};

export const clockInActions = {
  error: createAction('CLOCKIN/CLOCK_IN/ERROR'),
  loading: createAction('CLOCKIN/CLOCK_IN/IS_LOADING'),
  success: createAction('CLOCKIN/CLOCK_IN/SUCCESS'),
};

export const clockIn = (
  params: { userId?: number },
  options?: OptionCallback,
) => {
  return async (dispatch: Dispatch) => {
    dispatch(clockInActions.loading(true));
    dispatch(clockInActions.error(null));
    try {
      const response = await clockInAPI(params);
      dispatch(clockInActions.success(response.data));
      // @ts-expect-error
      if (options && options.onSuccess) options.onSuccess(response.data);
    } catch (error) {
      console.error(error);
      dispatch(clockInActions.error(error));
      if (isErrorWithCustomCode(error) && error.response.data?.error_code) {
        dispatch(
          snackbarWarning(`clockIn.errors.${error.response.data.error_code}`),
        );
      }
      if (options && options.onError) options.onError();
    }
    dispatch(clockInActions.loading(false));
  };
};

export const clockOut = (
  params: { clockInId: number },
  options?: OptionCallback,
) => {
  return async (dispatch: Dispatch) => {
    dispatch(clockInActions.loading(true));
    dispatch(clockInActions.error(null));
    try {
      const response = await clockOutAPI(params);
      dispatch(clockInActions.success(response.data));
      // @ts-expect-error
      if (options && options.onSuccess) options.onSuccess(response.data);
    } catch (error) {
      console.error(error);
      dispatch(clockInActions.error(error));
      if (isErrorWithCustomCode(error) && error.response.data?.error_code) {
        dispatch(
          snackbarWarning(`clockIn.errors.${error.response.data.error_code}`),
        );
      }
      if (options && options.onError) options.onError();
    }
    dispatch(clockInActions.loading(false));
  };
};

export const editClockInActions = {
  error: createAction('CLOCKIN/EDIT_CLOCK_IN/ERROR'),
  loading: createAction('CLOCKIN/EDIT_CLOCK_IN/IS_LOADING'),
  success: createAction('CLOCKIN/EDIT_CLOCK_IN/SUCCESS'),
};

export const editClockIn = (
  clockInId: number,
  clockInData: ClockInData,
  options?: OptionCallback,
) => {
  return async (dispatch: Dispatch) => {
    dispatch(editClockInActions.loading(true));
    dispatch(editClockInActions.error(null));
    try {
      const response = await editClockInAPI(clockInId, clockInData);
      dispatch(editClockInActions.success(response.data));
      if (options && options.onSuccess) options.onSuccess();
    } catch (error) {
      console.error(error);
      dispatch(editClockInActions.error(error));
      if (options && options.onError) options.onError();
    }
    dispatch(editClockInActions.loading(false));
  };
};

export const deleteClockInActions = {
  error: createAction('CLOCKIN/DELETE/ERROR'),
  loading: createAction('CLOCKIN/DELETE/IS_LOADING'),
  success: createAction('CLOCKIN/DELETE/SUCCESS'),
};

export const deleteClockIn = (
  params: {
    clockInId: number;
  },
  options?: OptionCallback,
) => {
  return async (dispatch: Dispatch) => {
    dispatch(deleteClockInActions.loading(true));
    dispatch(deleteClockInActions.error(null));
    try {
      await deleteClockInAPI(params);
      dispatch(deleteClockInActions.success(params));
      if (options && options.onSuccess) options.onSuccess();
    } catch (error) {
      console.error(error);
      dispatch(deleteClockInActions.error(error));
      if (options && options.onError) options.onError();
    }
    dispatch(deleteClockInActions.loading(false));
  };
};

export const listStaffAttendanceRealTimeActions = {
  error: createAction('CLOCKIN/STAFF_ATTENDANCE/REAL_TIME/ERROR'),
  loading: createAction('CLOCKIN/STAFF_ATTENDANCE/REAL_TIME/IS_LOADING'),
  success: createAction('CLOCKIN/STAFF_ATTENDANCE/REAL_TIME/SUCCESS'),
};

export const getStaffsAttendanceRealTime = (
  params: ClockInQueryParams,
  options?: OptionCallback,
) => {
  return async (dispatch: Dispatch) => {
    dispatch(listStaffAttendanceRealTimeActions.loading(true));
    dispatch(listStaffAttendanceRealTimeActions.error(null));
    try {
      const response = await fetchLastClockInListAPI(params);
      dispatch(listStaffAttendanceRealTimeActions.success(response.data));
      if (options && options.onSuccess) options.onSuccess();
    } catch (error) {
      console.error(error);
      dispatch(listStaffAttendanceRealTimeActions.error(error));
      if (options && options.onError) options.onError();
    }
    dispatch(listStaffAttendanceRealTimeActions.loading(false));
  };
};

export const getStaffsAttendanceHistoryActions = {
  error: createAction('CLOCKIN/STAFF_ATTENDANCE/HISTORY/ERROR'),
  loading: createAction('CLOCKIN/STAFF_ATTENDANCE/HISTORY/IS_LOADING'),
  success: createAction('CLOCKIN/STAFF_ATTENDANCE/HISTORY/SUCCESS'),
};

export const getStaffsAttendanceHistory = (
  params: ClockInQueryParams,
  options?: OptionCallback,
) => {
  return async (dispatch: Dispatch) => {
    dispatch(getStaffsAttendanceHistoryActions.loading(true));
    dispatch(getStaffsAttendanceHistoryActions.error(null));
    try {
      const response = await getStaffsAttendanceHistoryAPI(params);
      dispatch(getStaffsAttendanceHistoryActions.success(response.data));
      if (options && options.onSuccess) options.onSuccess();
    } catch (error) {
      console.error(error);
      dispatch(getStaffsAttendanceHistoryActions.error(error));
      if (options && options.onError) options.onError();
    }
    dispatch(getStaffsAttendanceHistoryActions.loading(false));
  };
};

export const exportStaffAttendanceHistoryActions = {
  error: createAction('CLOCKIN/STAFF_ATTENDANCE/EXPORT/ERROR'),
  loading: createAction('CLOCKIN/STAFF_ATTENDANCE/EXPORT/IS_LOADING'),
  success: createAction('CLOCKIN/STAFF_ATTENDANCE/EXPORT/SUCCESS'),
};

export function exportStaffAttendanceHistory(
  params: ClockInQueryParams,
  options?: OptionCallback & {
    closeInitialDialog?: () => void;
    backgroundDialog?: {
      message: string;
      title: string;
    };
  },
) {
  return async (dispatch: Dispatch) => {
    dispatch(exportStaffAttendanceHistoryActions.loading(true));
    dispatch(exportStaffAttendanceHistoryActions.error(null));
    try {
      const response = await exportStaffAttendanceHistoryAPI(params);
      const backgroundTaskUuid = response.headers['x-background-task-uuid'];
      dispatch(
        monitorBackgroundTask(backgroundTaskUuid, {
          onSuccess: () => {
            if (options?.onSuccess) options.onSuccess();
            if (options?.closeInitialDialog) options.closeInitialDialog();
            dispatch(
              displayBackgroundDialog(
                backgroundTaskUuid,
                options?.backgroundDialog?.message,
                options?.backgroundDialog?.title,
                // @ts-expect-error
                response.data,
              ),
            );
          },
        }),
      );
      dispatch(exportStaffAttendanceHistoryActions.success(response.data));
      if (options && options.onSuccess) options.onSuccess();
    } catch (error) {
      console.error(error);
      dispatch(exportStaffAttendanceHistoryActions.error(error));
      if (options && options.onError) options.onError();
    }
    dispatch(exportStaffAttendanceHistoryActions.loading(false));
  };
}
