import { type ApiConfig, buildUrlParams } from "@bsport/store-base";

const API_URL = "staff-management/v1/clockin";

export const fetchAttendancesAPI = (params: {
  page: number;
  page_size: number;
}): ApiConfig => {
  return [`${API_URL}${buildUrlParams(params)}`];
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
