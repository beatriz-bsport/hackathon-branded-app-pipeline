import { queryOptions, useQuery } from "@tanstack/react-query";

import {
  type EstablishmentBillingGroup,
  fetchEstablishmentBillingGroups,
} from "@bsport/api-core";
import type { Fetch } from "@bsport/fetch";

import { ESTABLISHMENT_BILLING_GROUPS_QUERY_KEY } from "./constants";

const ESTABLISHMENT_BILLING_GROUPS_STALE_TIME = 2 * 60 * 1000; // 2 minutes

type PaginatedEstablishmentBillingGroups = {
  results: EstablishmentBillingGroup[];
};

const extractEstablishmentBillingGroups = (
  data: EstablishmentBillingGroup[] | PaginatedEstablishmentBillingGroups,
): EstablishmentBillingGroup[] => {
  return Array.isArray(data) ? data : (data.results ?? []);
};

export const establishmentBillingGroupsQueryOptions = (
  companyId: number,
  fetch: Fetch,
) => {
  const fetchEstablishmentBillingGroupsWithFetch =
    fetchEstablishmentBillingGroups.bind(null, fetch);
  return queryOptions({
    queryKey: [ESTABLISHMENT_BILLING_GROUPS_QUERY_KEY, companyId],
    queryFn: async () =>
      fetchEstablishmentBillingGroupsWithFetch({
        company: companyId,
        disabled: false,
      }),
    select: extractEstablishmentBillingGroups,
    staleTime: ESTABLISHMENT_BILLING_GROUPS_STALE_TIME,
    enabled: !!companyId,
  });
};

/**
 * Fetches establishment billing groups for the given company (e.g. for the billing group selector).
 */
export const useEstablishmentBillingGroups = (
  companyId: number | undefined,
  fetch: Fetch,
) => {
  const result = useQuery({
    ...establishmentBillingGroupsQueryOptions(companyId ?? 0, fetch),
    enabled: !!companyId,
  });
  return result;
};
