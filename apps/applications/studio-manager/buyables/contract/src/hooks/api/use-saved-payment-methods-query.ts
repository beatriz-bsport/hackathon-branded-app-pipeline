import { useQuery } from "@tanstack/react-query";

import { fetchSavedPaymentMethodsQueryOptions } from "@bsport/api-financial-services";

import { fetch } from "#src/utils/fetch";

const STALE_TIME_2_MIN = 2 * 60 * 1_000;

export const useSavedPaymentMethodsQuery = (member: number) =>
  useQuery({
    ...fetchSavedPaymentMethodsQueryOptions(fetch, { member }),
    staleTime: STALE_TIME_2_MIN,
  });
