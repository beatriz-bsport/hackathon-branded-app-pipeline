import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";

import {
  PartnershipIdentifier,
  fetchPartnershipCompaniesAPI,
  partnershipKeys,
} from "@bsport/api-book";

import { fetch } from "#src/utils/fetch";

const STALE_TIME = 10 * 60 * 1000;
const fetchCompanies = fetchPartnershipCompaniesAPI.bind(null, fetch);

export const wellhubPartnershipIdQueryOptions = () =>
  queryOptions({
    queryKey: partnershipKeys.company(PartnershipIdentifier.WELLHUB),
    queryFn: fetchCompanies,
    staleTime: STALE_TIME,
    select: (companies) =>
      companies.find(
        (company) => company.identifier === PartnershipIdentifier.WELLHUB,
      )?.partnership ?? null,
  });

export const useWellhubPartnershipId = () =>
  useSuspenseQuery(wellhubPartnershipIdQueryOptions());
