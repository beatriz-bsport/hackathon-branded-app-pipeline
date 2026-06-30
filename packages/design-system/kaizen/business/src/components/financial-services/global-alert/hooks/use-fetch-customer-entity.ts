import { useQuery } from "@tanstack/react-query";

import { fetchCustomerEntityQueryOptions } from "@bsport/api-financial-services/customer-entity";
import type { Fetch } from "@bsport/fetch";

const STALE_TIME = 5 * 60 * 1000;

/** Fetches the authenticated user's customer entity (used to derive missing-VAT-number alerts). */
export const useFetchCustomerEntity = (fetch: Fetch) =>
  useQuery({
    ...fetchCustomerEntityQueryOptions(fetch),
    staleTime: STALE_TIME,
  });
