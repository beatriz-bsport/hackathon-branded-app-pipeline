import { AxiosResponse } from 'axios';
import {
  getAuth,
  postAuth,
  patchAuth,
  deleteAuth,
  buildUrlParams,
} from '../../http';
import {
  FranchiseRolePermission,
  FranchiseRole,
  FranchiseUserRoleData,
  RolePermission,
  Role,
  UserRoleData,
  UserRole,
} from './types';
import { DeepPartial } from '../../utils/types';
import Config from '../../config';

const API_V1_URI = Config.REACT_APP_BASE_URI_STAFF_MANAGEMENT_V1;

export const fetchCompanyUserRoles = async (params?: {
  paginated?: boolean;
  page_size?: number;
  page?: number;
  role__in?: number[];
  role_exclude?: number[];
}) => {
  if (!params) {
    return getAuth(`${API_V1_URI}/role/user/`);
  }
  return getAuth(`${API_V1_URI}/role/user/${buildUrlParams(params)}`);
};

export const updateUserRole = async (
  userId: number,
  params: {
    roleId?: number;
    coaches?: number[];
    establishments?: number[];
    staff_establishment_billing_group?: number | null;
  },
) => {
  if (params.roleId) {
    return patchAuth(`${API_V1_URI}/role/user/${userId}/`, {
      role: params.roleId,
    });
  }

  return patchAuth(`${API_V1_URI}/role/user/${userId}/`, {
    coaches_in_role_ids: params.coaches,
    establishments_in_role_ids: params.establishments,
    ...(!!params.staff_establishment_billing_group && {
      staff_establishment_billing_group:
        params.staff_establishment_billing_group,
    }),
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
  permissions: RolePermission;
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

export const fetchFranchiseUserRoles = async (params?: {
  paginated?: boolean;
  page_size?: number;
  page?: number;
}) => {
  if (!params) {
    return getAuth(`${API_V1_URI}/role/franchise_user/`);
  }
  return getAuth(`${API_V1_URI}/role/franchise_user/${buildUrlParams(params)}`);
};

export const updateFranchiseUserRole = async (
  userId: number,
  params: { roleId?: number; franchisees?: number[] },
) => {
  if (params.roleId) {
    return patchAuth(`${API_V1_URI}/role/franchise_user/${userId}/`, {
      franchise_role: params.roleId,
    });
  }
  return patchAuth(`${API_V1_URI}/role/franchise_user/${userId}/`, {
    franchisees_in_role_ids: params.franchisees,
  });
};

export const deleteStaffFranchiseUser = async (userId: number) => {
  return deleteAuth(`${API_V1_URI}/role/franchise_user/${userId}/`);
};

export const createFranchiseUserRole = async (data: FranchiseUserRoleData) => {
  return postAuth(`${API_V1_URI}/role/franchise_user/`, data);
};

export const fetchFranchiseRoles = async () => {
  return getAuth(`${API_V1_URI}/role/franchise_role/`);
};

export const createFranchiseRole = async (data: {
  name: string;
  description: string;
  permissions: FranchiseRolePermission;
  company_role: Role;
  allowed_franchisees: number[];
}) => {
  return postAuth(`${API_V1_URI}/role/franchise_role/`, data);
};

export const updateFranchiseRole = async (
  id: number,
  data: DeepPartial<FranchiseRole>,
) => {
  return patchAuth(`${API_V1_URI}/role/franchise_role/${id}/`, data);
};

export const deleteFranchiseRole = async (id: number) => {
  return deleteAuth(`${API_V1_URI}/role/franchise_role/${id}/`);
};

export const updateUserCommission = async (
  userId: number,
  params: {
    commission: number;
  },
): Promise<AxiosResponse<UserRole>> => {
  return patchAuth(`${API_V1_URI}/role/user/${userId}/`, {
    staff_commission_percentage: params.commission,
  });
};

export const updateFranchiseUserCommission = async (
  userId: number,
  params: {
    commission: number;
  },
): Promise<AxiosResponse<UserRole>> => {
  return patchAuth(`${API_V1_URI}/role/franchise_user/${userId}/`, {
    staff_commission_percentage: params.commission,
  });
};
