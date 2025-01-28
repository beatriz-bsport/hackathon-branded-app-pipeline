import type { PaginatedResponse } from '#src/state/types';
import {
  getAuth,
  putAuth,
  deleteAuth,
  postBaseAuth,
  postAuth,
  buildUrlParams,
} from '../../http';
import type {
  ClockInData,
  ClockInQueryParams,
  UserTotalAttendance,
} from './types';
import Config from '../../config';

const API_V1_URI = Config.REACT_APP_BASE_URI_STAFF_MANAGEMENT_V1;

export const clockIn = async ({ userId }: { userId?: number }) =>
  postBaseAuth(`${API_V1_URI}/clockin/`, { user: userId });

export const clockOut = async ({ clockInId }: { clockInId: number }) =>
  postAuth(`${API_V1_URI}/clockin/${clockInId}/clock_out/`);

export const editClockIn = async (
  clockInId: number,
  clockInData: ClockInData,
) => putAuth(`${API_V1_URI}/clockin/${clockInId}/`, { ...clockInData });

export const deleteClockIn = async ({ clockInId }: { clockInId: number }) =>
  deleteAuth(`${API_V1_URI}/clockin/${clockInId}/`);

export const fetchStaffWorkTimeSummary = async (params: ClockInQueryParams) => {
  return await getAuth<PaginatedResponse<UserTotalAttendance>>(
    `${API_V1_URI}/clockin/user_work_time_summary/${buildUrlParams(params)}`,
  );
};

export const fetchLastClockInList = async (params: ClockInQueryParams) =>
  getAuth(
    `${API_V1_URI}/clockin/${buildUrlParams({
      ...params,
      current: true,
    })}`,
  );

export const fetchMyLastClockInList = () =>
  getAuth(
    `${API_V1_URI}/clockin/${buildUrlParams({
      my_current: true,
    })}`,
  );

export const getStaffsAttendanceHistory = async (params: ClockInQueryParams) =>
  getAuth(
    `${API_V1_URI}/clockin/${buildUrlParams({
      ...params,
      completed: true,
    })}`,
  );

export const exportStaffAttendanceHistory = async (
  params: ClockInQueryParams,
) => {
  const { user_id__in, ...urlParams } = params;
  return postAuth(
    `${API_V1_URI}/clockin/export_history_excel/${buildUrlParams(urlParams)}`,
    {
      user_id__in,
    },
  );
};
