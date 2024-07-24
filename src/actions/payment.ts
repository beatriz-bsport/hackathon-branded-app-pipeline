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
