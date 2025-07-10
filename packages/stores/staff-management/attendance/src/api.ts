import { type ApiConfig, buildUrlParams } from "@bsport/store-base";

const API_URL = "staff-management/v1/clockin";

export type FetchAttendancesParams = {
  page?: number;
  page_size?: number;
  my_current?: boolean;
};

export const fetchAttendancesAPI = (
  params: FetchAttendancesParams,
): ApiConfig => {
  return [`${API_URL}/${buildUrlParams(params)}`];
};

export const clockInAPI = (params: { userId: number }): ApiConfig => {
  return [
    `${API_URL}/`,
    {
      method: "POST",
      body: JSON.stringify(params),
    },
  ];
};

export const clockOutAPI = (params: { attendanceId: number }): ApiConfig => {
  return [
    `${API_URL}/${params.attendanceId}/clock_out/`,
    {
      method: "POST",
    },
  ];
};

export const updateAttendanceAPI = (params: { data: unknown }): ApiConfig => {
  return [
    `${API_URL}/`,
    {
      method: "PATCH",
      body: JSON.stringify(params.data),
    },
  ];
};
