import { type ApiConfig, type Fetch } from "@bsport/store-base";

import { API_URL_PAYMENT, QUERY_KEY_MAIN } from "../constants";
import type { SubmitInternalPaymentRequest } from "./types";

export const internalPaymentKeys = {
  all: [QUERY_KEY_MAIN, "internal-payment"] as const,
  submit: () => [...internalPaymentKeys.all, "submit"] as const,
} as const;

export const submitInternalPaymentAPIConfig = (
  payload: SubmitInternalPaymentRequest,
): ApiConfig => {
  return [
    `${API_URL_PAYMENT}/internal_payment/`,
    { method: "POST", body: JSON.stringify(payload) },
  ];
};

export const submitInternalPaymentAPI = async (
  fetch: Fetch<void>,
  payload: SubmitInternalPaymentRequest,
): Promise<void> => {
  const [uri, init] = submitInternalPaymentAPIConfig(payload);

  await fetch(uri, init);
};
