import type { Dispatch } from 'redux';
import { createAction } from 'redux-actions';
import { push as pushRouter } from 'connected-react-router';
import type { OptionCallback, PaginatedResponse } from '#state/types';

import {
  fetchFranchise as fetchFranchiseAPI,
  fetchFranchiseUsers as fetchFranchiseUsersAPI,
  fetchFranchiseUser as fetchFranchiseUserAPI,
  updateFranchiseTheme as updateFranchiseThemeAPI,
  fetchFranchiseTheme as fetchFranchiseThemeAPI,
  fetchCompanyGroupList as fetchCompanyGroupListAPI,
  retrieveFranchise as retrieveFranchiseAPI,
  createOrUpdateCompanyGroup as createOrUpdateCompanyGroupAPI,
  searchFranchiseUsers as searchFranchiseUsersAPI,
  fetchFranchiseUserPasses as fetchFranchiseUserPassesAPI,
} from './api';
import type {
  Franchise,
  CompanyGroup,
  CreateUpdateCompanyGroupData,
  SearchUsersPayload,
  FranchiseUser,
  FranchiseUserPass,
  FranchiseUserPassesQueryParams,
} from './types';
import { FRANCHISE_CONSUMER_PAYMENT_PACK_PAGE_DEFAULT_SIZE } from './constants';

export const fetchFranchiseActions = {
  error: createAction('FRANCHISE/ME/ERROR'),
  isLoading: createAction('FRANCHISE/ME/IS_LOADING'),
  success: createAction('FRANCHISE/ME/SUCCESS'),
};

export function fetchFranchise(options?: OptionCallback) {
  return async (dispatch: Dispatch) => {
    dispatch(fetchFranchiseActions.isLoading(true));
    dispatch(fetchFranchiseActions.error(null));

    try {
      const response = await fetchFranchiseAPI();
      dispatch(fetchFranchiseActions.success({ franchisor: response.data }));

      options?.onSuccess();
    } catch (error) {
      dispatch(fetchFranchiseActions.error(error));
      if (options && options.onError) {
        options.onError(error);
      }
    }

    dispatch(fetchFranchiseActions.isLoading(false));
  };
}

export function retrieveFranchise(
  id: number,
  options?: OptionCallback<Franchise>,
) {
  return async (dispatch: Dispatch) => {
    dispatch(fetchFranchiseActions.isLoading(true));
    dispatch(fetchFranchiseActions.error(null));

    try {
      const response = await retrieveFranchiseAPI(id);
      dispatch(fetchFranchiseActions.success({ franchisor: response.data }));

      options?.onSuccess && options?.onSuccess();
    } catch (error) {
      dispatch(fetchFranchiseActions.error(error));
      if (options && options.onError) {
        options.onError(error);
      }
    }

    dispatch(fetchFranchiseActions.isLoading(false));
  };
}

export const fetchFranchiseThemeActions = {
  error: createAction('FRANCHISE/THEME/ERROR'),
  isLoading: createAction('FRANCHISE/THEME/IS_LOADING'),
  success: createAction('FRANCHISE/THEME/SUCCESS'),
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
      options?.onSuccess();
    } catch (error) {
      dispatch(fetchFranchiseThemeActions.error(error));
      if (options && options.onError) {
        options.onError(error);
      }
    }

    dispatch(fetchFranchiseThemeActions.isLoading(false));
  };
}

// Users

export const fetchFranchiseUsersActions = {
  error: createAction('FRANCHISE/USERS/ERROR'),
  isLoading: createAction('FRANCHISE/USERS/IS_LOADING'),
  success: createAction('FRANCHISE/USERS/SUCCESS'),
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

      options?.onSuccess();
    } catch (error) {
      dispatch(fetchFranchiseUsersActions.error(error));
      options?.onError(error);
    }

    dispatch(fetchFranchiseUsersActions.isLoading(false));
  };
}

export const fetchFranchiseUserActions = {
  error: createAction('FRANCHISE/USER/ERROR'),
  isLoading: createAction('FRANCHISE/USER/IS_LOADING'),
  success: createAction('FRANCHISE/USER/SUCCESS'),
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

      options?.onSuccess();
    } catch (error) {
      dispatch(fetchFranchiseUserActions.error(error));
      options?.onError(error);
    }

    dispatch(fetchFranchiseUserActions.isLoading(false));
  };
}

export const themeUpdate = {
  error: createAction('FRANCHISE/THEME_UPDATE/ERROR'),
  isLoading: createAction('FRANCHISE/THEME_UPDATE/IS_LOADING'),
  success: createAction('FRANCHISE/THEME_UPDATE/SUCCESS'),
};

export function updateFranchiseTheme(
  franchiseId: number,
  data: any,
  options?: OptionCallback,
) {
  return async (dispatch: Dispatch) => {
    dispatch(themeUpdate.isLoading(true));

    try {
      const response = await updateFranchiseThemeAPI(franchiseId, data);
      dispatch(themeUpdate.success(response.data));
      options?.onSuccess();
    } catch (err) {
      dispatch(themeUpdate.error(err));
      dispatch(themeUpdate.isLoading(false));
      options?.onError();
    }
  };
}

export const listCompanyGroupActions = {
  error: createAction('FRANCHISE/COMPANY_GROUP_LIST/ERROR'),
  isLoading: createAction('FRANCHISE/COMPANY_GROUP_LIST/IS_LOADING'),
  success: createAction('FRANCHISE/COMPANY_GROUP_LIST/SUCCESS'),
};

export function fetchCompanyGroupList(
  company?: number,
  options?: OptionCallback<Array<CompanyGroup>>,
) {
  return async (dispatch: Dispatch) => {
    dispatch(listCompanyGroupActions.isLoading(true));
    dispatch(listCompanyGroupActions.error(null));

    try {
      const response = await fetchCompanyGroupListAPI(
        company ? { company } : {},
      );

      dispatch(listCompanyGroupActions.success(response.data));
      if (options && options.onSuccess) {
        options?.onSuccess(response.data);
      }
    } catch (error) {
      console.error(error);
      dispatch(listCompanyGroupActions.error(error));
      options?.onError(error);
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

      options?.onSuccess();
    } catch (error) {
      dispatch(searchFranchiseUsersActions.error(error));
      options?.onError(error);
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
      if (options?.onSuccess) {
        options.onSuccess(response.data);
      }
    } catch (err) {
      console.error(err);
      dispatch(fetchFranchiseUserPassesActions.error(err));
      if (options?.onError) {
        options.onError(err);
      }
    }
    dispatch(fetchFranchiseUserPassesActions.isLoading(false));
  };
}
