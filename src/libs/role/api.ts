import {
  API_V1_URI,
  getAuth,
  postAuth,
  patchAuth,
  deleteAuth,
  buildUrlParams,
} from '../../http';
import { Role, UserRoleData } from './types';
import { DeepPartial } from '../../utils/types';

export const fetchCompanyUserRoles = async (params?: {
  paginated?: boolean;
  page_size?: number;
  page?: number;
}) => {
  if (!params) {
    return getAuth(`${API_V1_URI}/role/user/`);
  }
  return getAuth(`${API_V1_URI}/role/user/${buildUrlParams(params)}`);
};

export const updateUserRole = async (
  userId: number,
  params: { roleId?: number; coaches?: number[] },
) => {
  if (params.roleId) {
    return patchAuth(`${API_V1_URI}/role/user/${userId}/`, {
      role: params.roleId,
    });
  }
  return patchAuth(`${API_V1_URI}/role/user/${userId}/`, {
    coaches_in_role_ids: params.coaches,
  });
};

export const deleteStaffUser = async (userId: number) => {
  return deleteAuth(`${API_V1_URI}/role/user/${userId}/`);
};

export const createUserRole = async (data: UserRoleData) => {
  return postAuth(`${API_V1_URI}/role/user/`, data);
};

export const fetchCompanyRoles = async () => {
  return getAuth(`${API_V1_URI}/role/role/`);
};

export const createCompanyRole = async (data: {
  name: string;
  description: string;
  permissions: string;
  has_booking_override_control: boolean;
}) => {
  return postAuth(`${API_V1_URI}/role/role/`, data);
};

export const updateCompanyRole = async (
  id: number,
  data: DeepPartial<Role>,
) => {
  return patchAuth(`${API_V1_URI}/role/role/${id}/`, data);
};

export const deleteCompanyRole = async (id: number) => {
  return deleteAuth(`${API_V1_URI}/role/role/${id}/`);
};
