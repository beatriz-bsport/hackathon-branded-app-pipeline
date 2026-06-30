import { useQuery } from "@tanstack/react-query";

import { fetchStripeAccountStatusQueryOptions } from "@bsport/api-financial-services/stripe-account";
import type { Fetch } from "@bsport/fetch";

const STALE_TIME = 5 * 60 * 1000;

/** Fetches the Stripe account configuration status (used to derive stripe-not-configured alerts). */
export const useFetchStripeAccount = (fetch: Fetch) =>
  useQuery({
    ...fetchStripeAccountStatusQueryOptions(fetch),
    staleTime: STALE_TIME,
  });
