import { createAction } from 'redux-actions';

import type {
  DetachPaymentMethodResponse,
  PaymentMethod,
} from 'bsport-saas/src/libs/payment/types';

export const fetchPaymentMethodListActions = {
  success: createAction<PaymentMethod[]>('PAYMENT_METHOD/LIST/SUCCESS'),
  isLoading: createAction<boolean>('PAYMENT_METHOD/LIST/LOADING'),
  error: createAction<Error | null>('PAYMENT_METHOD/LIST/ERROR'),
};

export const detachPaymentMethodActions = {
  success: createAction<DetachPaymentMethodResponse | {}>(
    'PATMENT_METHOD/DETACH/SUCCESS',
  ),
  isLoading: createAction<boolean>('PAYMENT_METHOD/DETACH/LOADING'),
  error: createAction<Error | null>('PAYMENT_METHOD/DETACH/ERROR'),
};

export const getPaymentGroupStatusActions = {
  isLoading: createAction<{ paymentGroupId: number, loading: boolean }>(
    'PAYMENT_MODULE/PAYMENT_GROUP/GET_STATUS/LOADING',
  ),
  error: createAction<{ paymentGroupId: number, error: Error | null }>(
    'PAYMENT_MODULE/PAYMENT_GROUP/GET_STATUS/ERROR',
  ),
  success: createAction<{ paymentGroupId: number, status: number }>(
    'PAYMENT_MODULE/PAYMENT_GROUP/GET_STATUS/SUCCESS',
  ),
};

export const setPaymentStatusActions = {
  set: createAction<{
    paymentGroupId: number,
    paymentProcessing?: boolean,
    paymentSucceeded?: boolean,
  }>('PAYMENT_MODULE/PAYMENT_GROUP/SET_PAYMENT_STATUS'),
};

export const setBackendProcessingAfterPaymentActions = {
  set: createAction<{
    paymentGroupId: number,
    processing: boolean,
  }>('PAYMENT_MODULE/PAYMENT_GROUP/SET_BACKEND_PROCESSING_AFTER_PAYMENT'),
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
