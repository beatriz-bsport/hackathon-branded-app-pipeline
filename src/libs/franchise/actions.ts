// @flow
import { Dispatch } from 'redux';
import { createAction } from 'redux-actions';
import { OptionCallback } from '../../state/types';

import {
  fetchFranchise as fetchFranchiseAPI,
  fetchFranchiseUsers as fetchFranchiseUsersAPI,
  fetchFranchiseUser as fetchFranchiseUserAPI,
} from './api';

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
      options?.onError(error);
    }

    dispatch(fetchFranchiseActions.isLoading(false));
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
  options?: OptionCallback;
}) {
  const { page, page_size, options } = props;

  return async (dispatch: Dispatch) => {
    dispatch(fetchFranchiseUsersActions.isLoading(true));
    dispatch(fetchFranchiseUsersActions.error(null));

    try {
      const response = await fetchFranchiseUsersAPI({
        page,
        page_size,
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
