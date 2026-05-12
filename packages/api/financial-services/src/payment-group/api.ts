import { type ApiConfig, type Fetch } from "@bsport/store-base";

import { API_URL_PAYMENT, QUERY_KEY_MAIN } from "../constants";
import type {
  ConfirmPaymentByPaymentMethodIdRequest,
  FetchPaymentGroupRequest,
  PaymentGroup,
  RequestPaymentClientSecretRequest,
  RequestPaymentClientSecretResponse,
  UpdateIntentToSavePaymentMethodRequest,
  UpdateIntentToSavePaymentMethodResponse,
} from "./types";

export const paymentGroupKeys = {
  all: [QUERY_KEY_MAIN, "payment-group"] as const,
  detail: (paymentGroupId: number) =>
    [...paymentGroupKeys.all, "detail", paymentGroupId] as const,
  clientSecret: (payload: RequestPaymentClientSecretRequest) =>
    [...paymentGroupKeys.all, "client-secret", payload] as const,
} as const;

export const requestPaymentClientSecretAPIConfig = (
  payload: RequestPaymentClientSecretRequest,
): ApiConfig => {
  return [
    `${API_URL_PAYMENT}/payment_group/request_client_secret/`,
    { method: "POST", body: JSON.stringify(payload) },
  ];
};

export const requestPaymentClientSecretAPI = async (
  fetch: Fetch<RequestPaymentClientSecretResponse>,
  payload: RequestPaymentClientSecretRequest,
): Promise<RequestPaymentClientSecretResponse> => {
  const [uri, init] = requestPaymentClientSecretAPIConfig(payload);

  const { data } = await fetch(uri, init);

  return data;
};

export const fetchPaymentGroupAPIConfig = ({
  paymentGroupId,
}: FetchPaymentGroupRequest): ApiConfig => {
  return [`${API_URL_PAYMENT}/payment_group/${paymentGroupId}/`];
};

export const fetchPaymentGroupAPI = async (
  fetch: Fetch<PaymentGroup>,
  payload: FetchPaymentGroupRequest,
): Promise<PaymentGroup> => {
  const [uri, init] = fetchPaymentGroupAPIConfig(payload);

  const { data } = await fetch(uri, init);

  return data;
};

export const updateIntentToSavePaymentMethodAPIConfig = (
  payload: UpdateIntentToSavePaymentMethodRequest,
): ApiConfig => {
  return [
    `${API_URL_PAYMENT}/payment_group/update_intent_to_save_payment_method/`,
    { method: "POST", body: JSON.stringify(payload) },
  ];
};

export const updateIntentToSavePaymentMethodAPI = async (
  fetch: Fetch<UpdateIntentToSavePaymentMethodResponse>,
  payload: UpdateIntentToSavePaymentMethodRequest,
): Promise<UpdateIntentToSavePaymentMethodResponse> => {
  const [uri, init] = updateIntentToSavePaymentMethodAPIConfig(payload);

  const { data } = await fetch(uri, init);

  return data;
};

export const confirmPaymentByPaymentMethodIdAPIConfig = (
  payload: ConfirmPaymentByPaymentMethodIdRequest,
): ApiConfig => {
  return [
    `${API_URL_PAYMENT}/payment_group/confirm_payment_intent/`,
    { method: "POST", body: JSON.stringify(payload) },
  ];
};

export const confirmPaymentByPaymentMethodIdAPI = async (
  fetch: Fetch<unknown>,
  payload: ConfirmPaymentByPaymentMethodIdRequest,
): Promise<unknown> => {
  const [uri, init] = confirmPaymentByPaymentMethodIdAPIConfig(payload);

  const { data } = await fetch(uri, init);

  return data;
};
