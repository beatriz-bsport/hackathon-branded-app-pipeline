import { createAction } from 'redux-actions';
import { isErrorWithCustomCode } from '#src/libs/utils';
import { CUSTOM_ERROR_CODE } from '#src/libs/constants';
import { AxiosResponse } from 'axios';
import type {
  Dispatch,
  OptionBackgroundCallback,
  OptionCallback,
  ThunkAction,
} from '#src/state/types';
import type { RootState } from '#src/reducers';
import type { ReportConfiguration } from '#src/libs/reporting/common/types';
import { snackbarError, snackbarSuccess } from '../snackbar/actions';
import { monitorBackgroundTask } from '../background-task/actions';
import {
  checkStripePaymentMethodDomainRegistration as checkStripePaymentMethodDomainRegistrationAPI,
  createBookkeepingAccount as createBookkeepingAccountAPI,
  createPaymentAttempt as createPaymentAttemptAPI,
  createPaymentAttemptWebview as createPaymentAttemptWebviewAPI,
  deleteBookkeepingAccount as deleteBookkeepingAccountAPI,
  detachPaymentMethod as detachPaymentMethodAPI,
  executePaymentAttempt as executePaymentAttemptAPI,
  executePaymentAttemptWebview as executePaymentAttemptWebviewAPI,
  fetchBookkeepingAccountList as fetchBookkeepingAccountListAPI,
  fetchOnSpotPaymentReport as fetchOnSpotPaymentReportAPI,
  fetchPaymentGroupList as fetchPaymentGroupListAPI,
  fetchPaymentMethodList as fetchPaymentMethodListAPI,
  fetchPayoutListLegacy as fetchPayoutListLegacyAPI,
  fetchPayoutList as fetchPayoutListAPI,
  fetchPayoutBalanceTransactions as fetchPayoutBalanceTransactionsAPI,
  fetchStripeBalance as fetchStripeBalanceAPI,
  fetchStripePaymentMethodDomains as fetchStripePaymentMethodDomainsAPI,
  fetchStripePayoutList as fetchStripePayoutListAPI,
  getLinkedProductNames as getLinkedProductNamesAPI,
  getPaymentGroup as getPaymentGroupAPI,
  getPaymentGroupStatus as getPaymentGroupStatusAPI,
  registerStripePaymentMethodDomain as registerStripePaymentMethodDomainAPI,
  requestSetupIntentSecret as requestSetupIntentSecretAPI,
  setBillingEstablishmentOnCompletedPaymentGroupStatus as setBillingEstablishmentOnCompletedPaymentGroupStatusAPI,
  setPaymentMethodAsDefault as setPaymentMethodAsDefaultAPI,
  submitInternalPaymentInBackground as submitInternalPaymentInBackgroundAPI,
  updateBookkeepingAccount as updateBookkeepingAccountAPI,
  updatePaymentGroupPriceCts as updatePaymentGroupPriceCtsAPI,
} from './api';
import { requestClientSecret as requestClientSecretAPI } from '#src/libs/invoice/api';
import type {
  BalanceTransaction,
  BookkeepingAccount,
  BookkeepingAccountSubmitParams,
  DetachPaymentMethodPayload,
  DetachPaymentMethodResponse,
  fetchBookkeepingAccountListFilter,
  InternalPaymentPayload,
  PaymentGroup,
  PaymentGroupBillingEstablishmentPayload,
  PaymentMethod,
  Payout,
  PayoutLegacy,
  StripeBalance,
  StripePaymentMethodDomain,
  StripePayout,
} from './types';
import { RequestClientSecretPayload } from '../invoice/types';

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
  isLoading: createAction<boolean>('PAYMENT_METHOD/DETACH/LOADING'),
  error: createAction<Error | null>('PAYMENT_METHOD/DETACH/ERROR'),
  success: createAction<DetachPaymentMethodResponse | {}>(
    'PATMENT_METHOD/DETACH/SUCCESS',
  ),
};

export function detachPaymentMethod(
  payload: DetachPaymentMethodPayload,
  options?: OptionCallback<unknown, number>,
) {
  return async (dispatch: Dispatch) => {
    dispatch(detachPaymentMethodActions.error(null));
    dispatch(detachPaymentMethodActions.isLoading(true));
    try {
      const response = await detachPaymentMethodAPI(payload);
      dispatch(detachPaymentMethodActions.success(response.data));
      dispatch(snackbarSuccess('invoice:paymentMethod.detach.pm_deleted'));
      options?.onSuccess?.();
    } catch (err) {
      console.error(err);
      dispatch(detachPaymentMethodActions.success({}));
      if (isErrorWithCustomCode(err) && err.response.data?.error_code) {
        dispatch(
          snackbarError(`paymentMethod.errors.${err.response.data.error_code}`),
        );
      }
      options?.onError?.(err.response.data.error_code);
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
        // @ts-expect-error
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
        // @ts-expect-error
        options.onSuccess(response.data);
      }
    } catch (err) {
      console.error(err);
      dispatch(listPaymentGroupActions.error(err));
    }
    dispatch(listPaymentGroupActions.isLoading(false));
  };
}

export const fetchPaymentGroupActions = {
  isLoading: createAction<boolean>('PAYMENT_GROUP/FETCH/LOADING'),
  error: createAction<Error | null>('PAYMENT_GROUP/FETCH/ERROR'),
  success: createAction<PaymentGroup>('PAYMENT_GROUP/FETCH/SUCCESS'),
};

export function fetchPaymentGroup(
  params: { id: number },
  options?: OptionCallback<PaymentGroup>,
) {
  return async (dispatch: Dispatch) => {
    dispatch(fetchPaymentGroupActions.isLoading(true));
    dispatch(fetchPaymentGroupActions.error(null));
    try {
      const response = await getPaymentGroupAPI(params.id);
      dispatch(fetchPaymentGroupActions.success(response.data));
      options?.onSuccess?.(response.data);
    } catch (err) {
      dispatch(fetchPaymentGroupActions.error(err));
      options?.onError?.(err);
    }
    dispatch(fetchPaymentGroupActions.isLoading(false));
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
  options?: OptionCallback<PayoutLegacy[]>,
): ThunkAction {
  return async (dispatch: Dispatch) => {
    dispatch(incrementalListPayoutActions.isLoading(true));
    dispatch(incrementalListPayoutActions.error(null));

    try {
      const response = await fetchPayoutListLegacyAPI({
        ...(params || {}),
      });
      dispatch(incrementalListPayoutActions.success(response.data));
      if (options && options.onSuccess) {
        // @ts-expect-error
        options.onSuccess(response.data);
      }
    } catch (err) {
      console.error(err);
      dispatch(incrementalListPayoutActions.error(err));
    }
    dispatch(incrementalListPayoutActions.isLoading(false));
  };
}

export const listPayoutLegacyActions = {
  isLoading: createAction('PAYOUT_LEGACY/LIST/LOADING'),
  error: createAction('PAYOUT_LEGACY/LIST/ERROR'),
  success: createAction('PAYOUT_LEGACY/LIST/SUCCESS'),
};

export function fetchPayoutListLegacy(
  params: any = {},
  options?: OptionCallback<PayoutLegacy[]>,
): ThunkAction {
  return async (dispatch: Dispatch, getState: () => RootState) => {
    dispatch(listPayoutLegacyActions.isLoading(true));
    dispatch(listPayoutLegacyActions.error(null));
    const { nextPage } = getState().paymentBackend.payoutLegacy;
    try {
      const response = await fetchPayoutListLegacyAPI({
        ...(params || {}),
        page: nextPage,
      });
      dispatch(
        // @ts-expect-error
        listPayoutLegacyActions.success({ ...response.data, page: nextPage }),
      );
      if (options && options.onSuccess) {
        // @ts-expect-error
        options.onSuccess(response.data);
      }
    } catch (err) {
      console.error(err);
      dispatch(listPayoutLegacyActions.error(err));
    }
    dispatch(listPayoutLegacyActions.isLoading(false));
  };
}

export const fetchPaymentGroupStatusActions = {
  isLoading: createAction('PAYMENT_GROUP/STATUS/LOADING'),
  error: createAction('PAYMENT_GROUP/STATUS/ERROR'),
  success: createAction('PAYMENT_GROUP/STATUS/SUCCESS'),
};

export function fetchPaymentGroupStatus(
  paymentGroupId: number,
  options?: OptionCallback<number>,
): ThunkAction {
  return async (dispatch: Dispatch) => {
    dispatch(fetchPaymentGroupStatusActions.isLoading(true));
    dispatch(fetchPaymentGroupStatusActions.error(null));
    try {
      const response = await getPaymentGroupStatusAPI(paymentGroupId);
      dispatch(fetchPaymentGroupStatusActions.success(response.data));
      if (options && options.onSuccess) {
        options.onSuccess(response.data);
      }
    } catch (err) {
      console.error(err);
      dispatch(fetchPaymentGroupStatusActions.error(err));
    }
    dispatch(fetchPaymentGroupStatusActions.isLoading(false));
  };
}

export const createPaymentAttemptActions = {
  isLoading: createAction('PAYMENT_ATTEMPT/CREATE/LOADING'),
  error: createAction('PAYMENT_ATTEMPT/CREATE/ERROR'),
  success: createAction('PAYMENT_ATTEMPT/CREATE/SUCCESS'),
};

export function createPaymentAttempt(
  paymentGroupId: number,
  fromApp: boolean,
  basketId?: string,
  options?: OptionCallback<PaymentGroup>,
): ThunkAction {
  // Eslint is disabled because of the return pattern needed in the case of PayPal payments explained below

  return async (dispatch: Dispatch) => {
    dispatch(createPaymentAttemptActions.isLoading(true));
    dispatch(createPaymentAttemptActions.error(null));
    try {
      const createPaymentAttemptMethod: ({
        paymentGroupId,
        basketId,
      }: {
        paymentGroupId: number;
        basketId?: string;
      }) => Promise<AxiosResponse> = fromApp
        ? createPaymentAttemptWebviewAPI
        : createPaymentAttemptAPI;

      const response = await createPaymentAttemptMethod({
        paymentGroupId,
        ...(fromApp ? { basketId } : {}),
      });

      dispatch(createPaymentAttemptActions.success(response.data));
      if (options && options.onSuccess) {
        options.onSuccess(response.data);
      }
      // Needed in the case of PayPal payments, since the PayPal SDK requires a callback returning a Promise<string> to retrieve the Order id
      return {
        id: response.data.payment_attempt_id,
        amount: response.data.payment_attempt_amount,
      };
    } catch (err) {
      console.error(err);
      dispatch(createPaymentAttemptActions.error(err));
    } finally {
      dispatch(createPaymentAttemptActions.isLoading(false));
    }
  };
}

export function executePaymentAttempt(
  paymentGroupId: number,
  fromApp: boolean,
  basketId?: string,
  options?: OptionCallback<PaymentGroup>,
): ThunkAction {
  return async () => {
    try {
      const executePaymentAttemptMethod: ({
        paymentGroupId,
        basketId,
      }: {
        paymentGroupId: number;
        basketId?: string;
      }) => Promise<AxiosResponse> = fromApp
        ? executePaymentAttemptWebviewAPI
        : executePaymentAttemptAPI;

      const response = await executePaymentAttemptMethod({
        paymentGroupId,
        ...(fromApp ? { basketId } : {}),
      });

      if (options && options.onSuccess) {
        options.onSuccess(response.data);
      }
    } catch (err) {
      console.error(err);
      if (options && options.onError) {
        options.onError(err);
      }
    }
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

      // @ts-expect-error
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
  options?: OptionCallback<PayoutLegacy[]>,
): ThunkAction {
  return async (dispatch, getState: () => RootState) => {
    dispatch(listStripePayoutActions.isLoading(true));
    dispatch(listStripePayoutActions.error(null));
    const { startingAfter } = getState().paymentBackend.stripePayout;

    try {
      // @ts-expect-error
      const response = await fetchStripePayoutListAPI({
        ...(params || {}),
        ...(startingAfter ? { starting_after: startingAfter } : {}),
      });

      // @ts-expect-error
      dispatch(listStripePayoutActions.success(response.data));
      // @ts-expect-error
      options?.onSuccess?.(response.data);
    } catch (err) {
      console.error(err);
      dispatch(listStripePayoutActions.error(err));
      options?.onError?.(err);
    }
    dispatch(listStripePayoutActions.isLoading(false));
  };
}

export const listPayoutActions = {
  isLoading: createAction<boolean>('PAYOUT_RECONCILIATION/LIST/LOADING'),
  isLoadingMore: createAction<boolean>(
    'PAYOUT_RECONCILIATION/LIST/LOADING_MORE',
  ),
  error: createAction<string | null>('PAYOUT_RECONCILIATION/LIST/ERROR'),
  success: createAction<{
    results: Payout[];
    nextPage: number | null;
    append: boolean;
  }>('PAYOUT_RECONCILIATION/LIST/SUCCESS'),
};

export function fetchPayoutList(
  params: { page: number; append?: boolean },
  options?: OptionCallback<{ results: Payout[]; next_page: number | null }>,
): ThunkAction {
  return async (dispatch: Dispatch) => {
    const { page, append = false } = params;
    if (append) {
      dispatch(listPayoutActions.isLoadingMore(true));
    } else {
      dispatch(listPayoutActions.isLoading(true));
    }
    dispatch(listPayoutActions.error(null));
    try {
      const response = await fetchPayoutListAPI({ page });
      dispatch(
        listPayoutActions.success({
          results: response.data.results,
          nextPage: response.data.next_page,
          append,
        }),
      );
      options?.onSuccess?.({
        results: response.data.results,
        next_page: response.data.next_page,
      });
    } catch (err: any) {
      dispatch(
        listPayoutActions.error(err?.message ?? 'Failed to load payouts'),
      );
      options?.onError?.(err);
    } finally {
      if (append) {
        dispatch(listPayoutActions.isLoadingMore(false));
      } else {
        dispatch(listPayoutActions.isLoading(false));
      }
    }
  };
}

export const listPayoutBalanceTransactionsActions = {
  isLoading: createAction<{ payoutId: number; loading: boolean }>(
    'PAYOUT_BALANCE_TRANSACTIONS/LIST/LOADING',
  ),
  isLoadingMore: createAction<{ payoutId: number; loading: boolean }>(
    'PAYOUT_BALANCE_TRANSACTIONS/LIST/LOADING_MORE',
  ),
  error: createAction<{ payoutId: number; error: string | null }>(
    'PAYOUT_BALANCE_TRANSACTIONS/LIST/ERROR',
  ),
  success: createAction<{
    payoutId: number;
    results: BalanceTransaction[];
    nextPage: number | null;
    append: boolean;
  }>('PAYOUT_BALANCE_TRANSACTIONS/LIST/SUCCESS'),
};

export function fetchPayoutBalanceTransactions(
  params: { payoutId: number; page: number; append?: boolean },
  options?: OptionCallback<{
    results: BalanceTransaction[];
    next_page: number | null;
  }>,
): ThunkAction {
  return async (dispatch: Dispatch) => {
    const { payoutId, page, append = false } = params;
    if (append) {
      dispatch(
        listPayoutBalanceTransactionsActions.isLoadingMore({
          payoutId,
          loading: true,
        }),
      );
    } else {
      dispatch(
        listPayoutBalanceTransactionsActions.isLoading({
          payoutId,
          loading: true,
        }),
      );
    }
    dispatch(
      listPayoutBalanceTransactionsActions.error({ payoutId, error: null }),
    );
    try {
      const response = await fetchPayoutBalanceTransactionsAPI({
        payout_id: payoutId,
        page,
      });
      dispatch(
        listPayoutBalanceTransactionsActions.success({
          payoutId,
          results: response.data.results,
          nextPage: response.data.next_page,
          append,
        }),
      );
      options?.onSuccess?.({
        results: response.data.results,
        next_page: response.data.next_page,
      });
    } catch (err: any) {
      dispatch(
        listPayoutBalanceTransactionsActions.error({
          payoutId,
          error: err?.message ?? 'Failed to load transactions',
        }),
      );
      options?.onError?.(err);
    } finally {
      if (append) {
        dispatch(
          listPayoutBalanceTransactionsActions.isLoadingMore({
            payoutId,
            loading: false,
          }),
        );
      } else {
        dispatch(
          listPayoutBalanceTransactionsActions.isLoading({
            payoutId,
            loading: false,
          }),
        );
      }
    }
  };
}

export const checkStripeDomainActions = {
  isLoading: createAction<boolean>('STRIPE_DOMAIN/CHECK/LOADING'),
  error: createAction<Error | null>('STRIPE_DOMAIN/CHECK/ERROR'),
  success: createAction<{ is_registered: boolean }>(
    'STRIPE_DOMAIN/CHECK/SUCCESS',
  ),
};

export const listStripeDomainActions = {
  isLoading: createAction<boolean>('STRIPE_DOMAIN/LIST/LOADING'),
  error: createAction<Error | null>('STRIPE_DOMAIN/LIST/ERROR'),
  success: createAction<StripePaymentMethodDomain[]>(
    'STRIPE_DOMAIN/LIST/SUCCESS',
  ),
};

export const registerStripeDomainActions = {
  isLoading: createAction<boolean>('STRIPE_DOMAIN/REGISTER/LOADING'),
  error: createAction<Error | null>('STRIPE_DOMAIN/REGISTER/ERROR'),
  success: createAction<StripePaymentMethodDomain>(
    'STRIPE_DOMAIN/REGISTER/SUCCESS',
  ),
};

export function checkStripePaymentMethodDomainRegistration(
  companyId: number,
  options?: OptionCallback<{ is_registered: boolean }>,
): ThunkAction {
  return async (dispatch: Dispatch) => {
    dispatch(checkStripeDomainActions.isLoading(true));
    dispatch(checkStripeDomainActions.error(null));
    try {
      const response = await checkStripePaymentMethodDomainRegistrationAPI(
        companyId,
      );
      dispatch(checkStripeDomainActions.success(response.data));
      options?.onSuccess?.(response.data);
    } catch (err) {
      console.error(err);
      dispatch(checkStripeDomainActions.error(err));
      options?.onError?.(err);
    } finally {
      dispatch(checkStripeDomainActions.isLoading(false));
    }
  };
}

export function fetchStripePaymentMethodDomains(
  options?: OptionCallback<StripePaymentMethodDomain[]>,
): ThunkAction {
  return async (dispatch: Dispatch) => {
    dispatch(listStripeDomainActions.isLoading(true));
    dispatch(listStripeDomainActions.error(null));
    try {
      const response = await fetchStripePaymentMethodDomainsAPI();
      dispatch(listStripeDomainActions.success(response.data));
      options?.onSuccess?.(response.data);
    } catch (err) {
      console.error(err);
      dispatch(listStripeDomainActions.error(err));
      options?.onError?.(err);
    } finally {
      dispatch(listStripeDomainActions.isLoading(false));
    }
  };
}

export function registerStripePaymentMethodDomain(
  domain_name: string,
  options?: OptionCallback<StripePaymentMethodDomain>,
): ThunkAction {
  return async (dispatch: Dispatch) => {
    dispatch(registerStripeDomainActions.isLoading(true));
    dispatch(registerStripeDomainActions.error(null));
    try {
      const response = await registerStripePaymentMethodDomainAPI(domain_name);
      dispatch(registerStripeDomainActions.success(response.data));
      options?.onSuccess?.(response.data);
    } catch (err) {
      console.error(err);
      dispatch(registerStripeDomainActions.error(err));
      options?.onError?.(err);
    } finally {
      dispatch(registerStripeDomainActions.isLoading(false));
    }
  };
}

// -------------- Bookkeeping Accounts --------------

export const createBookkeepingAccountActions = {
  isLoading: createAction<boolean>('BOOKKEEPING_ACCOUNT/CREATE/LOADING'),
  error: createAction<Error | null>('BOOKKEEPING_ACCOUNT/CREATE/ERROR'),
  success: createAction<BookkeepingAccount | null>(
    'BOOKKEEPING_ACCOUNT/CREATE/SUCCESS',
  ),
};

export const updateBookkeepingAccountActions = {
  isLoading: createAction<boolean>('BOOKKEEPING_ACCOUNT/UPDATE/LOADING'),
  error: createAction<Error | null>('BOOKKEEPING_ACCOUNT/UPDATE/ERROR'),
  success: createAction<BookkeepingAccount | null>(
    'BOOKKEEPING_ACCOUNT/UPDATE/SUCCESS',
  ),
};

export const deleteBookkeepingAccountActions = {
  isLoading: createAction<boolean>('BOOKKEEPING_ACCOUNT/DELETE/LOADING'),
  error: createAction<Error | null>('BOOKKEEPING_ACCOUNT/DETETE/ERROR'),
};

export const listBookkeepingAccountActions = {
  isLoading: createAction<boolean>('BOOKKEEPING_ACCOUNT/LIST/LOADING'),
  error: createAction<Error | null>('BOOKKEEPING_ACCOUNT/LIST/ERROR'),
  success: createAction<StripePayout>('BOOKKEEPING_ACCOUNT/LIST/SUCCESS'),
};

export const getLinkedProductNamesActions = {
  isLoading: createAction<boolean>(
    'BOOKKEEPING_ACCOUNT/GET_LINKED_PRODUCTS/LOADING',
  ),
  error: createAction<Error | null>(
    'BOOKKEEPING_ACCOUNT/GET_LINKED_PRODUCTS/ERROR',
  ),
  success: createAction<string[]>(
    'BOOKKEEPING_ACCOUNT/GET_LINKED_PRODUCTS/SUCCESS',
  ),
};

export function fetchBookkeepingAccountList(
  params: fetchBookkeepingAccountListFilter = {},
  options?: OptionCallback<BookkeepingAccount[]>,
): ThunkAction {
  return async (dispatch) => {
    dispatch(listBookkeepingAccountActions.isLoading(true));
    dispatch(listBookkeepingAccountActions.error(null));
    try {
      const response = await fetchBookkeepingAccountListAPI(params);
      // @ts-expect-error
      dispatch(listBookkeepingAccountActions.success(response.data));
      options?.onSuccess?.(response.data);
    } catch (err) {
      console.error(err);
      dispatch(listBookkeepingAccountActions.error(err?.response?.status));
      options?.onError?.(err);
    } finally {
      dispatch(listBookkeepingAccountActions.isLoading(false));
    }
  };
}

export const createBookkeepingAccount =
  (
    data: BookkeepingAccountSubmitParams,
    options?: OptionCallback<BookkeepingAccount>,
  ): ThunkAction =>
  async (dispatch) => {
    dispatch(createBookkeepingAccountActions.isLoading(true));
    dispatch(createBookkeepingAccountActions.error(null));
    try {
      const response = await createBookkeepingAccountAPI(data);
      dispatch(createBookkeepingAccountActions.success(response.data));
      options?.onSuccess?.(response.data);
      dispatch(snackbarSuccess('bookkeeping_account.create.success'));
    } catch (err) {
      console.error(err);
      dispatch(createBookkeepingAccountActions.error(err?.response?.status));
      if (err?.response?.status === CUSTOM_ERROR_CODE) {
        dispatch(
          snackbarError(
            `bookkeeping_account.errors.${err.response.data.error_code}`,
          ),
        );
      } else {
        dispatch(snackbarError('bookkeeping_account.create.error'));
      }
      options?.onError?.(err);
    } finally {
      dispatch(createBookkeepingAccountActions.isLoading(false));
    }
  };

export const updateBookkeepingAccount =
  (
    id: number,
    data: BookkeepingAccountSubmitParams,
    options?: OptionCallback<BookkeepingAccount>,
  ): ThunkAction =>
  async (dispatch) => {
    dispatch(updateBookkeepingAccountActions.isLoading(true));
    dispatch(updateBookkeepingAccountActions.error(null));
    try {
      const response = await updateBookkeepingAccountAPI(id, data);
      dispatch(updateBookkeepingAccountActions.success(response.data));
      options?.onSuccess?.(response.data);
      dispatch(snackbarSuccess('bookkeeping_account.update.success'));
    } catch (err) {
      console.error(err);
      dispatch(updateBookkeepingAccountActions.error(err?.response?.status));
      if (err?.response?.status === CUSTOM_ERROR_CODE) {
        dispatch(
          snackbarError(
            `bookkeeping_account.errors.${err.response.data.error_code}`,
          ),
        );
      } else {
        dispatch(snackbarError('bookkeeping_account.update.error'));
      }
      options?.onError?.(err);
    } finally {
      dispatch(updateBookkeepingAccountActions.isLoading(false));
    }
  };

export const deleteBookkeepingAccount =
  (id: number, options?: OptionCallback<null>): ThunkAction =>
  async (dispatch) => {
    dispatch(deleteBookkeepingAccountActions.isLoading(true));
    dispatch(deleteBookkeepingAccountActions.error(null));
    try {
      await deleteBookkeepingAccountAPI(id);
      options?.onSuccess?.();
      dispatch(snackbarSuccess('bookkeeping_account.delete.success'));
    } catch (err) {
      console.error(err);
      dispatch(deleteBookkeepingAccountActions.error(err?.respons?.status));
      dispatch(snackbarError('bookkeeping_account.delete.error'));
      options?.onError?.(err);
    } finally {
      dispatch(deleteBookkeepingAccountActions.isLoading(false));
    }
  };

export const fetchLinkedProductNames = (
  bookkeepingAccountId: number,
  options?: OptionCallback<string[]>,
): ThunkAction => {
  return async (dispatch) => {
    dispatch(getLinkedProductNamesActions.isLoading(true));
    dispatch(getLinkedProductNamesActions.error(null));
    try {
      const response = await getLinkedProductNamesAPI(bookkeepingAccountId);
      dispatch(getLinkedProductNamesActions.success(response.data));
      options?.onSuccess?.(response.data);
    } catch (err) {
      console.error(err);
      dispatch(getLinkedProductNamesActions.error(err?.response?.status));
      options?.onError?.(err);
    } finally {
      dispatch(getLinkedProductNamesActions.isLoading(false));
    }
  };
};

export const requestSetupIntentSecretActions = {
  isLoading: createAction<boolean>(
    'PAYMENT/REQUEST_SETUP_INTENT_SECRET/IS_LOADING',
  ),
  error: createAction<Error | null>(
    'PAYMENT/REQUEST_SETUP_INTENT_SECRET/ERROR',
  ),
  success: createAction<{ client_secret: string }>(
    'PAYMENT/REQUEST_SETUP_INTENT_SECRET/SUCCESS',
  ),
};

/**
 * Retrieves the Stripe client secret. Only used for widget.
 * @param member Optional membership ID
 * @param company Optional company ID
 * @param as_company Retrieve the client secret as company
 * @param payment_method Optional payment method ID
 */
export function requestSetupIntentSecret(
  {
    member,
    company,
    as_company,
    payment_method,
  }: {
    member?: number;
    company?: number;
    as_company?: boolean;
    payment_method?: string;
  },
  options?: OptionCallback<{ client_secret: string }>,
) {
  return async (dispatch: Dispatch) => {
    dispatch(requestSetupIntentSecretActions.isLoading(true));
    dispatch(requestSetupIntentSecretActions.error(null));
    try {
      const response = await requestSetupIntentSecretAPI(
        member,
        company,
        as_company,
        payment_method,
      );
      dispatch(requestSetupIntentSecretActions.success(response.data));
      options?.onSuccess?.(response.data);
    } catch (error) {
      dispatch(requestSetupIntentSecretActions.error(error));
      console.error(error);
      options?.onError?.(error);
    } finally {
      dispatch(requestSetupIntentSecretActions.isLoading(false));
    }
  };
}

export const requestClientSecretActions = {
  isLoading: createAction<boolean>('PAYMENT/REQUEST_CLIENT_SECRET/LOADING'),
  error: createAction<Error | null>('PAYMENT/REQUEST_CLIENT_SECRET/ERROR'),
  success: createAction<RequestClientSecretPayload>(
    'PAYMENT/REQUEST_CLIENT_SECRET/SUCCESS',
  ),
};

export function requestClientSecret(
  params: {
    payment_engine_identifier: number;
    payment_intent_type: number;
    basket?: string;
    requested_price_cts?: number;
    invoice?: string;
    member?: string;
    is_physical_payment_intent?: boolean;
  },
  options?: OptionCallback<RequestClientSecretPayload>,
) {
  return async (dispatch: Dispatch) => {
    dispatch(requestSetupIntentSecretActions.isLoading(true));
    dispatch(requestSetupIntentSecretActions.error(null));
    try {
      const response = await requestClientSecretAPI(
        params.payment_engine_identifier,
        params.payment_intent_type,
        {
          invoice: params.invoice,
          member: params.member,
          requested_price_cts: params.requested_price_cts,
        },
      );
      dispatch(requestSetupIntentSecretActions.success(response.data));
      options?.onSuccess?.(response.data);
    } catch (error) {
      dispatch(requestSetupIntentSecretActions.error(error));
      console.error(error);
      options?.onError?.(error);
    } finally {
      dispatch(requestSetupIntentSecretActions.isLoading(false));
    }
  };
}

export const setPaymentGroupBillingEstablishmentActions = {
  isLoading: createAction<boolean>(
    'PAYMENT/SET_PAYMENT_GROUP_BILLING_ESTABLISHMENT/LOADING',
  ),
  error: createAction<Error | null>(
    'PAYMENT/SET_PAYMENT_GROUP_BILLING_ESTABLISHMENT/ERROR',
  ),
  success: createAction<number>(
    'PAYMENT/SET_PAYMENT_GROUP_BILLING_ESTABLISHMENT/SUCCESS',
  ),
};

export const setPaymentGroupBillingEstablishment = (
  params: PaymentGroupBillingEstablishmentPayload,
  options?: OptionCallback<number>,
) => {
  return async (dispatch: Dispatch) => {
    dispatch(setPaymentGroupBillingEstablishmentActions.isLoading(true));
    dispatch(setPaymentGroupBillingEstablishmentActions.error(null));
    try {
      const response =
        await setBillingEstablishmentOnCompletedPaymentGroupStatusAPI(
          params.paymentGroupId,
          params.establishmentId,
        );
      dispatch(
        setPaymentGroupBillingEstablishmentActions.success(response.data),
      );
      options?.onSuccess?.(response.data);
    } catch (error) {
      dispatch(setPaymentGroupBillingEstablishmentActions.error(error));
      console.error(error);
      options?.onError?.(error);
    } finally {
      dispatch(setPaymentGroupBillingEstablishmentActions.isLoading(false));
    }
  };
};
