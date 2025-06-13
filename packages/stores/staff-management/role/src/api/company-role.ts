import type { ApiConfig, DeepPartial } from "@bsport/store-base";

import type { CompanyRole, CompanyRolePermissions } from "#src/types";

import { API_URL } from "./constants";

export const fetchCompanyRolesAPI = (): ApiConfig => {
  return [`${API_URL}/role/`];
};

export type CreateCompanyRoleParams = {
  data: {
    name: string;
    description: string;
    permissions: CompanyRolePermissions;
    has_booking_override_control: boolean;
  };
};

export const createCompanyRoleAPI = (
  params: CreateCompanyRoleParams,
): ApiConfig => {
  return [
    `${API_URL}/role/`,
    {
      method: "POST",
      body: JSON.stringify(params.data),
    },
  ];
};

export type UpdateCompanyRoleParams = {
  id: number;
  data: DeepPartial<CompanyRole>;
};

export const updateCompanyRoleAPI = (
  params: UpdateCompanyRoleParams,
): ApiConfig => {
  return [
    `${API_URL}/role/${params.id}/`,
    {
      method: "PATCH",
      body: JSON.stringify(params.data),
    },
  ];
};

export const deleteCompanyRoleAPI = (params: { id: number }): ApiConfig => {
  return [
    `${API_URL}/role/${params.id}/`,
    {
      method: "DELETE",
    },
  ];
};
