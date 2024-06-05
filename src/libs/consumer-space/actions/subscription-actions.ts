import { createAction } from 'redux-actions';
import {
  fetchConsumerSubscriptionList as fetchConsumerSubscriptionListAPI,
  fetchConsumerSubscriptionInvoicesDetails as fetchConsumerSubscriptionInvoicesDetailsAPI,
  fetchConsumerSubscription as fetchConsumerSubscriptionAPI,
} from '#libs/subscription/api';


import type {
  SubscriptionREST,
  SubscriptionsInvoicesDetailsREST,
  SubscriptionsInvoicesDetailsParams,
} from '#libs/subscription/types';
import { SubscriptionTabEnum } from '#libs/consumer-space/components/reworked/@MySubscriptions/constants';
import type { SubscriptionTab } from '#libs/consumer-space/components/reworked/@MySubscriptions/types';
import type {
  OptionCallback,
  ThunkAction,
  PaginatedResponse,
} from '../../../state/types';

const DEFAULT_PAGE_SIZE = 30;
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
    member,
    page_size = DEFAULT_PAGE_SIZE,
  }: {
    member: number;
    page_size?: number;
  },
  options?: OptionCallback<SubscriptionREST[]>,
): ThunkAction {
  return async (dispatch, getState) => {
    dispatch(fetchMyActiveSubscriptionsAsMemberActions.isLoading(true));
    dispatch(fetchMyActiveSubscriptionsAsMemberActions.error(null));
    const currentState = getState().consumerReworked.mySubscriptions.active;
    const nextPage = currentState.next_page ?? 1;
    try {
      const response = await fetchConsumerSubscriptionListAPI({
        member,
        page: nextPage,
        page_size,
        status: SubscriptionTabEnum.ACTIVE,
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
  [SubscriptionTabEnum.ACTIVE]: fetchActiveSubscriptionDetailAsMemberActions,
  [SubscriptionTabEnum.FUTURE]: fetchFutureSubscriptionDetailAsMemberActions,
  [SubscriptionTabEnum.EXPIRED]: fetchExpiredSubscriptionDetailAsMemberActions,
};

export function fetchMySubscriptionAsMember(
  {
    id,
    member,
    status,
  }: {
    id: number;
    member: number;
    status: SubscriptionTab;
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
    member,
    page_size = DEFAULT_PAGE_SIZE,
  }: {
    member: number;
    page_size?: number;
  },

  options?: OptionCallback<SubscriptionREST[]>,
): ThunkAction {
  return async (dispatch, getState) => {
    dispatch(fetchMyFutureSubscriptionsAsMemberActions.isLoading(true));
    dispatch(fetchMyFutureSubscriptionsAsMemberActions.error(null));
    const currentState = getState().consumerReworked.mySubscriptions.future;
    const nextPage = currentState.next_page ?? 1;
    try {
      const response = await fetchConsumerSubscriptionListAPI({
        member,
        page: nextPage,
        page_size,
        status: SubscriptionTabEnum.FUTURE,
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
    member,
    page_size = DEFAULT_PAGE_SIZE,
  }: {
    member: number;
    page_size?: number;
  },
  options?: OptionCallback<SubscriptionREST[]>,
): ThunkAction {
  return async (dispatch, getState) => {
    dispatch(fetchMyExpiredSubscriptionsAsMemberActions.isLoading(true));
    dispatch(fetchMyExpiredSubscriptionsAsMemberActions.error(null));
    const currentState = getState().consumerReworked.mySubscriptions.expired;
    const nextPage = currentState.next_page ?? 1;
    try {
      const response = await fetchConsumerSubscriptionListAPI({
        member,
        page: nextPage,
        page_size,
        status: SubscriptionTabEnum.EXPIRED,
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
  options?: OptionCallback<SubscriptionsInvoicesDetailsREST[]>,
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
        options.onSuccess(response.data.results);
      }
    } catch (err) {
      dispatch(fetchConsumerSubscriptionInvoicesDetailsActions.error(err));
      if (options && options.onError) options.onError(err);
    }
    dispatch(fetchConsumerSubscriptionInvoicesDetailsActions.isLoading(false));
  };
}
