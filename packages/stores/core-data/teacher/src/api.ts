import { type ApiConfig, buildUrlParams } from "@bsport/store-base";

const API_URL = "core-data/v1";
const API_URL_COACH = `${API_URL}/coach`;
const API_URL_ASSOCIATED_COACH = `${API_URL}/associated_coach`;

export const fetchTeachersAPI = (params: {
  page: number;
  page_size: number;
}): ApiConfig => {
  return [
    `${API_URL_ASSOCIATED_COACH}/${buildUrlParams({ ...params, paginated: true })}`,
  ];
};

export const updateTeacherAPI = (params: { data: unknown }): ApiConfig => {
  return [
    `${API_URL_COACH}/`,
    {
      method: "PATCH",
      body: JSON.stringify(params),
    },
  ];
};
