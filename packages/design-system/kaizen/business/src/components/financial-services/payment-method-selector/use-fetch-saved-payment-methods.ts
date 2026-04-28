import { queryOptions, useQuery } from "@tanstack/react-query";

import { fetchSavedPaymentMethodsAPI } from "@bsport/api-financial-services/payment-method";
import type { Fetch } from "@bsport/fetch";

const SAVED_PAYMENT_METHODS_STALE_TIME = 2 * 60 * 1000; // 2 minutes

const fetchSavedPaymentMethodsQueryOptions = (
  fetch: Fetch,
  memberId?: number,
) => {
  const fetchSavedPaymentMethods = fetchSavedPaymentMethodsAPI.bind(
    null,
    fetch,
  );

  return queryOptions({
    queryKey: ["payment-methods", "saved", memberId ?? null],
    queryFn: () => fetchSavedPaymentMethods({ member: memberId! }),
    staleTime: SAVED_PAYMENT_METHODS_STALE_TIME,
    enabled: memberId !== undefined,
  });
};

export const useFetchSavedPaymentMethods = (fetch: Fetch, memberId?: number) =>
  useQuery({
    ...fetchSavedPaymentMethodsQueryOptions(fetch, memberId),
  });
