import { queryOptions } from "@tanstack/react-query";

import { type Fetch } from "@bsport/store-base";

import { API_URL_PLATFORM_BILLING, QUERY_KEY_MAIN } from "#src/constants";

import type { SubscriptionPaymentStatus } from "./types";

export const subscriptionPaymentStatusKeys = {
  all: [QUERY_KEY_MAIN, "subscription-payment-status"] as const,
  detail: () => [...subscriptionPaymentStatusKeys.all, "detail"] as const,
} as const;

export const fetchSubscriptionPaymentStatusAPI = async (
  fetch: Fetch<SubscriptionPaymentStatus>,
): Promise<SubscriptionPaymentStatus> => {
  const { data } = await fetch(
    `${API_URL_PLATFORM_BILLING}/platform_subscription/retrieve_payment_status/`,
  );

  return data;
};

export const fetchSubscriptionPaymentStatusQueryOptions = (
  fetch: Fetch<SubscriptionPaymentStatus>,
) =>
  queryOptions({
    queryKey: subscriptionPaymentStatusKeys.detail(),
    queryFn: () => fetchSubscriptionPaymentStatusAPI(fetch),
  });
