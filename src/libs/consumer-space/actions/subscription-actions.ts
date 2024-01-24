import { createAction } from 'redux-actions';
import {
  BILLING_PLAN_STATUS_NOT_STARTED,
  BILLING_PLAN_STATUS_STARTED,
  BILLING_PLAN_STATUS_STOPPED,
  BILLING_PLAN_STATUS_PAUSED,
  BILLING_PLAN_STATUS_ENDED,
} from '@bsport/common/lib/master-data/subscription-status';

import { fetchSubscriptionsList as fetchSubscriptionsListAPI } from '#libs/subscription/api';

import type {
  Dispatch,
  OptionCallback,
  ThunkAction,
  PaginatedResponse,
} from '../../../state/types';
import type { SubscriptionREST } from '#libs/subscription/types';

const DEFAULT_PAGE_SIZE = 30;

export const fetchMyActiveSubscriptionsAsMemberActions = {
  success: createAction<PaginatedResponse<SubscriptionREST>>(
    'SUBSCRIPTIONS/ACTIVE/AS_MEMBER/SUCCESS',
  ),
  isLoading: createAction<boolean>('SUBSCRIPTIONS/ACTIVE/AS_MEMBER/IS_LOADING'),
  error: createAction<Error | null>('SUBSCRIPTIONS/ACTIVE/AS_MEMBER/ERROR'),
};

export function fetchMyActiveSubscriptionsAsMember(
  {
    member,
    page_size = DEFAULT_PAGE_SIZE,
  }: {
    member: number;
    page_size?: number;
  },
  options?: OptionCallback<SubscriptionREST[]>,
): ThunkAction {
  return async (dispatch: Dispatch, getState) => {
    dispatch(fetchMyActiveSubscriptionsAsMemberActions.isLoading(true));
    dispatch(fetchMyActiveSubscriptionsAsMemberActions.error(null));
    const currentState = getState().consumerReworked.mySubscriptions.active;
    const nextPage = currentState.next_page ?? 1;
    try {
      const response = await fetchSubscriptionsListAPI({
        member,
        page: nextPage,
        page_size,
        status: [BILLING_PLAN_STATUS_STARTED, BILLING_PLAN_STATUS_PAUSED],
      });
      dispatch(
        fetchMyActiveSubscriptionsAsMemberActions.success(response.data),
      );
      if (options && options.onSuccess) {
        options.onSuccess(response.data.results);
      }
    } catch (err) {
      dispatch(fetchMyActiveSubscriptionsAsMemberActions.error(err));
      if (options && options.onError) options.onError(err);
    }
    dispatch(fetchMyActiveSubscriptionsAsMemberActions.isLoading(false));
  };
}

export const fetchMyFutureSubscriptionsAsMemberActions = {
  success: createAction<PaginatedResponse<SubscriptionREST>>(
    'SUBSCRIPTIONS/FUTURE/AS_MEMBER/SUCCESS',
  ),
  isLoading: createAction<boolean>('SUBSCRIPTIONS/FUTURE/AS_MEMBER/IS_LOADING'),
  error: createAction<Error | null>('SUBSCRIPTIONS/FUTURE/AS_MEMBER/ERROR'),
};

export function fetchMyFutureSubscriptionsAsMember(
  {
    member,
    page_size = DEFAULT_PAGE_SIZE,
  }: {
    member: number;
    page_size?: number;
  },
  options?: OptionCallback<SubscriptionREST[]>,
): ThunkAction {
  return async (dispatch: Dispatch, getState) => {
    dispatch(fetchMyFutureSubscriptionsAsMemberActions.isLoading(true));
    dispatch(fetchMyFutureSubscriptionsAsMemberActions.error(null));
    const currentState = getState().consumerReworked.mySubscriptions.future;
    const nextPage = currentState.next_page ?? 1;
    try {
      const response = await fetchSubscriptionsListAPI({
        member,
        page: nextPage,
        page_size,
        status: [BILLING_PLAN_STATUS_NOT_STARTED],
      });
      dispatch(
        fetchMyFutureSubscriptionsAsMemberActions.success(response.data),
      );
      if (options && options.onSuccess) {
        options.onSuccess(response.data.results);
      }
    } catch (err) {
      dispatch(fetchMyFutureSubscriptionsAsMemberActions.error(err));
      if (options && options.onError) options.onError(err);
    }
    dispatch(fetchMyFutureSubscriptionsAsMemberActions.isLoading(false));
  };
}

export const fetchMyExpiredSubscriptionsAsMemberActions = {
  success: createAction<PaginatedResponse<SubscriptionREST>>(
    'SUBSCRIPTIONS/EXPIRED/AS_MEMBER/SUCCESS',
  ),
  isLoading: createAction<boolean>(
    'SUBSCRIPTIONS/EXPIRED/AS_MEMBER/IS_LOADING',
  ),
  error: createAction<Error | null>('SUBSCRIPTIONS/EXPIRED/AS_MEMBER/ERROR'),
};

export function fetchMyExpiredSubscriptionsAsMember(
  {
    member,
    page_size = DEFAULT_PAGE_SIZE,
  }: {
    member: number;
    page_size?: number;
  },
  options?: OptionCallback<SubscriptionREST[]>,
): ThunkAction {
  return async (dispatch: Dispatch, getState) => {
    dispatch(fetchMyExpiredSubscriptionsAsMemberActions.isLoading(true));
    dispatch(fetchMyExpiredSubscriptionsAsMemberActions.error(null));
    const currentState = getState().consumerReworked.mySubscriptions.expired;
    const nextPage = currentState.next_page ?? 1;
    try {
      const response = await fetchSubscriptionsListAPI({
        member,
        page: nextPage,
        page_size,
        status: [BILLING_PLAN_STATUS_STOPPED, BILLING_PLAN_STATUS_ENDED],
      });
      dispatch(
        fetchMyExpiredSubscriptionsAsMemberActions.success(response.data),
      );
      if (options && options.onSuccess) {
        options.onSuccess(response.data.results);
      }
    } catch (err) {
      dispatch(fetchMyExpiredSubscriptionsAsMemberActions.error(err));
      if (options && options.onError) options.onError(err);
    }
    dispatch(fetchMyExpiredSubscriptionsAsMemberActions.isLoading(false));
  };
}

export const resetConsumerSubscriptionsStateActions = {
  all: createAction('CONSUMER_STATE_REWORKED/SUBSCRIPTIONS/RESET'),
};

export function resetConsumerSubscriptionsState(): ThunkAction {
  return (dispatch: Dispatch) => {
    dispatch(resetConsumerSubscriptionsStateActions.all());
  };
}
