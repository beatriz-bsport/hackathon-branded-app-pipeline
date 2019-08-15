// @flow

import {
  API_V1_URI,
  getAuth,
  postAuth,
  patchAuth,
  deleteAuth,
} from '../../http';

export const fetchCompanyRoles = async () => {
  return getAuth(`${API_V1_URI}/role/user/`);
};

export const updateUserRole = async (userId: number, roleId: number) => {
  return patchAuth(`${API_V1_URI}/role/user/${userId}/`, { role: roleId });
};

export const deleteStaffUser = async (userId: number) => {
  return deleteAuth(`${API_V1_URI}/role/user/${userId}/`);
};

export const createUserRole = async (data: {
  email: string,
  password: string,
  role: number,
}) => {
  return postAuth(`${API_V1_URI}/role/user/`, data);
};
