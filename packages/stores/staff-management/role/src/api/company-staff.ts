import {
  type ApiConfig,
  DEFAULT_PAGE,
  DEFAULT_PAGE_SIZE,
  buildUrlParams,
} from "@bsport/store-base";

import type { CompanyStaffData } from "#src/types";

import { API_URL } from "./constants";

export type FetchCompanyStaffsParams = {
  page_size?: number;
  page?: number;
  role__in?: number[];
  role_exclude?: number[];
};

export const fetchCompanyStaffListAPI = (
  params?: FetchCompanyStaffsParams,
): ApiConfig => {
  const { page, page_size, ...otherParams } = params ?? {};

  const finalParams = page_size
    ? {
        ...otherParams,
        page_size: page_size ?? DEFAULT_PAGE_SIZE,
        page: page ?? DEFAULT_PAGE,
        paginated: true,
      }
    : otherParams;

  return [`${API_URL}/user/${buildUrlParams(finalParams)}`];
};

export const createCompanyStaffAPI = (params: {
  data: CompanyStaffData;
}): ApiConfig => {
  return [
    `${API_URL}/user/`,
    {
      method: "POST",
      body: JSON.stringify(params.data),
    },
  ];
};

export type UpdateCompanyStaffParams = {
  id: number;
  data: {
    roleId?: number;
    coaches?: number[];
    establishments?: number[];
  };
};

export const updateCompanyStaffAPI = (
  params: UpdateCompanyStaffParams,
): ApiConfig => {
  const { id, data } = params;

  const patchBody = data?.roleId
    ? {
        role: data.roleId,
      }
    : {
        coaches_in_role_ids: data?.coaches,
        establishments_in_role_ids: data?.establishments,
      };

  return [
    `${API_URL}/user/${id}/`,
    {
      method: "PATCH",
      body: JSON.stringify(patchBody),
    },
  ];
};

export const deleteCompanyStaffAPI = (params: { id: number }): ApiConfig => {
  return [
    `${API_URL}/user/${params.id}/`,
    {
      method: "DELETE",
    },
  ];
};
