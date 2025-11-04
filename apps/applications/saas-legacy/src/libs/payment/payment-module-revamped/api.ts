import { buildUrlParams, postAuth, getAuth } from '#src/http';

import type {
  PaymentGroupStatus,
  RequestClientSecretPayload,
} from '#src/libs/invoice/types';
import {
  DetachPaymentMethodPayload,
  DetachPaymentMethodResponse,
  PaymentMethod,
} from '#src/libs/payment/types';
import {
  PAYMENT_INTENT_TYPE_BASKET,
  PAYMENT_INTENT_TYPE_INVOICE,
} from '@bsport/common/lib/master-data/payment-group.js';
import Config from '../../../config';

const API_V1_URI = Config.REACT_APP_BASE_URI_FINANCIAL_SERVICES_V1;

export const applyBalanceToInvoice = (uuid: string) =>
  postAuth<string>(
    `${API_V1_URI}/payment/invoices/${uuid}/apply_balance_to_invoice/`,
  );

export function requestInvoiceClientSecret(params: {
  payment_engine_identifier: number;
  invoice: string;
  is_physical_payment_intent?: boolean;
}) {
  return postAuth<RequestClientSecretPayload>(
    `${API_V1_URI}/payment/payment_group/request_client_secret/`,
    {
      payment_intent_type: PAYMENT_INTENT_TYPE_INVOICE,
      ...(params || {}),
    },
  );
}

export const detachPaymentMethod = (payload: DetachPaymentMethodPayload) => {
  return postAuth<DetachPaymentMethodResponse>(
    `${API_V1_URI}/payment/payment_method/detach/`,
    {
      ...(payload.member ? { member: payload.member } : {}),
      payment_method_id: payload.payment_method_id,
      ...(payload.company ? { company: payload.company } : {}),
    },
  );
};

export const fetchPaymentMethodList = (params: any = {}) => {
  return getAuth<Array<PaymentMethod>>(
    `${API_V1_URI}/payment/payment_method/${buildUrlParams(params)}`,
  );
};

export const getPaymentGroupStatus = (paymentGroupId: number) => {
  return getAuth<PaymentGroupStatus>(
    `${API_V1_URI}/payment/payment_group/${paymentGroupId}/status/`,
  );
};

export const requestBasketClientSecret = (params: {
  payment_engine_identifier: number;
  basket: string;
}) => {
  return postAuth<RequestClientSecretPayload>(
    `${API_V1_URI}/payment/payment_group/request_client_secret/`,
    {
      payment_intent_type: PAYMENT_INTENT_TYPE_BASKET,
      ...params,
    },
  );
};

export const createPendingBookingsAndBlockBasket = (params: {
  basketId: string;
  data: { payment_group_method_identifier?: number };
}) => {
  const { basketId, data } = params;
  return postAuth(
    `${API_V1_URI}/checkout/basket/${basketId}/create_pending_bookings_and_block_basket/`,
    data ?? {},
  );
};

export const invalidatePendingBookingsAndUnblockBasket = (params: {
  basketId: string;
}) => {
  const { basketId } = params;
  return postAuth(
    `${API_V1_URI}/checkout/basket/${basketId}/invalidate_pending_bookings_and_unblock_basket/`,
  );
};
