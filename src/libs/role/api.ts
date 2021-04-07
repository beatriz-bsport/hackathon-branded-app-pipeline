import {
  API_V1_URI,
  getAuth,
  postAuth,
  patchAuth,
  deleteAuth,
} from '../../http';
import { Role, UserRoleData } from './types';
import { DeepPartial } from '../../utils/types';

export const fetchCompanyUserRoles = async () => {
  return getAuth(`${API_V1_URI}/role/user/`);
};

export const updateUserRole = async (userId: number, roleId: number) => {
  return patchAuth(`${API_V1_URI}/role/user/${userId}/`, { role: roleId });
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
