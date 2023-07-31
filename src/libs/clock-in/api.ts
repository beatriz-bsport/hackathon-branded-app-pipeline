import {
  API_V1_URI,
  getAuth,
  putAuth,
  deleteAuth,
  postBaseAuth,
  postAuth,
  buildUrlParams,
} from '../../http';
import type { ClockInData, ClockInQueryParams } from './types';

export const retrieveLastClockin = async () => {
  return getAuth(`${API_V1_URI}/clockin/last`);
};

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

export const fetchLastClockInList = async (params: ClockInQueryParams) =>
  getAuth(
    `${API_V1_URI}/clockin/${buildUrlParams({
      ...params,
      current: true,
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
