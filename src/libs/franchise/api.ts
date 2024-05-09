import type { PaginationFilterParams } from '#src/libs/types';
import {
  API_V1_URI,
  buildUrlParams,
  getAuth,
  putAuth,
  postAuth,
  patchAuth,
  get,
} from '#src/http';
import type {
  FranchiseUser,
  FranchiseDetails,
  CompanyGroup,
  CreateUpdateCompanyGroupData,
  SearchUsersPayload,
  FranchiseUserPass,
  PassesPaginatedQueryParams,
  FranchiseUserMember,
} from '#src/libs/franchise/types';
import type { PaginatedResponse } from '#src/state/types';

export const fetchFranchise = async () => {
  return getAuth<FranchiseDetails>(`${API_V1_URI}/franchisor/franchisor/me/`);
};

export const retrieveFranchise = async (id: number) => {
  return getAuth<FranchiseDetails>(
    `${API_V1_URI}/franchisor/franchisor/${id}/`,
  );
};

export const fetchFranchiseUsers = async (params: {
  page: number;
  page_size: number;
  exclude_archived: boolean;
  email_confirmed?: boolean;
}) => {
  return getAuth<PaginatedResponse<FranchiseUser>>(
    `${API_V1_URI}/user/${buildUrlParams(params)}`,
  );
};

export const fetchFranchiseUser = async (userId: number) => {
  return getAuth<FranchiseUser>(`${API_V1_URI}/user/${userId}`);
};

export const updateFranchiseTheme = async (
  franchiseId: number,
  data: FormData,
) => {
  return patchAuth<FranchiseDetails, FormData>(
    `${API_V1_URI}/franchisor/franchisor/${franchiseId}/`,
    data,
  );
};

export const fetchFranchiseTheme = async (franchiseId: number) => {
  return get<FranchiseDetails>(
    `${API_V1_URI}/franchisor/franchisor/${franchiseId}/`,
  );
};

export const fetchCompanyGroupList = async (params: { company?: number }) => {
  return getAuth<CompanyGroup[]>(
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

export const fetchFranchiseUserInfo = (user_id: number) => {
  return getAuth<FranchiseUser>(
    `${API_V1_URI}/franchise_user_profile/${user_id}/`,
  );
};

export const fetchFranchiseUserMembers = (
  user_id: number,
  paginated_params: PaginationFilterParams,
) => {
  return getAuth<PaginatedResponse<FranchiseUserMember>>(
    `${API_V1_URI}/franchise_user_profile/${user_id}/get_user_members_in_franchise/${buildUrlParams(
      paginated_params,
    )}`,
  );
};
