import { queryOptions } from "@tanstack/react-query";

import { type Fetch } from "@bsport/store-base";

import { API_URL, QUERY_KEY_MAIN } from "#src/constants";

import type { StripeAccountStatus } from "./types";

export const stripeAccountKeys = {
  all: [QUERY_KEY_MAIN, "stripe-account"] as const,
  status: () => [...stripeAccountKeys.all, "status"] as const,
} as const;

export const fetchStripeAccountStatusAPI = async (
  fetch: Fetch<StripeAccountStatus>,
): Promise<StripeAccountStatus> => {
  const { data } = await fetch(
    `${API_URL}/payment_backend/stripe/company/retrieve_stripe_account_status/`,
  );

  return data;
};

export const fetchStripeAccountStatusQueryOptions = (
  fetch: Fetch<StripeAccountStatus>,
) =>
  queryOptions({
    queryKey: stripeAccountKeys.status(),
    queryFn: () => fetchStripeAccountStatusAPI(fetch),
  });
