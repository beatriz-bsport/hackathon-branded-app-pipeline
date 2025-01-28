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
import { PAYMENT_INTENT_TYPE_INVOICE } from '@bsport/common/lib/master-data/payment-group.js';
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
