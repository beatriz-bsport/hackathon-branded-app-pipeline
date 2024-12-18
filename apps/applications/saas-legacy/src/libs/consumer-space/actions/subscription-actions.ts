import { createAction } from 'redux-actions';
import {
  fetchConsumerSubscriptionList as fetchConsumerSubscriptionListAPI,
  fetchConsumerSubscriptionInvoicesDetails as fetchConsumerSubscriptionInvoicesDetailsAPI,
  fetchConsumerSubscription as fetchConsumerSubscriptionAPI,
} from '#src/libs/subscription/api';

import type {
  SubscriptionREST,
  SubscriptionsInvoicesDetailsREST,
  SubscriptionsInvoicesDetailsParams,
} from '#src/libs/subscription/types';
import { SubscriptionFilterEnum } from '#src/libs/consumer-space/components/reworked/@MySubscriptions/constants';
import { CONSUMER_SPACE_API_PAGE_SIZE } from '#src/libs/consumer-space/constants';
import type { SubscriptionFilter } from '#src/libs/consumer-space/components/reworked/@MySubscriptions/types';
import type {
  OptionCallback,
  ThunkAction,
  PaginatedResponse,
} from '../../../state/types';
import { PaginationFilterParams } from '#src/libs/types';

const DEFAULT_INVOICE_PAGE_SIZE = 5;
export const fetchMyActiveSubscriptionsAsMemberActions = {
  success: createAction<PaginatedResponse<SubscriptionREST>>(
    'SUBSCRIPTIONS/ACTIVE/LIST/AS_MEMBER/SUCCESS',
  ),
  isLoading: createAction<boolean>(
    'SUBSCRIPTIONS/ACTIVE/LIST/AS_MEMBER/IS_LOADING',
  ),
  error: createAction<Error | null>(
    'SUBSCRIPTIONS/ACTIVE/LIST/AS_MEMBER/ERROR',
  ),
};

export function fetchMyActiveSubscriptionsAsMember(
  {
    page,
    member,
    page_size = CONSUMER_SPACE_API_PAGE_SIZE,
  }: PaginationFilterParams & {
    member: number;
  },
  options?: OptionCallback<PaginatedResponse<SubscriptionREST>>,
): ThunkAction {
  return async (dispatch) => {
    dispatch(fetchMyActiveSubscriptionsAsMemberActions.isLoading(true));
    dispatch(fetchMyActiveSubscriptionsAsMemberActions.error(null));
    try {
      const response = await fetchConsumerSubscriptionListAPI({
        member,
        page: page ?? 1,
        page_size,
        status: SubscriptionFilterEnum.ACTIVE,
      });
      dispatch(
        fetchMyActiveSubscriptionsAsMemberActions.success(response.data),
      );
      if (options && options.onSuccess) {
        options.onSuccess(response.data);
      }
    } catch (err) {
      dispatch(fetchMyActiveSubscriptionsAsMemberActions.error(err));
      if (options && options.onError) options.onError(err);
    }
    dispatch(fetchMyActiveSubscriptionsAsMemberActions.isLoading(false));
  };
}

export const fetchActiveSubscriptionDetailAsMemberActions = {
  success: createAction<SubscriptionREST>(
    'SUBSCRIPTIONS/ACTIVE/AS_MEMBER/SUCCESS',
  ),
  isLoading: createAction<boolean>('SUBSCRIPTIONS/ACTIVE/AS_MEMBER/IS_LOADING'),
  error: createAction<Error | null>('SUBSCRIPTIONS/ACTIVE/AS_MEMBER/ERROR'),
};

export const fetchFutureSubscriptionDetailAsMemberActions = {
  success: createAction<SubscriptionREST>(
    'SUBSCRIPTIONS/FUTURE/AS_MEMBER/SUCCESS',
  ),
  isLoading: createAction<boolean>('SUBSCRIPTIONS/FUTURE/AS_MEMBER/IS_LOADING'),
  error: createAction<Error | null>('SUBSCRIPTIONS/FUTURE/AS_MEMBER/ERROR'),
};

export const fetchExpiredSubscriptionDetailAsMemberActions = {
  success: createAction<SubscriptionREST>(
    'SUBSCRIPTIONS/EXPIRED/AS_MEMBER/SUCCESS',
  ),
  isLoading: createAction<boolean>(
    'SUBSCRIPTIONS/EXPIRED/AS_MEMBER/IS_LOADING',
  ),
  error: createAction<Error | null>('SUBSCRIPTIONS/EXPIRED/AS_MEMBER/ERROR'),
};

const actionType = {
  [SubscriptionFilterEnum.ACTIVE]: fetchActiveSubscriptionDetailAsMemberActions,
  [SubscriptionFilterEnum.FUTURE]: fetchFutureSubscriptionDetailAsMemberActions,
  [SubscriptionFilterEnum.EXPIRED]:
    fetchExpiredSubscriptionDetailAsMemberActions,
};

export function fetchMySubscriptionAsMember(
  {
    id,
    member,
    status,
  }: {
    id: number;
    member: number;
    status: SubscriptionFilter;
  },
  options?: OptionCallback<SubscriptionREST>,
): ThunkAction {
  return async (dispatch) => {
    dispatch(actionType[status].isLoading(true));
    dispatch(actionType[status].error(null));
    try {
      const response = await fetchConsumerSubscriptionAPI(id, {
        status,
        member,
      });
      dispatch(actionType[status].success(response.data));
      if (options && options.onSuccess) {
        options.onSuccess(response.data);
      }
    } catch (err) {
      dispatch(actionType[status].error(err));
      if (options && options.onError) options.onError(err);
    }
    dispatch(actionType[status].isLoading(false));
  };
}

export const fetchMyFutureSubscriptionsAsMemberActions = {
  success: createAction<PaginatedResponse<SubscriptionREST>>(
    'SUBSCRIPTIONS/FUTURE/LIST/AS_MEMBER/SUCCESS',
  ),
  isLoading: createAction<boolean>(
    'SUBSCRIPTIONS/FUTURE/LIST/AS_MEMBER/IS_LOADING',
  ),
  error: createAction<Error | null>(
    'SUBSCRIPTIONS/FUTURE/LIST/AS_MEMBER/ERROR',
  ),
};

export function fetchMyFutureSubscriptionsAsMember(
  {
    page,
    member,
    page_size = CONSUMER_SPACE_API_PAGE_SIZE,
  }: PaginationFilterParams & {
    member: number;
  },
  options?: OptionCallback<PaginatedResponse<SubscriptionREST>>,
): ThunkAction {
  return async (dispatch) => {
    dispatch(fetchMyFutureSubscriptionsAsMemberActions.isLoading(true));
    dispatch(fetchMyFutureSubscriptionsAsMemberActions.error(null));
    try {
      const response = await fetchConsumerSubscriptionListAPI({
        member,
        page: page ?? 1,
        page_size,
        status: SubscriptionFilterEnum.FUTURE,
      });
      dispatch(
        fetchMyFutureSubscriptionsAsMemberActions.success(response.data),
      );
      if (options && options.onSuccess) {
        options.onSuccess(response.data);
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
    'SUBSCRIPTIONS/EXPIRED/LIST/AS_MEMBER/SUCCESS',
  ),
  isLoading: createAction<boolean>(
    'SUBSCRIPTIONS/EXPIRED/LIST/AS_MEMBER/IS_LOADING',
  ),
  error: createAction<Error | null>(
    'SUBSCRIPTIONS/EXPIRED/LIST/AS_MEMBER/ERROR',
  ),
};

export function fetchMyExpiredSubscriptionsAsMember(
  {
    page,
    member,
    page_size = CONSUMER_SPACE_API_PAGE_SIZE,
  }: PaginationFilterParams & {
    member: number;
  },
  options?: OptionCallback<PaginatedResponse<SubscriptionREST>>,
): ThunkAction {
  return async (dispatch) => {
    dispatch(fetchMyExpiredSubscriptionsAsMemberActions.isLoading(true));
    dispatch(fetchMyExpiredSubscriptionsAsMemberActions.error(null));
    try {
      const response = await fetchConsumerSubscriptionListAPI({
        member,
        page: page ?? 1,
        page_size,
        status: SubscriptionFilterEnum.EXPIRED,
      });
      dispatch(
        fetchMyExpiredSubscriptionsAsMemberActions.success(response.data),
      );
      if (options && options.onSuccess) {
        options.onSuccess(response.data);
      }
    } catch (err) {
      dispatch(fetchMyExpiredSubscriptionsAsMemberActions.error(err));
      if (options && options.onError) options.onError(err);
    }
    dispatch(fetchMyExpiredSubscriptionsAsMemberActions.isLoading(false));
  };
}

export const fetchConsumerSubscriptionInvoicesDetailsActions = {
  success: createAction<{
    billing_plan_id: number;
    data: PaginatedResponse<SubscriptionsInvoicesDetailsREST>;
  }>('SUBSCRIPTIONS/INVOICES/AS_MEMBER/SUCCESS'),

  isLoading: createAction<boolean>(
    'SUBSCRIPTIONS/INVOICES/AS_MEMBER/IS_LOADING',
  ),
  error: createAction<Error | null>('SUBSCRIPTIONS/INVOICES/AS_MEMBER/ERROR'),
};

export function fetchConsumerSubscriptionInvoicesDetails(
  params: SubscriptionsInvoicesDetailsParams,
  options?: OptionCallback<{
    billing_plan_id: number;
    data: PaginatedResponse<SubscriptionsInvoicesDetailsREST>;
  }>,
): ThunkAction {
  return async (dispatch, getState) => {
    dispatch(fetchConsumerSubscriptionInvoicesDetailsActions.isLoading(true));
    dispatch(fetchConsumerSubscriptionInvoicesDetailsActions.error(null));
    const { id, page_size } = params;
    const currentState = getState().consumerReworked.mySubscriptions.invoices;
    const nextPage =
      (currentState.bySubscriptionId[id] &&
        currentState.bySubscriptionId[id].next_page) ??
      1;
    try {
      const response = await fetchConsumerSubscriptionInvoicesDetailsAPI({
        billing_plan_id: id,
        page: nextPage,
        page_size: page_size ?? DEFAULT_INVOICE_PAGE_SIZE,
      });
      dispatch(
        fetchConsumerSubscriptionInvoicesDetailsActions.success({
          billing_plan_id: id,
          data: response.data,
        }),
      );
      if (options && options.onSuccess) {
        options.onSuccess({
          billing_plan_id: id,
          data: response.data,
        });
      }
    } catch (err) {
      dispatch(fetchConsumerSubscriptionInvoicesDetailsActions.error(err));
      if (options && options.onError) options.onError(err);
    }
    dispatch(fetchConsumerSubscriptionInvoicesDetailsActions.isLoading(false));
  };
}
