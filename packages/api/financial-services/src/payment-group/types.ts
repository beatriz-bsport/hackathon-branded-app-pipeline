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
