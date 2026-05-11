import { queryOptions, useQuery } from "@tanstack/react-query";

import {
  type StripeReader,
  fetchStripeReadersAPI,
  terminalKeys,
} from "@bsport/api-financial-services/terminal";
import type { Fetch } from "@bsport/fetch";

export type { StripeReader } from "@bsport/api-financial-services/terminal";

const STRIPE_READERS_STALE_TIME = 2 * 60 * 1000; // 2 minutes

type UseFetchStripeReadersParams = {
  fetch: Fetch;
  enabled: boolean;
};

const fetchStripeReaders = async (fetch: Fetch): Promise<StripeReader[]> => {
  return fetchStripeReadersAPI(fetch);
};

const fetchStripeReadersQueryOptions = ({
  fetch,
  enabled,
}: UseFetchStripeReadersParams) =>
  queryOptions({
    queryKey: terminalKeys.readers(),
    queryFn: () => fetchStripeReaders(fetch),
    staleTime: STRIPE_READERS_STALE_TIME,
    enabled,
  });

export const useFetchStripeReaders = (params: UseFetchStripeReadersParams) =>
  useQuery({
    ...fetchStripeReadersQueryOptions(params),
  });
