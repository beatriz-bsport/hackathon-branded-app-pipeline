import { AxiosResponse } from 'axios';
import { GenericPaginationResults } from '../types';
import {
  API_V1_URI,
  buildUrlParams,
  getAuth,
  putAuth,
  postAuth,
  patchAuth,
  get,
} from '../../http';
import type {
  FranchiseUser,
  Franchise,
  FranchiseDetails,
  CompanyGroup,
  CreateUpdateCompanyGroupData,
  SearchUsersPayload,
  FranchiseUserPass,
  PassesPaginatedQueryParams,
} from './types';
import { PaginatedResponse } from '#state/types';

export const fetchFranchise = async (): Promise<AxiosResponse<Franchise>> => {
  return getAuth(`${API_V1_URI}/franchisor/franchisor/me/`);
};

export const retrieveFranchise = async (
  id: number,
): Promise<AxiosResponse<Franchise>> => {
  return getAuth(`${API_V1_URI}/franchisor/franchisor/${id}/`);
};

export const fetchFranchiseUsers = async (params: {
  page: number;
  page_size: number;
  exclude_archived: boolean;
  email_confirmed?: boolean;
}): Promise<AxiosResponse<GenericPaginationResults<FranchiseUser>>> => {
  return getAuth(`${API_V1_URI}/user/${buildUrlParams(params)}`);
};

export const fetchFranchiseUser = async (
  userId: number,
): Promise<AxiosResponse<FranchiseUser>> => {
  return getAuth(`${API_V1_URI}/user/${userId}`);
};

export const updateFranchiseTheme = async (
  franchiseId: number,
  data: {
    primary_color: string;
    secondary_color: string;
    cover: File;
  },
) => {
  return patchAuth(`${API_V1_URI}/franchisor/franchisor/${franchiseId}/`, data);
};

export const fetchFranchiseTheme = async (
  franchiseId: number,
): Promise<AxiosResponse<FranchiseDetails>> => {
  return get(`${API_V1_URI}/franchisor/franchisor/${franchiseId}/`);
};

export const fetchCompanyGroupList = async (
  params: any,
): Promise<AxiosResponse<CompanyGroup[]>> => {
  return getAuth(
    `${API_V1_URI}/franchisor/company_group/${buildUrlParams(params)}`,
  );
};

export const createOrUpdateCompanyGroup = (
  data: CreateUpdateCompanyGroupData,
) => {
  if (data?.id) {
    return putAuth<CompanyGroup>(
      `${API_V1_URI}/franchisor/company_group/${data?.id}/`,
      data,
    );
  }
  return postAuth<CompanyGroup>(
    `${API_V1_URI}/franchisor/company_group/`,
    data,
  );
};

export const searchFranchiseUsers = async (payload: SearchUsersPayload) => {
  return postAuth<FranchiseUser[]>(`${API_V1_URI}/user/search/`, payload);
};

export const fetchFranchiseUserPasses = (
  user_id: number,
  paginated_params: PassesPaginatedQueryParams,
) => {
  return getAuth<PaginatedResponse<FranchiseUserPass>>(
    `${API_V1_URI}/payment-pack/franchise_user_profile/${user_id}/consumer_payment_pack/${buildUrlParams(
      paginated_params,
    )}`,
  );
};
