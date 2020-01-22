// @flow
import { createAction } from 'redux-actions';

import * as Sentry from '@sentry/browser';
import {
  fetchMembershipList as fetchMembershipListAPI,
  fetchMembership as fetchMembershipAPI,
  linkMeToCompany as linkMeToCompanyAPI,
} from './api';
import type { Dispatch, OptionCallback, State } from '../../state/types';

export const listAsConsumerActions = {
  success: createAction('MEMBERSHIP/LIST/SUCCESS'),
  isLoading: createAction('MEMBERSHIP/LIST/IS_LOADING'),
  error: createAction('MEMBERSHIP/LIST/ERROR'),
  reset: createAction('MEMBERSHIP/RESET/ERROR'),
};

export const setActiveActions = createAction('MEMBERSHIP/SET_ACTIVE');

export const retrieveActions = {
  success: createAction('MEMBERSHIP/RETRIEVE/SUCCESS'),
  isLoading: createAction('MEMBERSHIP/RETRIEVE/IS_LOADING'),
  error: createAction('MEMBERSHIP/RETRIEVE/ERROR'),
};

export function resetMembershipListAsConsumer(
  params: any = {},
  options: OptionCallback,
) {
  return async (dispatch: Dispatch) => {
    dispatch(listAsConsumerActions.reset());
    dispatch(fetchMembershipListAsConsumer(params, options));
  };
}

export function fetchMembershipListAsConsumer(
  params: any = {},
  options: OptionCallback,
) {
  return async (dispatch: Dispatch, getState: () => State) => {
    dispatch(listAsConsumerActions.isLoading(true));
    dispatch(listAsConsumerActions.error(null));
    const { next_page } = getState().membership.asConsumer;

    try {
      const response = await fetchMembershipListAPI({
        ...params,
        page: next_page,
        page_size: 100,
      });
      dispatch(
        listAsConsumerActions.success({ ...response.data, page: next_page }),
      );
      if (options && options.onSuccess) {
        options.onSuccess(response.data.results);
      }
    } catch (err) {
      console.error(err);
      dispatch(listAsConsumerActions.error(err));
      if (options && options.onError) options.onError(err);
    }
    dispatch(listAsConsumerActions.isLoading(false));
  };
}

export function fetchMembership(id: number, options: OptionCallback) {
  return async (dispatch: Dispatch) => {
    dispatch(retrieveActions.isLoading(true));
    dispatch(retrieveActions.error(null));

    try {
      const response = await fetchMembershipAPI(id);
      dispatch(retrieveActions.success(response.data));
      if (options && options.onSuccess) {
        options.onSuccess(response.data);
      }
    } catch (err) {
      console.error(err);
      dispatch(retrieveActions.error(err));
      if (options && options.onError) options.onError(err);
    }
    dispatch(retrieveActions.isLoading(false));
  };
}

export const linkActions = {
  success: createAction('MEMBERSHIP/LINK/SUCCESS'),
  isLoading: createAction('MEMBERSHIP/LINK/IS_LOADING'),
  error: createAction('MEMBERSHIP/LINK/ERROR'),
};

export function linkMeToCompany(
  data: { company?: number, offer?: number },
  options: OptionCallback,
) {
  return async (dispatch: Dispatch) => {
    dispatch(linkActions.isLoading(true));
    try {
      const response = await linkMeToCompanyAPI(data);
      dispatch(linkActions.success(response.data));

      if (options && options.onSuccess) {
        options.onSuccess(response.data);
      }
    } catch (err) {
      console.error(err);
      Sentry.captureException(err);
      dispatch(linkActions.error(err));

      if (options && options.onError) {
        options.onError(err);
      }
    }
    dispatch(linkActions.isLoading(false));
  };
}
