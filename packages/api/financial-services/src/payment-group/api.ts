import { type ApiConfig, type Fetch } from "@bsport/store-base";

import { API_URL_PAYMENT } from "../constants";
import type {
  RequestPaymentClientSecretRequest,
  RequestPaymentClientSecretResponse,
} from "./types";

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
