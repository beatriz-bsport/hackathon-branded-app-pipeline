import { createAction } from 'redux-actions';

import * as Sentry from '@sentry/react';
import {
  fetchMembershipList as fetchMembershipListAPI,
  fetchMembership as fetchMembershipAPI,
  fetchMembershipByCompany as fetchMembershipByCompanyAPI,
  fetchMembershipByBasket as fetchMembershipByBasketAPI,
  linkMeToCompany as linkMeToCompanyAPI,
  requestMembershipValidation as requestMembershipValidationAPI,
} from './api';
import type { Dispatch, OptionCallback, State } from '../../state/types';

export const listAsConsumerActions = {
  success: createAction('MEMBERSHIP/LIST/SUCCESS'),
  isLoading: createAction('MEMBERSHIP/LIST/IS_LOADING'),
  error: createAction('MEMBERSHIP/LIST/ERROR'),
};

export const setActiveActions = createAction('MEMBERSHIP/SET_ACTIVE');

export const retrieveActions = {
  success: createAction('MEMBERSHIP/RETRIEVE/SUCCESS'),
  isLoading: createAction('MEMBERSHIP/RETRIEVE/IS_LOADING'),
  error: createAction('MEMBERSHIP/RETRIEVE/ERROR'),
};

export function fetchMembershipListAsConsumer(
  params: any = {},
  options?: OptionCallback,
) {
  return async (dispatch: Dispatch) => {
    dispatch(listAsConsumerActions.isLoading(true));
    dispatch(listAsConsumerActions.error(null));

    try {
      const response = await fetchMembershipListAPI({
        ...params,
        page: 1,
      });
      dispatch(
        listAsConsumerActions.success({
          ...response.data,
          page: 1,
        }),
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

export function fetchMoreMembership(
  page_size: number,
  options?: OptionCallback,
) {
  return async (dispatch: Dispatch, getState: () => State) => {
    const { next_page } = getState().membership.asConsumer;
    if (!next_page) {
      return;
    }
    dispatch(listAsConsumerActions.isLoading(true));
    dispatch(listAsConsumerActions.error(null));

    try {
      const response = await fetchMembershipListAPI({
        page: next_page,
        page_size,
      });
      dispatch(
        listAsConsumerActions.success({
          ...response.data,
          page: next_page,
        }),
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

export function fetchMembership(id: number, options?: OptionCallback) {
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

export function fetchMembershipByCompany(
  companyId: number,
  options?: OptionCallback,
) {
  return async (dispatch: Dispatch) => {
    dispatch(retrieveActions.isLoading(true));
    dispatch(retrieveActions.error(null));

    try {
      const response = await fetchMembershipByCompanyAPI(companyId);
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
export function fetchMembershipByBasket(
  data: { basket_uuid: string },
  options?: OptionCallback,
) {
  return async (dispatch: Dispatch) => {
    dispatch(retrieveActions.isLoading(true));
    dispatch(retrieveActions.error(null));

    try {
      const response = await fetchMembershipByBasketAPI(data);
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
  data: { company?: number; offer?: number },
  options?: OptionCallback,
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

export const requestMemberShipValidationActions = {
  success: createAction('MEMBERSHIP/VALIDATION/SUCCESS'),
  isLoading: createAction('MEMBERSHIP/VALIDATION/IS_LOADING'),
  error: createAction('MEMBERSHIP/VALIDATION/ERROR'),
};

export function requestMembershipValidation(
  data: { company?: number },
  options?: OptionCallback,
) {
  return async (dispatch: Dispatch) => {
    dispatch(requestMemberShipValidationActions.isLoading(true));
    try {
      const response = await requestMembershipValidationAPI(data);
      dispatch(requestMemberShipValidationActions.success(response.data));

      if (options && options.onSuccess) {
        options.onSuccess(response.data);
      }
    } catch (err) {
      console.error(err);
      Sentry.captureException(err);
      dispatch(requestMemberShipValidationActions.error(err));

      if (options && options.onError) {
        options.onError(err);
      }
    }
    dispatch(requestMemberShipValidationActions.isLoading(false));
  };
}
