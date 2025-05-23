import { type ApiConfig, buildUrlParams } from "@bsport/store-base";

const API_URL = "staff-management/v1/role";

export const fetchRolesAPI = (params: {
  page: number;
  page_size: number;
}): ApiConfig => {
  return [`${API_URL}${buildUrlParams(params)}`];
};

export const updateRoleAPI = (params: { data: unknown }): ApiConfig => {
  return [
    `${API_URL}/`,
    {
      method: "PATCH",
      body: JSON.stringify(params),
    },
  ];
};
