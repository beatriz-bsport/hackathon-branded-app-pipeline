import { createAction } from 'redux-actions';
import { push as pushRouter } from 'connected-react-router';
import type {
  OptionBackgroundCallback,
  OptionCallback,
  PaginatedResponse,
  Dispatch,
} from '#src/state/types';

import {
  fetchFranchise as fetchFranchiseAPI,
  fetchFranchiseUsers as fetchFranchiseUsersAPI,
  fetchFranchiseUser as fetchFranchiseUserAPI,
  updateFranchiseTheme as updateFranchiseThemeAPI,
  fetchFranchiseTheme as fetchFranchiseThemeAPI,
  fetchCompanyGroupList as fetchCompanyGroupListAPI,
  fetchSharedConsumerGiftcards as fetchSharedConsumerGiftcardsAPI,
  retrieveFranchise as retrieveFranchiseAPI,
  createOrUpdateCompanyGroup as createOrUpdateCompanyGroupAPI,
  searchFranchiseUsers as searchFranchiseUsersAPI,
  fetchFranchiseUserPasses as fetchFranchiseUserPassesAPI,
  fetchFranchiseUserInfo as fetchFranchiseUserInfoAPI,
  fetchFranchiseUserMembers as fetchFranchiseUserMembersAPI,
  fetchFranchiseUserTags as fetchFranchiseUserTagsAPI,
  updateFranchiseUserTags as updateFranchiseUserTagsAPI,
  fetchFranchiseUserBillingPlans as fetchFranchiseUserBillingPlansAPI,
  fetchFranchiseUserBillingPlanInvoices as fetchFranchiseUserBillingPlanInvoicesAPI,
  retrieveFranchiseWithCache as retrieveFranchiseWithCacheAPI,
} from '#src/libs/franchise/api';
import type {
  CompanyGroup,
  CreateUpdateCompanyGroupData,
  SearchUsersPayload,
  FranchiseUser,
  FranchiseUserPass,
  FranchiseUserPassesQueryParams,
  FranchiseUserMembersQueryParams,
  FranchiseUserMember,
  SharedConsumerGiftcard,
  GiftcardsPaginatedQueryParams,
  FranchiseDetails,
  FranchiseUserTag,
  FranchiseUserTagsUpdate,
  FranchiseUserBillingPlan,
  FranchiseUserBillingPlansQueryParams,
  FranchiseUserBillingPlanInvoicesQueryParams,
} from '#src/libs/franchise/types';
import {
  FRANCHISE_BILLING_PLAN_PAGE_DEFAULT_SIZE,
  FRANCHISE_CONSUMER_PAYMENT_PACK_PAGE_DEFAULT_SIZE,
  FRANCHISE_MEMBER_TAG_PAGE_DEFAULT_SIZE,
  FRANCHISE_USER_MEMBERS_PAGE_DEFAULT_SIZE,
} from '#src/libs/franchise/constants';
import type { RootState } from '#src/reducers';
import { monitorBackgroundTask } from '#src/libs/background-task/actions';
import type { Invoice } from '#src/libs/invoice/types';

export const fetchFranchiseActions = {
  error: createAction<Error | null>('FRANCHISE/ME/ERROR'),
  isLoading: createAction<boolean>('FRANCHISE/ME/IS_LOADING'),
  success: createAction<{ franchisor: FranchiseDetails }>(
    'FRANCHISE/ME/SUCCESS',
  ),
};

export function fetchFranchise(options?: OptionCallback<FranchiseDetails>) {
  return async (dispatch: Dispatch) => {
    dispatch(fetchFranchiseActions.isLoading(true));
    dispatch(fetchFranchiseActions.error(null));

    try {
      const response = await fetchFranchiseAPI();
      dispatch(fetchFranchiseActions.success({ franchisor: response.data }));

      options?.onSuccess?.(response.data);
    } catch (error) {
      dispatch(fetchFranchiseActions.error(error));
      options?.onError?.(error);
    }

    dispatch(fetchFranchiseActions.isLoading(false));
  };
}

export function retrieveFranchise(
  id: number,
  options?: OptionCallback<FranchiseDetails>,
) {
  return async (dispatch: Dispatch) => {
    dispatch(fetchFranchiseActions.isLoading(true));
    dispatch(fetchFranchiseActions.error(null));

    try {
      const response = await retrieveFranchiseAPI(id);
      dispatch(fetchFranchiseActions.success({ franchisor: response.data }));

      options?.onSuccess?.();
    } catch (error) {
      dispatch(fetchFranchiseActions.error(error));
      options?.onError?.(error);
    }

    dispatch(fetchFranchiseActions.isLoading(false));
  };
}

export function retrieveFranchiseWithCache(
  id: number,
  options?: OptionCallback<FranchiseDetails>,
) {
  return async (dispatch: Dispatch) => {
    dispatch(fetchFranchiseActions.isLoading(true));
    dispatch(fetchFranchiseActions.error(null));

    try {
      const response = await retrieveFranchiseWithCacheAPI(id);
      dispatch(fetchFranchiseActions.success({ franchisor: response.data }));

      options?.onSuccess?.();
    } catch (error) {
      dispatch(fetchFranchiseActions.error(error));
      options?.onError?.(error);
    }

    dispatch(fetchFranchiseActions.isLoading(false));
  };
}

export const fetchFranchiseThemeActions = {
  error: createAction<Error | null>('FRANCHISE/THEME/ERROR'),
  isLoading: createAction<boolean>('FRANCHISE/THEME/IS_LOADING'),
  success: createAction<{ franchisor: FranchiseDetails }>(
    'FRANCHISE/THEME/SUCCESS',
  ),
};

export function fetchFranchiseTheme(
  franchiseId: number,
  options?: OptionCallback,
) {
  return async (dispatch: Dispatch) => {
    dispatch(fetchFranchiseThemeActions.isLoading(true));
    dispatch(fetchFranchiseThemeActions.error(null));

    try {
      const response = await fetchFranchiseThemeAPI(franchiseId);
      dispatch(
        fetchFranchiseThemeActions.success({ franchisor: response.data }),
      );
      options?.onSuccess?.();
    } catch (error) {
      dispatch(fetchFranchiseThemeActions.error(error));
      options?.onError?.(error);
    }

    dispatch(fetchFranchiseThemeActions.isLoading(false));
  };
}

// Users

export const fetchFranchiseUsersActions = {
  error: createAction<Error | null>('FRANCHISE/USERS/ERROR'),
  isLoading: createAction<boolean>('FRANCHISE/USERS/IS_LOADING'),
  success: createAction<PaginatedResponse<FranchiseUser>>(
    'FRANCHISE/USERS/SUCCESS',
  ),
};

export function fetchFranchiseUsers(props: {
  page: number;
  page_size: number;
  exclude_archived: boolean;
  email_confirmed?: boolean;
  options?: OptionCallback;
}) {
  const { page, page_size, exclude_archived, email_confirmed, options } = props;
  return async (dispatch: Dispatch) => {
    dispatch(fetchFranchiseUsersActions.isLoading(true));
    dispatch(fetchFranchiseUsersActions.error(null));

    try {
      const response = await fetchFranchiseUsersAPI({
        page,
        page_size,
        exclude_archived,
        email_confirmed,
      });

      dispatch(fetchFranchiseUsersActions.success(response.data));

      options?.onSuccess?.();
    } catch (error) {
      dispatch(fetchFranchiseUsersActions.error(error));
      options?.onError?.(error);
    }

    dispatch(fetchFranchiseUsersActions.isLoading(false));
  };
}

export const fetchFranchiseUserActions = {
  error: createAction<Error | null>('FRANCHISE/USER/ERROR'),
  isLoading: createAction<boolean>('FRANCHISE/USER/IS_LOADING'),
  success: createAction<{
    results: FranchiseUser;
    userId: number;
  }>('FRANCHISE/USER/SUCCESS'),
};

export function fetchFranchiseUser(props: {
  userId: number;
  options?: OptionCallback;
}) {
  const { userId, options } = props;

  return async (dispatch: Dispatch) => {
    dispatch(fetchFranchiseUserActions.isLoading(true));
    dispatch(fetchFranchiseUserActions.error(null));

    try {
      const response = await fetchFranchiseUserAPI(userId);

      dispatch(
        fetchFranchiseUserActions.success({ results: response.data, userId }),
      );

      options?.onSuccess?.();
    } catch (error) {
      dispatch(fetchFranchiseUserActions.error(error));
      options?.onError?.(error);
    }

    dispatch(fetchFranchiseUserActions.isLoading(false));
  };
}

export const updateFranchiseThemeActions = {
  error: createAction<Error | null>('FRANCHISE/THEME_UPDATE/ERROR'),
  isLoading: createAction<boolean>('FRANCHISE/THEME_UPDATE/IS_LOADING'),
  success: createAction<FranchiseDetails>('FRANCHISE/THEME_UPDATE/SUCCESS'),
};

export function updateFranchiseTheme(
  franchiseId: number,
  data: FormData,
  options?: OptionCallback<FranchiseDetails>,
) {
  return async (dispatch: Dispatch) => {
    dispatch(updateFranchiseThemeActions.isLoading(true));

    try {
      const response = await updateFranchiseThemeAPI(franchiseId, data);
      dispatch(updateFranchiseThemeActions.success(response.data));
      options?.onSuccess?.(response.data);
    } catch (erroror) {
      dispatch(updateFranchiseThemeActions.error(erroror));
      dispatch(updateFranchiseThemeActions.isLoading(false));
      options?.onError?.();
    }
  };
}

export const listCompanyGroupActions = {
  error: createAction<Error | null>('FRANCHISE/COMPANY_GROUP_LIST/ERROR'),
  isLoading: createAction<boolean>('FRANCHISE/COMPANY_GROUP_LIST/IS_LOADING'),
  success: createAction<CompanyGroup[]>('FRANCHISE/COMPANY_GROUP_LIST/SUCCESS'),
};

export function fetchCompanyGroupList(
  company?: number,
  options?: OptionCallback<CompanyGroup[]>,
) {
  return async (dispatch: Dispatch) => {
    dispatch(listCompanyGroupActions.isLoading(true));
    dispatch(listCompanyGroupActions.error(null));

    try {
      const response = await fetchCompanyGroupListAPI(
        company ? { company } : {},
      );

      dispatch(listCompanyGroupActions.success(response.data));
      options?.onSuccess?.(response.data);
    } catch (error) {
      console.error(error);
      dispatch(listCompanyGroupActions.error(error));
      options?.onError?.(error);
    }

    dispatch(listCompanyGroupActions.isLoading(false));
  };
}

export const createOrUpdateCompanyGroupActions = {
  error: createAction<Error | null>('FRANCHISE/COMPANY_GROUP_CREATE/ERROR'),
  isLoading: createAction<boolean>('FRANCHISE/COMPANY_GROUP_CREATE/IS_LOADING'),
  success: createAction<CompanyGroup>('FRANCHISE/COMPANY_GROUP_CREATE/SUCCESS'),
};

export function createOrUpdateCompanyGroup(
  data: CreateUpdateCompanyGroupData,
  options?: OptionCallback<CompanyGroup>,
) {
  return async (dispatch: Dispatch) => {
    dispatch(createOrUpdateCompanyGroupActions.isLoading(true));
    dispatch(createOrUpdateCompanyGroupActions.error(null));

    try {
      const response = await createOrUpdateCompanyGroupAPI(data);
      dispatch(createOrUpdateCompanyGroupActions.success(response.data));

      options?.onSuccess?.(response.data);
    } catch (error) {
      dispatch(createOrUpdateCompanyGroupActions.error(error));

      options.onError?.(error);
    } finally {
      dispatch(createOrUpdateCompanyGroupActions.isLoading(false));
    }
  };
}

export const searchFranchiseUsersActions = {
  error: createAction<Error | null>('FRANCHISE/USERS/SEARCH/ERROR'),
  isLoading: createAction<boolean>('FRANCHISE/USERS/SEARCH/IS_LOADING'),
  success: createAction<FranchiseUser[]>('FRANCHISE/USERS/SEARCH/SUCCESS'),
  previousURI: createAction<string>('FRANCHISE/USERS/SEARCH/PREVIOUS_URL'),
};

export function searchFranchiseUsers(
  payload: SearchUsersPayload,
  options?: OptionCallback,
) {
  return async (dispatch: Dispatch) => {
    if (!window.location.pathname.includes('/f/search')) {
      dispatch(
        searchFranchiseUsersActions.previousURI(window.location.pathname),
      );
    }
    dispatch(searchFranchiseUsersActions.isLoading(true));
    dispatch(searchFranchiseUsersActions.error(null));
    dispatch(pushRouter('/f/search'));

    try {
      const response = await searchFranchiseUsersAPI(payload);
      dispatch(searchFranchiseUsersActions.success(response.data));

      options?.onSuccess?.();
    } catch (error) {
      dispatch(searchFranchiseUsersActions.error(error));
      options?.onError?.(error);
    }

    dispatch(searchFranchiseUsersActions.isLoading(false));
  };
}

export const fetchFranchiseUserPassesActions = {
  isLoading: createAction<boolean>('FRANCHISE/USER/PASSES/IS_LOADING'),
  error: createAction<Error | null>('FRANCHISE/USER/PASSES/ERROR'),
  success: createAction<PaginatedResponse<FranchiseUserPass>>(
    'FRANCHISE/USER/PASSES/SUCCESS',
  ),
};

export function fetchFranchiseUserPasses(
  params: Omit<FranchiseUserPassesQueryParams, 'page_size'>,
  options?: OptionCallback<PaginatedResponse<FranchiseUserPass>>,
) {
  return async (dispatch: Dispatch) => {
    dispatch(fetchFranchiseUserPassesActions.isLoading(true));
    dispatch(fetchFranchiseUserPassesActions.error(null));
    try {
      const paginated_params = {
        page: params.page,
        page_size: FRANCHISE_CONSUMER_PAYMENT_PACK_PAGE_DEFAULT_SIZE,
        ...params.filters,
      };
      const response = await fetchFranchiseUserPassesAPI(
        params.user_id,
        paginated_params,
      );
      dispatch(fetchFranchiseUserPassesActions.success(response.data));
      options?.onSuccess?.(response.data);
    } catch (error) {
      console.error(error);
      dispatch(fetchFranchiseUserPassesActions.error(error));
      options?.onError?.(error);
    }
    dispatch(fetchFranchiseUserPassesActions.isLoading(false));
  };
}

export const fetchFranchiseUserInfoActions = {
  isLoading: createAction<boolean>('FRANCHISE/USER/INFO/IS_LOADING'),
  error: createAction<Error | null>('FRANCHISE/USER/INFO/ERROR'),
  success: createAction<FranchiseUser>('FRANCHISE/USER/INFO/SUCCESS'),
};

export function fetchFranchiseUserInfo(
  params: { user_id: number },
  options?: OptionCallback<FranchiseUser>,
) {
  return async (dispatch: Dispatch) => {
    dispatch(fetchFranchiseUserInfoActions.isLoading(true));
    dispatch(fetchFranchiseUserInfoActions.error(null));
    try {
      const response = await fetchFranchiseUserInfoAPI(params.user_id);
      dispatch(fetchFranchiseUserInfoActions.success(response.data));
      options?.onSuccess?.(response.data);
    } catch (error) {
      console.error(error);
      dispatch(fetchFranchiseUserInfoActions.error(error));
      options?.onError?.(error);
    }
    dispatch(fetchFranchiseUserInfoActions.isLoading(false));
  };
}

export const fetchFranchiseUserMembersActions = {
  isLoading: createAction<boolean>('FRANCHISE/USER/MEMBERS/IS_LOADING'),
  error: createAction<Error | null>('FRANCHISE/USER/MEMBERS/ERROR'),
  success: createAction<PaginatedResponse<FranchiseUserMember>>(
    'FRANCHISE/USER/MEMBERS/SUCCESS',
  ),
};

export function fetchFranchiseUserMembers(
  params: Omit<FranchiseUserMembersQueryParams, 'page_size'>,
  options?: OptionCallback<PaginatedResponse<FranchiseUserMember>>,
) {
  return async (dispatch: Dispatch, getState: () => RootState) => {
    dispatch(fetchFranchiseUserMembersActions.isLoading(true));
    dispatch(fetchFranchiseUserMembersActions.error(null));
    try {
      const currentState = getState().franchise.userProfile.associatedMembers;
      const nextPage = currentState.next_page ?? 1;

      const paginated_params = {
        page: params.page ?? nextPage,
        page_size: FRANCHISE_USER_MEMBERS_PAGE_DEFAULT_SIZE,
      };
      const response = await fetchFranchiseUserMembersAPI(
        params.user_id,
        paginated_params,
      );
      dispatch(fetchFranchiseUserMembersActions.success(response.data));
      options?.onSuccess?.(response.data);
    } catch (error) {
      console.error(error);
      dispatch(fetchFranchiseUserMembersActions.error(error));
      options?.onError?.(error);
    }
    dispatch(fetchFranchiseUserMembersActions.isLoading(false));
  };
}

export const fetchReceivedSharedConsumerGiftcardsActions = {
  error: createAction<Error | null>(
    'FRANCHISE/SHARED_GIFTCARDS/LIST_RECEIVED/ERROR',
  ),
  isLoading: createAction<boolean>(
    'FRANCHISE/SHARED_GIFTCARDS/LIST_RECEIVED/IS_LOADING',
  ),
  success: createAction<PaginatedResponse<SharedConsumerGiftcard>>(
    'FRANCHISE/SHARED_GIFTCARDS/LIST_RECEIVED/SUCCESS',
  ),
};

export function fetchReceivedSharedConsumerGiftcards(
  userId: number,
  params?: GiftcardsPaginatedQueryParams,
  options?: OptionCallback<SharedConsumerGiftcard[]>,
) {
  return async (dispatch: Dispatch) => {
    dispatch(fetchReceivedSharedConsumerGiftcardsActions.isLoading(true));
    dispatch(fetchReceivedSharedConsumerGiftcardsActions.error(null));

    const updatedParams = { ...params, as_sender: false };

    try {
      const response = await fetchSharedConsumerGiftcardsAPI(
        userId,
        updatedParams,
      );
      dispatch(
        fetchReceivedSharedConsumerGiftcardsActions.success(response.data),
      );

      options?.onSuccess?.(response.data.results);
    } catch (error) {
      dispatch(fetchReceivedSharedConsumerGiftcardsActions.error(error));
      options?.onError?.(error);
    }

    dispatch(fetchReceivedSharedConsumerGiftcardsActions.isLoading(false));
  };
}

export const fetchSentSharedConsumerGiftcardsActions = {
  error: createAction<Error | null>(
    'FRANCHISE/SHARED_GIFTCARDS/LIST_BOUGHT/ERROR',
  ),
  isLoading: createAction<boolean>(
    'FRANCHISE/SHARED_GIFTCARDS/LIST_BOUGHT/IS_LOADING',
  ),
  success: createAction<PaginatedResponse<SharedConsumerGiftcard>>(
    'FRANCHISE/SHARED_GIFTCARDS/LIST_BOUGHT/SUCCESS',
  ),
};

export function fetchSentSharedConsumerGiftcards(
  userId: number,
  params?: GiftcardsPaginatedQueryParams,
  options?: OptionCallback<SharedConsumerGiftcard[]>,
) {
  return async (dispatch: Dispatch) => {
    dispatch(fetchSentSharedConsumerGiftcardsActions.isLoading(true));
    dispatch(fetchSentSharedConsumerGiftcardsActions.error(null));

    const updatedParams = { ...params, as_sender: true };

    try {
      const response = await fetchSharedConsumerGiftcardsAPI(
        userId,
        updatedParams,
      );
      dispatch(fetchSentSharedConsumerGiftcardsActions.success(response.data));

      options?.onSuccess?.(response.data.results);
    } catch (error) {
      dispatch(fetchSentSharedConsumerGiftcardsActions.error(error));
      options?.onError?.(error);
    }

    dispatch(fetchSentSharedConsumerGiftcardsActions.isLoading(false));
  };
}

export const fetchFranchiseUserTagsActions = {
  isLoading: createAction<boolean>('FRANCHISE/USER/TAGS/IS_LOADING'),
  error: createAction<Error | null>('FRANCHISE/USER/TAGS/ERROR'),
  success: createAction<PaginatedResponse<FranchiseUserTag>>(
    'FRANCHISE/USER/TAGS/SUCCESS',
  ),
};

export function fetchFranchiseUserTags(
  params: FranchiseUserMembersQueryParams,
  options?: OptionCallback<FranchiseUserTag[]>,
) {
  return async (dispatch: Dispatch, getState: () => RootState) => {
    dispatch(fetchFranchiseUserTagsActions.isLoading(true));
    dispatch(fetchFranchiseUserTagsActions.error(null));
    try {
      const currentState = getState().franchise.userProfile.tags;
      const page = currentState.page;

      const paginated_params = {
        page: params.page ?? page,
        page_size: params.page_size ?? FRANCHISE_MEMBER_TAG_PAGE_DEFAULT_SIZE,
      };
      const response = await fetchFranchiseUserTagsAPI(
        params.user_id,
        paginated_params,
      );
      dispatch(fetchFranchiseUserTagsActions.success(response.data));
      options?.onSuccess?.(response.data.results);
    } catch (error) {
      console.error(error);
      dispatch(fetchFranchiseUserTagsActions.error(error));
      options?.onError?.(error);
    }
    dispatch(fetchFranchiseUserTagsActions.isLoading(false));
  };
}

export const updateFranchiseUserTagsActions = {
  isLoading: createAction<boolean>('FRANCHISE/USER/TAGS/UPDATE/IS_LOADING'),
  error: createAction<Error | null>('FRANCHISE/USER/TAGS/UPDATE/ERROR'),
  success: createAction<number[]>('FRANCHISE/USER/TAGS/UPDATE/SUCCESS'),
};

export function updateFranchiseUserTags(
  params: FranchiseUserTagsUpdate,
  options?: OptionBackgroundCallback<number[]>,
) {
  return async (dispatch: Dispatch) => {
    dispatch(updateFranchiseUserTagsActions.isLoading(true));
    dispatch(updateFranchiseUserTagsActions.error(null));
    try {
      const response = await updateFranchiseUserTagsAPI(
        params.user_id,
        params.data,
      );
      const backgroundTaskUuid = response.headers['x-background-task-uuid'];
      dispatch(
        monitorBackgroundTask(backgroundTaskUuid, {
          onSuccess: options?.onBackgroundSuccess,
        }),
      );
      dispatch(updateFranchiseUserTagsActions.success(response.data));
      options?.onSuccess?.(response.data);
    } catch (error) {
      console.error(error);
      dispatch(updateFranchiseUserTagsActions.error(error));
      options?.onError?.(error);
    }
    dispatch(updateFranchiseUserTagsActions.isLoading(false));
  };
}

export const fetchFranchiseUserBillingPlansActions = {
  isLoading: createAction<boolean>('FRANCHISE/USER/BILLING_PLANS/IS_LOADING'),
  error: createAction<Error | null>('FRANCHISE/USER/BILLING_PLANS/ERROR'),
  success: createAction<PaginatedResponse<FranchiseUserBillingPlan>>(
    'FRANCHISE/USER/BILLING_PLANS/SUCCESS',
  ),
};

export function fetchFranchiseUserBillingPlans(
  params: FranchiseUserBillingPlansQueryParams,
  options?: OptionCallback<FranchiseUserBillingPlan[]>,
) {
  return async (dispatch: Dispatch, getState: () => RootState) => {
    dispatch(fetchFranchiseUserBillingPlansActions.isLoading(true));
    dispatch(fetchFranchiseUserBillingPlansActions.error(null));
    try {
      const currentState = getState().franchise.userProfile.tags;
      const page = currentState.page;

      const paginated_params = {
        page: params.page ?? page,
        page_size: params.page_size ?? FRANCHISE_BILLING_PLAN_PAGE_DEFAULT_SIZE,
        ...params.filters,
      };
      const response = await fetchFranchiseUserBillingPlansAPI(
        params.user_id,
        paginated_params,
      );
      dispatch(fetchFranchiseUserBillingPlansActions.success(response.data));
      options?.onSuccess?.(response.data.results);
    } catch (error) {
      console.error(error);
      dispatch(fetchFranchiseUserBillingPlansActions.error(error));
      options?.onError?.(error);
    }
    dispatch(fetchFranchiseUserBillingPlansActions.isLoading(false));
  };
}

export const fetchFranchiseUserBillingPlanInvoicesActions = {
  isLoading: createAction<boolean>(
    'FRANCHISE/USER/BILLING_PLAN/INVOICES/IS_LOADING',
  ),
  error: createAction<Error | null>(
    'FRANCHISE/USER/BILLING_PLAN/INVOICES/ERROR',
  ),
  success: createAction<PaginatedResponse<Invoice>>(
    'FRANCHISE/USER/BILLING_PLAN/INVOICES/SUCCESS',
  ),
};

export function fetchFranchiseUserBillingPlanInvoices(
  params: FranchiseUserBillingPlanInvoicesQueryParams,
  options?: OptionCallback<Invoice[]>,
) {
  return async (dispatch: Dispatch, getState: () => RootState) => {
    dispatch(fetchFranchiseUserBillingPlanInvoicesActions.isLoading(true));
    dispatch(fetchFranchiseUserBillingPlanInvoicesActions.error(null));
    try {
      const currentState = getState().franchise.userProfile.tags;
      const page = currentState.page;

      const paginated_params = {
        page: params.page ?? page,
        page_size: params.page_size ?? FRANCHISE_BILLING_PLAN_PAGE_DEFAULT_SIZE,
      };
      const response = await fetchFranchiseUserBillingPlanInvoicesAPI(
        params.user_id,
        params.billing_plan_id,
        paginated_params,
      );
      dispatch(
        fetchFranchiseUserBillingPlanInvoicesActions.success(response.data),
      );
      options?.onSuccess?.(response.data.results);
    } catch (error) {
      console.error(error);
      dispatch(fetchFranchiseUserBillingPlanInvoicesActions.error(error));
      options?.onError?.(error);
    }
    dispatch(fetchFranchiseUserBillingPlanInvoicesActions.isLoading(false));
  };
}
