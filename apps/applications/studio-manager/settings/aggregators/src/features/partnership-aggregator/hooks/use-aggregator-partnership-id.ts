import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";

import {
  type PartnershipIdentifier,
  fetchPartnershipCompaniesAPI,
  partnershipKeys,
} from "@bsport/api-book";

import { fetch } from "#src/utils/fetch";

const STALE_TIME = 10 * 60 * 1000; // 10 minutes

export const aggregatorPartnershipIdQueryOptions = (
  identifier: PartnershipIdentifier,
) =>
  queryOptions({
    queryKey: partnershipKeys.companies(),
    queryFn: () => fetchPartnershipCompaniesAPI(fetch),
    staleTime: STALE_TIME,
    select: (companies) =>
      companies.find((company) => company.identifier === identifier)
        ?.partnership ?? null,
  });

export const useAggregatorPartnershipId = (identifier: PartnershipIdentifier) =>
  useSuspenseQuery(aggregatorPartnershipIdQueryOptions(identifier));
