import { mutationOptions, queryOptions } from "@tanstack/react-query";

import { type ApiConfig, type Fetch } from "@bsport/store-base";

import { API_URL_PAYMENT, QUERY_KEY_MAIN } from "../constants";
import type {
  FetchSavedPaymentMethodsRequest,
  SavedPaymentMethod,
  SetupIntentResponse,
} from "./types";

export const paymentMethodKeys = {
  all: [QUERY_KEY_MAIN, "payment-method"] as const,
  saved: (memberId: number) =>
    [...paymentMethodKeys.all, "saved", memberId] as const,
  company: () => [...paymentMethodKeys.all, "company"] as const,
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

const fetchCompanyPaymentMethodsAPIConfig = (): ApiConfig => {
  return [`${API_URL_PAYMENT}/payment_method/?as_company=true`];
};

export const fetchCompanyPaymentMethodsAPI = async (
  fetch: Fetch<SavedPaymentMethod[]>,
): Promise<SavedPaymentMethod[]> => {
  const [uri, init] = fetchCompanyPaymentMethodsAPIConfig();

  const { data } = await fetch(uri, init);

  return data;
};

export const fetchCompanyPaymentMethodsQueryOptions = (
  fetch: Fetch<SavedPaymentMethod[]>,
) =>
  queryOptions({
    queryKey: paymentMethodKeys.company(),
    queryFn: () => fetchCompanyPaymentMethodsAPI(fetch),
  });

const requestSetupIntentAPIConfig = (): ApiConfig => {
  return [
    `${API_URL_PAYMENT}/payment_method/register_setup_intent/`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ as_company: true }),
    },
  ];
};

export const requestSetupIntentAPI = async (
  fetch: Fetch<SetupIntentResponse>,
): Promise<SetupIntentResponse> => {
  const [uri, init] = requestSetupIntentAPIConfig();

  const { data } = await fetch(uri, init);

  return data;
};

export const requestSetupIntentMutationOptions = (
  fetch: Fetch<SetupIntentResponse>,
) =>
  mutationOptions({
    mutationFn: () => requestSetupIntentAPI(fetch),
  });

export const setCompanyPaymentMethodAsDefaultAPI = async (
  fetch: Fetch<unknown>,
  paymentMethodId: string,
): Promise<void> => {
  await fetch(`${API_URL_PAYMENT}/payment_method/set_default/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      payment_backend_payment_method_id: paymentMethodId,
      as_company: true,
    }),
  });
};

export const setCompanyPaymentMethodAsDefaultMutationOptions = (
  fetch: Fetch<unknown>,
) =>
  mutationOptions({
    mutationFn: (paymentMethodId: string) =>
      setCompanyPaymentMethodAsDefaultAPI(fetch, paymentMethodId),
  });
