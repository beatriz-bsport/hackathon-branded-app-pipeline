import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";

import {
  PartnershipIdentifier,
  fetchPartnershipCompanies,
  partnershipKeys,
} from "@bsport/api-book";

import { fetch } from "#src/utils/fetch";

const STALE_TIME = 10 * 60 * 1000; // 10 minutes - usually will not change often
const fetchCompanies = fetchPartnershipCompanies.bind(null, fetch);
const fetchMyclubsPartnershipId = async (): Promise<number | null> => {
  const companies = await fetchCompanies();
  return (
    companies.find(
      (company) => company.identifier === PartnershipIdentifier.MYCLUBS,
    )?.partnership ?? null
  );
};

export const myclubsPartnershipIdQueryOptions = () =>
  queryOptions({
    queryKey: partnershipKeys.company(PartnershipIdentifier.MYCLUBS),
    queryFn: fetchMyclubsPartnershipId,
    staleTime: STALE_TIME,
  });

export const useMyclubsPartnershipId = () =>
  useSuspenseQuery(myclubsPartnershipIdQueryOptions());
