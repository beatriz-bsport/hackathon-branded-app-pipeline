import type { PaginationFilterParams } from '#src/libs/types';
import {
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
  SharedConsumerGiftcard,
  GiftcardsPaginatedQueryParams,
  FranchiseUserTag,
  FranchiseUserBillingPlan,
  BillingPlansPaginatedQueryParams,
} from '#src/libs/franchise/types';
import type { PaginatedResponse } from '#src/state/types';
import { cleanParams } from '#src/utils/createUrlHandlers';
import type { Invoice } from '#src/libs/invoice/types';
import Config from '../../config';
import SharedDataCache from '#src/services/SharedDataCache';
import { CacheKeys } from '#src/services/constants';

const API_V1_URI_CORE = Config.REACT_APP_BASE_URI_CORE_V1;
const API_V1_URI_BUYABLE = Config.REACT_APP_BASE_URI_BUYABLE_V1;
const API_V0_URI_CDP = Config.REACT_APP_BASE_URI_CDP_V0;

const API_BASE_URI_BUYABLE = Config.REACT_APP_BASE_URI_BUYABLE_V0;

export const fetchFranchise = async () => {
  return getAuth<FranchiseDetails>(
    `${API_V1_URI_CORE}/franchisor/franchisor/me/`,
  );
};

export const retrieveFranchise = async (id: number) => {
  return getAuth<FranchiseDetails>(
    `${API_V1_URI_CORE}/franchisor/franchisor/${id}/`,
  );
};

export const retrieveFranchiseWithCache = async (id: number) => {
  const sharedCache = SharedDataCache.getInstance();
  return sharedCache.fetchWithCache({
    cacheKey: sharedCache.getCacheKey(CacheKeys.franchise, id),
    fetchFn: () => retrieveFranchise(id),
  });
};

export const fetchFranchiseUsers = async (params: {
  page: number;
  page_size: number;
  exclude_archived: boolean;
  email_confirmed?: boolean;
}) => {
  return getAuth<PaginatedResponse<FranchiseUser>>(
    `${API_V1_URI_CORE}/user/${buildUrlParams(params)}`,
  );
};

export const fetchFranchiseUser = async (userId: number) => {
  return getAuth<FranchiseUser>(`${API_V1_URI_CORE}/user/${userId}`);
};

export const updateFranchiseTheme = async (
  franchiseId: number,
  data: FormData,
) => {
  return patchAuth<FranchiseDetails, FormData>(
    `${API_V1_URI_CORE}/franchisor/franchisor/${franchiseId}/`,
    data,
  );
};

export const fetchFranchiseTheme = async (franchiseId: number) => {
  return get<FranchiseDetails>(
    `${API_V1_URI_CORE}/franchisor/franchisor/${franchiseId}/`,
  );
};

export const fetchCompanyGroupList = async (params: { company?: number }) => {
  return getAuth<CompanyGroup[]>(
    `${API_V1_URI_CORE}/franchisor/company_group/${buildUrlParams(params)}`,
  );
};

export const createOrUpdateCompanyGroup = (
  data: CreateUpdateCompanyGroupData,
) => {
  if (data?.id) {
    return putAuth<CompanyGroup>(
      `${API_V1_URI_CORE}/franchisor/company_group/${data?.id}/`,
      data,
    );
  }
  return postAuth<CompanyGroup>(
    `${API_V1_URI_CORE}/franchisor/company_group/`,
    data,
  );
};

export const searchFranchiseUsers = async (payload: SearchUsersPayload) => {
  return postAuth<FranchiseUser[]>(`${API_V1_URI_CORE}/user/search/`, payload);
};

export const fetchFranchiseUserPasses = (
  user_id: number,
  paginated_params: PassesPaginatedQueryParams,
) => {
  return getAuth<PaginatedResponse<FranchiseUserPass>>(
    `${API_V1_URI_BUYABLE}/payment-pack/franchise_user_profile/${user_id}/consumer_payment_pack/${buildUrlParams(
      paginated_params,
    )}`,
  );
};

export const fetchFranchiseUserInfo = (user_id: number) => {
  return getAuth<FranchiseUser>(
    `${API_V1_URI_CORE}/franchise_user_profile/${user_id}/`,
  );
};

export const fetchFranchiseUserMembers = (
  user_id: number,
  paginated_params: PaginationFilterParams,
) => {
  return getAuth<PaginatedResponse<FranchiseUserMember>>(
    `${API_V1_URI_CORE}/franchise_user_profile/${user_id}/get_user_members_in_franchise/${buildUrlParams(
      paginated_params,
    )}`,
  );
};

export const fetchSharedConsumerGiftcards = async (
  userId: number,
  params?: GiftcardsPaginatedQueryParams,
) => {
  const cleanedParams = cleanParams(params);
  return getAuth<PaginatedResponse<SharedConsumerGiftcard>>(
    `${API_V1_URI_BUYABLE}/giftcard/franchise_user_profile/${userId}/consumer_giftcards/${buildUrlParams(
      cleanedParams,
    )}`,
  );
};

export const fetchFranchiseUserTags = (
  user_id: number,
  paginated_params: PaginationFilterParams,
) => {
  return getAuth<PaginatedResponse<FranchiseUserTag>>(
    `${API_V0_URI_CDP}/franchise_user_profile/${user_id}/member_tag/${buildUrlParams(
      paginated_params,
    )}`,
  );
};

export const updateFranchiseUserTags = (
  user_id: number,
  data: { user_tag_ids: number[] },
) => {
  return postAuth<number[]>(
    `${API_V0_URI_CDP}/franchise_user_profile/${user_id}/member_tag/update_user_member_tags/`,
    data,
  );
};

export const fetchFranchiseUserBillingPlans = (
  user_id: number,
  paginated_params: BillingPlansPaginatedQueryParams,
) => {
  return getAuth<PaginatedResponse<FranchiseUserBillingPlan>>(
    `${API_BASE_URI_BUYABLE}/subscription/franchise_user_profile/${user_id}/billing_plan/${buildUrlParams(
      paginated_params,
    )}`,
  );
};

export const fetchFranchiseUserBillingPlanInvoices = (
  user_id: number,
  billingPlanId: number,
  paginated_params: PaginationFilterParams,
) => {
  return getAuth<PaginatedResponse<Invoice>>(
    `${API_BASE_URI_BUYABLE}/subscription/franchise_user_profile/${user_id}/billing_plan/${billingPlanId}/get_invoices/${buildUrlParams(
      paginated_params,
    )}`,
  );
};
