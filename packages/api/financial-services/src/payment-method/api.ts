import { type ApiConfig, type Fetch } from "@bsport/store-base";

import { API_URL_PAYMENT, QUERY_KEY_MAIN } from "../constants";
import type {
  FetchSavedPaymentMethodsRequest,
  SavedPaymentMethod,
} from "./types";

export const paymentMethodKeys = {
  all: [QUERY_KEY_MAIN, "payment-method"] as const,
  saved: (memberId: number) =>
    [...paymentMethodKeys.all, "saved", memberId] as const,
} as const;

export const fetchSavedPaymentMethodsAPIConfig = (
  payload: FetchSavedPaymentMethodsRequest,
): ApiConfig => {
  const params = new URLSearchParams({ member: String(payload.member) });

  return [`${API_URL_PAYMENT}/payment_method/?${params.toString()}`];
};

export const fetchSavedPaymentMethodsAPI = async (
  fetch: Fetch<SavedPaymentMethod[]>,
  payload: FetchSavedPaymentMethodsRequest,
): Promise<SavedPaymentMethod[]> => {
  const [uri, init] = fetchSavedPaymentMethodsAPIConfig(payload);

  const { data } = await fetch(uri, init);

  return data;
};
