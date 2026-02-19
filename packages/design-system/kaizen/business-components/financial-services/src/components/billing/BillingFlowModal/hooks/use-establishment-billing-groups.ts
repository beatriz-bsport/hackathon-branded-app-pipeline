import { queryOptions, useQuery } from "@tanstack/react-query";

import {
  type EstablishmentBillingGroup,
  fetchEstablishmentBillingGroups,
} from "@bsport/api-core";

import fetch from "#src/utils/fetch";

import { ESTABLISHMENT_BILLING_GROUPS_QUERY_KEY } from "./constants";

const ESTABLISHMENT_BILLING_GROUPS_STALE_TIME = 2 * 60 * 1000; // 2 minutes

const fetchEstablishmentBillingGroupsWithFetch =
  fetchEstablishmentBillingGroups.bind(null, fetch);

type PaginatedEstablishmentBillingGroups = {
  results: EstablishmentBillingGroup[];
};

const extractEstablishmentBillingGroups = (
  data: EstablishmentBillingGroup[] | PaginatedEstablishmentBillingGroups,
): EstablishmentBillingGroup[] => {
  return Array.isArray(data) ? data : (data.results ?? []);
};

export const establishmentBillingGroupsQueryOptions = (companyId: number) => {
  return queryOptions({
    queryKey: [ESTABLISHMENT_BILLING_GROUPS_QUERY_KEY, companyId],
    queryFn: async () =>
      fetchEstablishmentBillingGroupsWithFetch({
        company: companyId,
        disabled: false,
      }) as unknown as
        | EstablishmentBillingGroup[]
        | PaginatedEstablishmentBillingGroups,
    select: extractEstablishmentBillingGroups,
    staleTime: ESTABLISHMENT_BILLING_GROUPS_STALE_TIME,
    enabled: !!companyId,
  });
};

/**
 * Fetches establishment billing groups for the given company (e.g. for the billing group selector).
 * TODO: Get companyId from ThemeProvider when available; for now callers must pass it or use a placeholder.
 */
export const useEstablishmentBillingGroups = (
  companyId: number | undefined,
) => {
  const result = useQuery({
    ...establishmentBillingGroupsQueryOptions(companyId ?? 0),
    enabled: !!companyId,
  });
  return result;
};
