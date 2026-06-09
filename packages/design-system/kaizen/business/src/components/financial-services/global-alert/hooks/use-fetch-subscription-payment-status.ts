import { useQuery } from "@tanstack/react-query";

import { fetchSubscriptionPaymentStatusQueryOptions } from "@bsport/api-financial-services/subscription-payment-status";
import type { Fetch } from "@bsport/fetch";

const STALE_TIME = 5 * 60 * 1000;

/** Fetches the subscription payment status, overriding the shared query options' stale time to 5 min. */
export const useFetchSubscriptionPaymentStatus = (fetch: Fetch) =>
  useQuery({
    ...fetchSubscriptionPaymentStatusQueryOptions(fetch),
    staleTime: STALE_TIME,
  });
