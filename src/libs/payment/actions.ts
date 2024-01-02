// @ts-nocheck
import { createAction } from 'redux-actions';
import {
  Dispatch,
  ThunkAction,
  OptionCallback,
  OptionBackgroundCallback,
} from '../../state/types';
import { RootState } from '../../reducers';
import { ReportConfiguration } from '../reporting/types';
import { snackbarSuccess, snackbarError } from '../snackbar/actions';
import { monitorBackgroundTask } from '../background-task/actions';
import {
  fetchPaymentMethodList as fetchPaymentMethodListAPI,
  fetchOnSpotPaymentReport as fetchOnSpotPaymentReportAPI,
  fetchPaymentGroupList as fetchPaymentGroupListAPI,
  fetchPayoutList as fetchPayoutListAPI,
  fetchStripeBalance as fetchStripeBalanceAPI,
  updatePaymentGroupPriceCts as updatePaymentGroupPriceCtsAPI,
  detachPaymentMethod as detachPaymentMethodAPI,
  setPaymentMethodAsDefault as setPaymentMethodAsDefaultAPI,
  submitInternalPaymentInBackground as submitInternalPaymentInBackgroundAPI,
  fetchStripePayoutList as fetchStripePayoutListAPI,
} from './api';
import type {
  PaymentGroup,
  PaymentMethod,
  Payout,
  InternalPaymentPayload,
  StripePayout,
  StripeBalance,
} from './types';

import { isErrorWithCustomCode } from '#libs/utils';

// Active campaign Account
export const listSavedPaymentMethodListActions = {
  isLoading: createAction('PAYMENT_METHOD/LIST/LOADING'),
  error: createAction('PAYMENT_METHOD/LIST/ERROR'),
  success: createAction('PAYMENT_METHOD/LIST/SUCCESS'),
};

export function fetchPaymentMethodList(
  params: any = {},
  options?: OptionCallback<Array<PaymentMethod>>,
): ThunkAction {
  return async (dispatch: Dispatch) => {
    dispatch(listSavedPaymentMethodListActions.isLoading(true));
    dispatch(listSavedPaymentMethodListActions.error(null));
    try {
      const response = await fetchPaymentMethodListAPI(params);
      dispatch(listSavedPaymentMethodListActions.success(response.data));
      if (options && options.onSuccess) {
        options.onSuccess(response.data);
      }
    } catch (err) {
      dispatch(listSavedPaymentMethodListActions.error(err));
    }
    dispatch(listSavedPaymentMethodListActions.isLoading(false));
  };
}

export const detachPaymentMethodActions = {
  isLoading: createAction('PAYMENT_METHOD/DETACH/LOADING'),
  error: createAction('PAYMENT_METHOD/DETACH/ERROR'),
  success: createAction('PATMENT_METHOD/DETACH/SUCCESS'),
};
export function detachPaymentMethod(params: any, options?: OptionCallback) {
  return async (dispatch: Dispatch) => {
    dispatch(detachPaymentMethodActions.error(null));
    dispatch(detachPaymentMethodActions.isLoading(true));
    try {
      const response = await detachPaymentMethodAPI(params);
      dispatch(detachPaymentMethodActions.success(response.data));
      dispatch(snackbarSuccess('invoice:paymentMethod.detach.pm_deleted'));
      if (options && options.onSuccess) {
        options.onSuccess();
      }
    } catch (err) {
      console.error(err);
      dispatch(detachPaymentMethodActions.success({}));
      if (isErrorWithCustomCode(err) && err.response.data?.error_code) {
        dispatch(
          snackbarError(`paymentMethod.errors.${err.response.data.error_code}`),
        );
      }
      if (options && options.onError) {
        options.onError(err);
      }
      dispatch(detachPaymentMethodActions.error(err.response?.data || err));
    }
    dispatch(detachPaymentMethodActions.isLoading(false));
  };
}

export const setPaymentMethodAsDefaultActions = {
  isLoading: createAction('PAYMENT_METHOD/SET_DEFAULT/LOADING'),
  error: createAction('PAYMENT_METHOD/SET_DEFAULT/ERROR'),
  success: createAction('PATMENT_METHOD/SET_DEFAULT/SUCCESS'),
};
export function setPaymentMethodAsDefault(
  params: any,
  options?: OptionCallback,
) {
  return async (dispatch: Dispatch) => {
    dispatch(setPaymentMethodAsDefaultActions.error(null));
    dispatch(setPaymentMethodAsDefaultActions.isLoading(true));
    try {
      const response = await setPaymentMethodAsDefaultAPI(params);
      dispatch(setPaymentMethodAsDefaultActions.success(response.data));
      if (options && options.onSuccess) {
        options.onSuccess();
      }
    } catch (err) {
      console.error(err);
      dispatch(setPaymentMethodAsDefaultActions.success({}));
      if (isErrorWithCustomCode(err) && err.response.data?.error_code) {
        dispatch(
          snackbarError(`paymentMethod.errors.${err.response.data.error_code}`),
        );
      }
      if (options && options.onError) {
        options.onError(err);
      }
      dispatch(
        setPaymentMethodAsDefaultActions.error(err.response?.data || err),
      );
    }
    dispatch(setPaymentMethodAsDefaultActions.isLoading(false));
  };
}

export const onSpotPaymentReportActions = {
  isLoading: createAction('ON-SPOT-PAYMENT/REPORT/LOADING'),
  error: createAction('ON-SPOT-PAYMENT/REPORT/ERROR'),
  success: createAction('ON-SPOT-PAYMENT/REPORT/SUCCESS'),
};

export function fetchOnSpotPaymentReport(
  params: any = {},
  options: OptionCallback<ReportConfiguration>,
): ThunkAction {
  return async (dispatch: Dispatch) => {
    dispatch(onSpotPaymentReportActions.isLoading(true));
    dispatch(onSpotPaymentReportActions.error(null));
    try {
      const response = await fetchOnSpotPaymentReportAPI(params);
      dispatch(onSpotPaymentReportActions.success(response.data));
      if (options && options.onSuccess) {
        options.onSuccess(response.data);
      }
    } catch (err) {
      dispatch(onSpotPaymentReportActions.error(err));
    }
    dispatch(onSpotPaymentReportActions.isLoading(false));
  };
}

export const listPaymentGroupActions = {
  isLoading: createAction('PAYMENT_GROUP/LIST/LOADING'),
  error: createAction('PAYMENT_GROUP/LIST/ERROR'),
  success: createAction('PAYMENT_GROUP/LIST/SUCCESS'),
};

export function fetchPaymentGroupList(
  params: any = {},
  options: OptionCallback,
): ThunkAction {
  return async (dispatch: Dispatch) => {
    dispatch(listPaymentGroupActions.isLoading(true));
    dispatch(listPaymentGroupActions.error(null));
    try {
      const response = await fetchPaymentGroupListAPI(params);
      dispatch(listPaymentGroupActions.success(response.data));
      if (options && options.onSuccess) {
        options.onSuccess(response.data);
      }
    } catch (err) {
      console.error(err);
      dispatch(listPaymentGroupActions.error(err));
    }
    dispatch(listPaymentGroupActions.isLoading(false));
  };
}

export const incrementalListPayoutActions = {
  isLoading: createAction('PAYOUT/INCREMENTAL_LIST/LOADING'),
  error: createAction('PAYOUT/INCREMENTAL_LIST/ERROR'),
  success: createAction('PAYOUT/INCREMENTAL_LIST/SUCCESS'),
  reset: createAction('PAYOUT/INCREMENTAL_LIST/RESET'),
};

export function resetIncrementalPayouList() {
  return async (dispatch: Dispatch) => {
    dispatch(incrementalListPayoutActions.reset());
  };
}

export function fetchIncrementalPayoutList(
  params: any = {},
  options?: OptionCallback<Payout[]>,
): ThunkAction {
  return async (dispatch: Dispatch) => {
    dispatch(incrementalListPayoutActions.isLoading(true));
    dispatch(incrementalListPayoutActions.error(null));

    try {
      const response = await fetchPayoutListAPI({
        ...(params || {}),
      });
      dispatch(incrementalListPayoutActions.success(response.data));
      if (options && options.onSuccess) {
        options.onSuccess(response.data);
      }
    } catch (err) {
      console.error(err);
      dispatch(incrementalListPayoutActions.error(err));
    }
    dispatch(incrementalListPayoutActions.isLoading(false));
  };
}

export const listPayoutActions = {
  isLoading: createAction('PAYOUT/LIST/LOADING'),
  error: createAction('PAYOUT/LIST/ERROR'),
  success: createAction('PAYOUT/LIST/SUCCESS'),
};

export function fetchPayoutList(
  params: any = {},
  options?: OptionCallback<Payout[]>,
): ThunkAction {
  return async (dispatch: Dispatch, getState: () => RootState) => {
    dispatch(listPayoutActions.isLoading(true));
    dispatch(listPayoutActions.error(null));
    const { nextPage } = getState().paymentBackend.payout;
    try {
      const response = await fetchPayoutListAPI({
        ...(params || {}),
        page: nextPage,
      });
      dispatch(listPayoutActions.success({ ...response.data, page: nextPage }));
      if (options && options.onSuccess) {
        options.onSuccess(response.data);
      }
    } catch (err) {
      console.error(err);
      dispatch(listPayoutActions.error(err));
    }
    dispatch(listPayoutActions.isLoading(false));
  };
}

export const updatePaymentGroupPriceCtsActions = {
  isLoading: createAction('PAYMENT_GROUP/UPDATE_PRICE/LOADING'),
  error: createAction('PAYMENT_GROUP/UPDATE_PRICE/ERROR'),
  success: createAction('PAYMENT_GROUP/UPDATE_PRICE/SUCCESS'),
};

export function updatePaymentGroupPriceCts(
  id: number,
  price_cts: number,
  options: OptionCallback<PaymentGroup>,
): ThunkAction {
  return async (dispatch: Dispatch) => {
    dispatch(updatePaymentGroupPriceCtsActions.isLoading(true));
    dispatch(updatePaymentGroupPriceCtsActions.error(null));
    try {
      const response = await updatePaymentGroupPriceCtsAPI(id, price_cts);
      dispatch(updatePaymentGroupPriceCtsActions.success(response.data));
      if (options && options.onSuccess) {
        options.onSuccess(response.data);
      }
    } catch (err) {
      console.error(err);
      dispatch(updatePaymentGroupPriceCtsActions.error(err));
    }
    dispatch(updatePaymentGroupPriceCtsActions.isLoading(false));
  };
}

export const submitInternalPaymentInBackgroundActions = {
  error: createAction<{ invoiceUuid: string; error: Error }>(
    'PAYMENT_GROUP/INTERNAL_PAYMENT_BACKGROUND/ERROR',
  ),
  loading: createAction<{ invoiceUuid: string; loading: boolean }>(
    'PAYMENT_GROUP/INTERNAL_PAYMENT_BACKGROUND/IS_LOADING',
  ),
};

export function submitInternalPaymentInBackground(
  paymentGroupId: number,
  invoiceUuid: string,
  data: InternalPaymentPayload,
  options?: OptionBackgroundCallback<
    { paymentGroupId: number; invoiceUuid: string },
    { paymentGroupId: number; invoiceUuid: string }
  >,
) {
  return async (dispatch: Dispatch) => {
    dispatch(
      submitInternalPaymentInBackgroundActions.loading({
        invoiceUuid,
        loading: true,
      }),
    );
    dispatch(
      submitInternalPaymentInBackgroundActions.error({
        invoiceUuid,
        error: null,
      }),
    );

    try {
      const response = await submitInternalPaymentInBackgroundAPI(
        paymentGroupId,
        data,
      );

      const backgroundTaskUuid = response.headers['x-background-task-uuid'];
      dispatch(
        monitorBackgroundTask(backgroundTaskUuid, {
          onError: (err) => {
            console.error(err);
            if (options?.onBackgroundError) options.onBackgroundError(err);
          },
          onSuccess: () => {
            dispatch(
              submitInternalPaymentInBackgroundActions.loading({
                invoiceUuid,
                loading: false,
              }),
            );
            if (options && options.onBackgroundSuccess) {
              options.onBackgroundSuccess({
                paymentGroupId,
                invoiceUuid,
              });
            }
          },
        }),
      );

      if (options && options.onSuccess) {
        options.onSuccess();
      }
    } catch (error) {
      console.error(error);
      dispatch(
        submitInternalPaymentInBackgroundActions.error({
          invoiceUuid,
          error,
        }),
      );
      if (options && options.onError) options.onError(error);
    }
  };
}

// -------------- STRIPE --------------

export const stripeBalanceActions = {
  isLoading: createAction<boolean>('STRIPE_BALANCE/LOADING'),
  error: createAction<Error | null>('STRIPE_BALANCE/ERROR'),
  success: createAction<StripeBalance>('STRIPE_BALANCE/SUCCESS'),
};

export function fetchStripeBalance(
  options?: OptionCallback<StripeBalance[]>,
): ThunkAction {
  return async (dispatch) => {
    dispatch(stripeBalanceActions.isLoading(true));
    dispatch(stripeBalanceActions.error(null));
    try {
      const response = await fetchStripeBalanceAPI();

      dispatch(stripeBalanceActions.success(response.data));
      options?.onSuccess?.(response.data);
    } catch (err) {
      console.error(err);
      dispatch(stripeBalanceActions.error(err));
      options?.onError?.(err);
    }
    dispatch(stripeBalanceActions.isLoading(false));
  };
}

export const listStripePayoutActions = {
  isLoading: createAction<boolean>('STRIPE_PAYOUT/LIST/LOADING'),
  error: createAction<Error | null>('STRIPE_PAYOUT/LIST/ERROR'),
  success: createAction<StripePayout>('STRIPE_PAYOUT/LIST/SUCCESS'),
};

export function fetchStripePayoutList(
  params: {
    page_size: number;
    starting_after?: string;
  },
  options?: OptionCallback<Payout[]>,
): ThunkAction {
  return async (dispatch, getState: () => RootState) => {
    dispatch(listStripePayoutActions.isLoading(true));
    dispatch(listStripePayoutActions.error(null));
    const { startingAfter } = getState().paymentBackend.stripePayout;

    try {
      const response = await fetchStripePayoutListAPI({
        ...(params || {}),
        ...(startingAfter ? { starting_after: startingAfter } : {}),
      });

      dispatch(listStripePayoutActions.success(response.data));
      options?.onSuccess?.(response.data);
    } catch (err) {
      console.error(err);
      dispatch(listStripePayoutActions.error(err));
      options?.onError?.(err);
    }
    dispatch(listStripePayoutActions.isLoading(false));
  };
}
