export const PAYMENT_ENGINE_STRIPE = 1;
export const PAYMENT_INTENT_TYPE_INVOICE = 0;
export const PAYMENT_INTENT_TYPE_BASKET = 2;

export type RequestPaymentClientSecretRequest = {
  payment_engine_identifier: number;
  payment_intent_type: number;
  invoice?: string;
  member?: string | number;
  basket?: string;
  requested_price_cts?: number;
  is_physical_payment_intent?: boolean;
};

export type RequestPaymentClientSecretResponse = {
  client_secret: string;
  payment_group: number;
  price_cts: number;
};

export type FetchPaymentGroupRequest = {
  paymentGroupId: number;
};

export type PaymentGroup = {
  id: number;
  price_cts: number;
  status?: number;
  [key: string]: unknown;
};

export type UpdateIntentToSavePaymentMethodRequest = {
  payment_group_id: number;
  save_for_later: boolean;
};

export type UpdateIntentToSavePaymentMethodResponse = {
  client_secret: string;
};

export type ConfirmPaymentByPaymentMethodIdRequest = {
  payment_group_id: number;
  payment_method_id: string | number;
};
