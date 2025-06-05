import { createAction } from 'redux-actions';
import { AxiosError } from 'axios';
import {
  PaymentIntent,
  Stripe,
  StripeElements,
  StripeError,
} from '@stripe/stripe-js';

import { updateIntentToSavePaymentMethod as updateIntentToSavePaymentMethodAPI } from '#src/libs/payment/api';
import {
  applyBalanceToInvoice as applyBalanceToInvoiceAPI,
  detachPaymentMethod as detachPaymentMethodAPI,
  fetchPaymentMethodList as fetchPaymentMethodListAPI,
  getPaymentGroupStatus as getPaymentGroupStatusAPI,
  requestBasketClientSecret as requestBasketClientSecretAPI,
  requestInvoiceClientSecret as requestInvoiceClientSecretAPI,
} from '#src/libs/payment/payment-module-revamped/api';
import { snackbarError, snackbarSuccess } from '#src/libs/snackbar/actions';
import type { Dispatch, OptionCallback, ThunkAction } from '#src/state/types';
import { isErrorWithCustomCode } from '#src/libs/utils';

import {
  PaymentGroupStatus,
  type RequestClientSecretPayload,
} from '#src/libs/invoice/types';
import type { BillingDetails } from '#src/libs/marketplace/types';
import type {
  DetachPaymentMethodPayload,
  PaymentMethod,
  UpdatePaymentIntentArgs,
  UpdatePaymentIntentResult,
} from '#src/libs/payment/types';

export const applyBalanceToInvoiceActions = {
  isLoading: createAction<{ invoiceUuid: string; loading: boolean }>(
    'PAYMENT_MODULE/INVOICE/APPLY_BALANCE/LOADING',
  ),
  error: createAction<{ invoiceUuid: string; error: Error | null }>(
    'PAYMENT_MODULE/INVOICE/APPLY_BALANCE/ERROR',
  ),
  success: createAction<{ invoiceUuid: string; balance: string }>(
    'PAYMENT_MODULE/INVOICE/APPLY_BALANCE/SUCCESS',
  ),
  initialize: createAction<{ invoiceUuid: string }>(
    'PAYMENT_MODULE/INVOICE/APPLY_BALANCE/INITIALIZE',
  ),
};

export function applyBalanceToInvoice(uuid: string, options?: OptionCallback) {
  return async (dispatch: Dispatch) => {
    dispatch(
      applyBalanceToInvoiceActions.initialize({
        invoiceUuid: uuid,
      }),
    );
    dispatch(
      applyBalanceToInvoiceActions.isLoading({
        invoiceUuid: uuid,
        loading: true,
      }),
    );

    try {
      const response = await applyBalanceToInvoiceAPI(uuid);
      dispatch(
        applyBalanceToInvoiceActions.success({
          invoiceUuid: uuid,
          balance: response.data,
        }),
      );
      dispatch(snackbarSuccess('invoice.applyBalance.success'));
      if (options && options.onSuccess) {
        options.onSuccess();
      }
    } catch (error) {
      console.error(error);
      if (isErrorWithCustomCode(error) && error.response.data?.error_code) {
        dispatch(
          snackbarError(
            `invoice.applyBalance.errors.${error.response.data.error_code}`,
          ),
        );
      } else {
        dispatch(snackbarError('invoice.applyBalance.error'));
      }
      if (options && options.onError) {
        options.onError(error);
      }
      dispatch(
        applyBalanceToInvoiceActions.error({
          invoiceUuid: uuid,
          error,
        }),
      );
    }
    dispatch(
      applyBalanceToInvoiceActions.isLoading({
        invoiceUuid: uuid,
        loading: false,
      }),
    );
  };
}

export const requestInvoiceClientSecretActions = {
  isLoading: createAction<{ invoiceUuid: string; loading: boolean }>(
    'PAYMENT_MODULE/INVOICE/REQUEST_CLIENT_SECRET/LOADING',
  ),
  error: createAction<{ invoiceUuid: string; error: Error | null }>(
    'PAYMENT_MODULE/INVOICE/REQUEST_CLIENT_SECRET/ERROR',
  ),
  success: createAction<RequestClientSecretPayload & { invoiceUuid: string }>(
    'PAYMENT_MODULE/INVOICE/REQUEST_CLIENT_SECRET/SUCCESS',
  ),
  initialize: createAction<{ invoiceUuid: string }>(
    'PAYMENT_MODULE/INVOICE/REQUEST_CLIENT_SECRET/INITIALIZE',
  ),
};

export function resetInvoiceClientSecret(params: { invoiceUuid: string }) {
  return async (dispatch: Dispatch) => {
    dispatch(requestInvoiceClientSecretActions.initialize(params));
  };
}

export function requestInvoiceClientSecret(
  params: {
    uuid: string;
    payment_engine_identifier: number;
    params?: {
      is_physical_payment_intent?: boolean;
    };
  },
  options?: OptionCallback,
) {
  return async (dispatch: Dispatch) => {
    dispatch(
      requestInvoiceClientSecretActions.initialize({
        invoiceUuid: params.uuid,
      }),
    );
    dispatch(
      requestInvoiceClientSecretActions.isLoading({
        invoiceUuid: params.uuid,
        loading: true,
      }),
    );
    try {
      const response = await requestInvoiceClientSecretAPI({
        payment_engine_identifier: params.payment_engine_identifier,
        invoice: params.uuid,
        is_physical_payment_intent: !!params.params?.is_physical_payment_intent,
      });
      dispatch(
        requestInvoiceClientSecretActions.success({
          ...response.data,
          invoiceUuid: params.uuid,
        }),
      );
      if (options && options.onSuccess) {
        options.onSuccess();
      }
    } catch (error) {
      console.error(error);
      if (isErrorWithCustomCode(error) && error.response.data?.error_code) {
        dispatch(
          snackbarError(
            `clientSecret.errors.${error.response.data.error_code}`,
          ),
        );
      }
      if (options && options.onError) {
        options.onError(error);
      }
      dispatch(
        requestInvoiceClientSecretActions.error({
          invoiceUuid: params.uuid,
          error,
        }),
      );
    }
    dispatch(
      requestInvoiceClientSecretActions.isLoading({
        invoiceUuid: params.uuid,
        loading: false,
      }),
    );
  };
}

export const detachPaymentMethodActions = {
  isLoading: createAction<{ memberId: number; loading: boolean }>(
    'PAYMENT_MODULE/PAYMENT_METHOD/DETACH/LOADING',
  ),
  error: createAction<{ memberId: number; error: Error | null }>(
    'PAYMENT_MODULE/PAYMENT_METHOD/DETACH/ERROR',
  ),
  success: createAction<{
    memberId: number;
    companyId: number;
    payment_backend_payment_method_id: string | null;
  }>('PAYMENT_MODULE/PAYMENT_METHOD/DETACH/SUCCESS'),
};

export function detachPaymentMethod(
  payload: DetachPaymentMethodPayload,
  options?: OptionCallback,
) {
  return async (dispatch: Dispatch) => {
    const memberId = payload.member;
    const companyId = payload.company;
    dispatch(detachPaymentMethodActions.isLoading({ memberId, loading: true }));
    try {
      const response = await detachPaymentMethodAPI(payload);
      dispatch(
        detachPaymentMethodActions.success({
          memberId,
          companyId,
          payment_backend_payment_method_id:
            response.data.payment_backend_payment_method_id,
        }),
      );
      dispatch(snackbarSuccess('invoice:paymentMethod.detach.pm_deleted'));
      options?.onSuccess?.();
    } catch (err) {
      console.error(err);
      if (isErrorWithCustomCode(err) && err.response.data?.error_code) {
        dispatch(
          snackbarError(`paymentMethod.errors.${err.response.data.error_code}`),
        );
      }
      options?.onError?.(err);
      dispatch(
        detachPaymentMethodActions.error({
          memberId,
          error: err.response?.data || err,
        }),
      );
    }
    dispatch(
      detachPaymentMethodActions.isLoading({ memberId, loading: false }),
    );
  };
}

export const listSavedPaymentMethodListActions = {
  isLoading: createAction('PAYMENT_MODULE/PAYMENT_METHOD/LIST/LOADING'),
  error: createAction('PAYMENT_MODULE/PAYMENT_METHOD/LIST/ERROR'),
  success: createAction('PAYMENT_MODULE/PAYMENT_METHOD/LIST/SUCCESS'),
  initialize: createAction('PAYMENT_MODULE/PAYMENT_METHOD/LIST/INITIALIZE'),
};

export function fetchMemberPaymentMethodList(
  params: { memberId: number },
  options?: OptionCallback<Array<PaymentMethod>>,
): ThunkAction {
  return async (dispatch: Dispatch) => {
    dispatch(
      listSavedPaymentMethodListActions.isLoading({
        memberId: params.memberId,
        loading: true,
      }),
    );
    dispatch(
      listSavedPaymentMethodListActions.error({
        memberId: params.memberId,
        error: null,
      }),
    );
    try {
      const response = await fetchPaymentMethodListAPI({
        member: params.memberId,
      });
      dispatch(
        listSavedPaymentMethodListActions.success({
          memberId: params.memberId,
          paymentMethodList: response.data,
        }),
      );
      if (options && options.onSuccess) {
        options.onSuccess(response.data);
      }
    } catch (err) {
      console.error(err);
      dispatch(
        listSavedPaymentMethodListActions.error({
          memberId: params.memberId,
          error: err,
        }),
      );
    }
    dispatch(
      listSavedPaymentMethodListActions.isLoading({
        memberId: params.memberId,
        loading: false,
      }),
    );
  };
}

export function resetPaymentMethodList(memberId: number) {
  return async (dispatch: Dispatch) => {
    dispatch(listSavedPaymentMethodListActions.initialize({ memberId }));
  };
}

export const getPaymentGroupStatusActions = {
  isLoading: createAction<{ paymentGroupId: number; loading: boolean }>(
    'PAYMENT_MODULE/PAYMENT_GROUP/GET_STATUS/LOADING',
  ),
  error: createAction<{ paymentGroupId: number; error: Error | null }>(
    'PAYMENT_MODULE/PAYMENT_GROUP/GET_STATUS/ERROR',
  ),
  success: createAction<{ paymentGroupId: number; status: number }>(
    'PAYMENT_MODULE/PAYMENT_GROUP/GET_STATUS/SUCCESS',
  ),
};

export function fetchPaymentGroupStatus(
  paymentGroupId: number,
  options?: OptionCallback<PaymentGroupStatus>,
): ThunkAction {
  return async (dispatch: Dispatch) => {
    dispatch(
      getPaymentGroupStatusActions.isLoading({
        paymentGroupId: paymentGroupId,
        loading: true,
      }),
    );
    try {
      const response = await getPaymentGroupStatusAPI(paymentGroupId);
      dispatch(
        getPaymentGroupStatusActions.success({
          paymentGroupId: paymentGroupId,
          status: response.data,
        }),
      );
      if (options && options.onSuccess) {
        options.onSuccess(response.data);
      }
    } catch (err) {
      console.error(err);
      dispatch(
        getPaymentGroupStatusActions.error({
          paymentGroupId: paymentGroupId,
          error: err,
        }),
      );
      if (options && options.onError) {
        options.onError(err);
      }
    }
    dispatch(
      getPaymentGroupStatusActions.isLoading({
        paymentGroupId: paymentGroupId,
        loading: false,
      }),
    );
  };
}

export const setBackendProcessingAfterPaymentActions = {
  set: createAction<{
    paymentGroupId: number;
    processing: boolean;
  }>('PAYMENT_MODULE/PAYMENT_GROUP/SET_BACKEND_PROCESSING_AFTER_PAYMENT'),
};

export function setBackendProcessingAfterPayment(params: {
  paymentGroupId: number;
  processing: boolean;
}) {
  return async (dispatch: Dispatch) => {
    dispatch(setBackendProcessingAfterPaymentActions.set(params));
  };
}

export const setPaymentStatusActions = {
  set: createAction<{
    paymentGroupId: number;
    paymentProcessing?: boolean;
    paymentSucceeded?: boolean;
  }>('PAYMENT_MODULE/PAYMENT_GROUP/SET_PAYMENT_STATUS'),
};

export function setPaymentStatus(params: {
  paymentGroupId: number;
  paymentSucceeded?: boolean;
  paymentProcessing?: boolean;
}) {
  return async (dispatch: Dispatch) => {
    dispatch(setPaymentStatusActions.set(params));
    if (params.paymentSucceeded) {
      dispatch(
        setBackendProcessingAfterPaymentActions.set({
          paymentGroupId: params.paymentGroupId,
          processing: false,
        }),
      );
      setTimeout(() => {
        dispatch(
          setBackendProcessingAfterPaymentActions.set({
            paymentGroupId: params.paymentGroupId,
            processing: false,
          }),
        );
      }, 2000);
    }
    // }
  };
}

export const requestBasketClientSecretActions = {
  isLoading: createAction<{ basketId: string; loading: boolean }>(
    'PAYMENT_MODULE/BASKET/REQUEST_CLIENT_SECRET/LOADING',
  ),
  error: createAction<{ basketId: string; error: Error | null }>(
    'PAYMENT_MODULE/BASKET/REQUEST_CLIENT_SECRET/ERROR',
  ),
  success: createAction<RequestClientSecretPayload & { basketId: string }>(
    'PAYMENT_MODULE/BASKET/REQUEST_CLIENT_SECRET/SUCCESS',
  ),
  initialize: createAction<{ basketId: string }>(
    'PAYMENT_MODULE/BASKET/REQUEST_CLIENT_SECRET/INITIALIZE',
  ),
};

export function resetBasketClientSecret(params: { basketId: string }) {
  return async (dispatch: Dispatch) => {
    dispatch(requestBasketClientSecretActions.initialize(params));
  };
}

export function requestBasketClientSecret(
  params: {
    basketId: string;
    payment_engine_identifier: number;
  },
  options?: OptionCallback<RequestClientSecretPayload>,
) {
  const { basketId, payment_engine_identifier } = params;
  return async (dispatch: Dispatch) => {
    dispatch(
      requestBasketClientSecretActions.initialize({
        basketId: basketId,
      }),
    );
    dispatch(
      requestBasketClientSecretActions.isLoading({
        basketId: basketId,
        loading: true,
      }),
    );
    try {
      const response = await requestBasketClientSecretAPI({
        payment_engine_identifier,
        basket: basketId,
      });
      dispatch(
        requestBasketClientSecretActions.success({
          ...response.data,
          basketId,
        }),
      );
      options?.onSuccess?.();
    } catch (error) {
      const axiosError = error as AxiosError;
      console.error(axiosError);
      if (
        isErrorWithCustomCode(axiosError) &&
        axiosError.response?.data?.error_code
      ) {
        dispatch(
          snackbarError(
            `clientSecret.errors.${axiosError.response.data.error_code}`,
          ),
        );
      }
      options?.onError?.(axiosError);
      dispatch(
        requestBasketClientSecretActions.error({
          basketId,
          error: axiosError,
        }),
      );
    }
    dispatch(
      requestBasketClientSecretActions.isLoading({
        basketId,
        loading: false,
      }),
    );
  };
}

export const updateIntentToSavePaymentMethodActions = {
  isLoading: createAction<{ paymentGroupId: number; loading: boolean }>(
    'PAYMENT_MODULE/PAYMENT_GROUP/UPDATE_INTENT_SAVE_PM/LOADING',
  ),
  error: createAction<{ paymentGroupId: number; error: Error | null }>(
    'PAYMENT_MODULE/PAYMENT_GROUP/UPDATE_INTENT_SAVE_PM/ERROR',
  ),
  success: createAction<UpdatePaymentIntentResult & { paymentGroupId: number }>(
    'PAYMENT_MODULE/PAYMENT_GROUP/UPDATE_INTENT_SAVE_PM/SUCCESS',
  ),
  initialize: createAction<{ paymentGroupId: number }>(
    'PAYMENT_MODULE/PAYMENT_GROUP/UPDATE_INTENT_SAVE_PM/INITIALIZE',
  ),
};

export function updateIntentToSavePaymentMethod(
  args: UpdatePaymentIntentArgs,
  options?: OptionCallback<UpdatePaymentIntentResult>,
): ThunkAction {
  return async (dispatch: Dispatch) => {
    const paymentGroupId = args.payment_group_id;

    dispatch(
      updateIntentToSavePaymentMethodActions.isLoading({
        paymentGroupId,
        loading: true,
      }),
    );
    dispatch(
      updateIntentToSavePaymentMethodActions.error({
        paymentGroupId,
        error: null,
      }),
    );

    try {
      const response = await updateIntentToSavePaymentMethodAPI(args);
      const resultData = response.data;

      dispatch(
        updateIntentToSavePaymentMethodActions.success({
          ...resultData,
          paymentGroupId,
        }),
      );

      options?.onSuccess?.(resultData);
    } catch (error) {
      console.error('Error updating intent to save payment method:', error);
      dispatch(
        updateIntentToSavePaymentMethodActions.error({
          paymentGroupId,
          error: error as Error,
        }),
      );

      options?.onError?.(error as Error);
    } finally {
      dispatch(
        updateIntentToSavePaymentMethodActions.isLoading({
          paymentGroupId,
          loading: false,
        }),
      );
    }
  };
}

export function confirmStripePayment(
  args: {
    saveForLater?: boolean;
    paymentGroupId?: number;
    stripe: Stripe;
    elements: StripeElements;
    clientSecret: string;
    return_url?: string;
    shouldConfirmCardPayment?: boolean;
    shouldConfirmSepaDebitPayment?: boolean;
    paymentMethodSelected?: string;
    billingDetails?: BillingDetails;
    paymentMethodData?: { billing_details?: BillingDetails };
    cardBillingDetailsMandatory?: boolean;
  },
  options?: {
    onPaymentError?: (error: StripeError) => void;
    onPaymentSuccess?: (stripeResponse: PaymentIntent) => void;
  },
): ThunkAction {
  return async (dispatch: Dispatch) => {
    try {
      if (args.saveForLater && args.paymentGroupId) {
        await dispatch(
          updateIntentToSavePaymentMethod({
            save_for_later: args.saveForLater,
            payment_group_id: args.paymentGroupId,
          }),
        );
      }

      // Only confirmPayment works with PaymentElement; the others require specific data.
      // When confirming with a saved payment method, we do not use the PaymentElement so we need to use confirmCardPayment or confirmSepaDebitPayment.
      let result;
      if (args.shouldConfirmCardPayment) {
        result = await args.stripe.confirmCardPayment(args.clientSecret, {
          payment_method: args.paymentMethodSelected || {
            card: args.elements.getElement('card')!,
            ...(args.cardBillingDetailsMandatory
              ? { billing_details: args.billingDetails }
              : {}),
          },
        });
      } else if (args.shouldConfirmSepaDebitPayment) {
        result = await args.stripe.confirmSepaDebitPayment(args.clientSecret, {
          payment_method: args.paymentMethodSelected || '',
        });
      } else {
        result = await args.stripe.confirmPayment({
          elements: args.elements,
          clientSecret: args.clientSecret,
          redirect: 'if_required',
          confirmParams: {
            return_url: args.return_url,
            payment_method_data: args.paymentMethodData,
          },
        });
      }

      if (result.error) {
        options?.onPaymentError?.(result.error);
      } else {
        options?.onPaymentSuccess?.(result.paymentIntent);
      }
    } catch (error) {
      options?.onPaymentError?.(error as StripeError);
    }
  };
}
