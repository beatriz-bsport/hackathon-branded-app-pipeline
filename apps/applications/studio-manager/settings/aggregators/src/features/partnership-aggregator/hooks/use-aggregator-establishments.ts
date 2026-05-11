import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";

import {
  type Establishment,
  establishmentKeys,
  fetchEstablishments,
} from "@bsport/api-core";

import { fetch } from "#src/utils/fetch";

const STALE_TIME = 2 * 60 * 1000; // 2 minutes
const PAGE_SIZE = 1000;

const fetchEstablishmentsForCompany = fetchEstablishments.bind(null, fetch);

export const aggregatorEstablishmentsQueryOptions = (company: number) => {
  const queryFn = fetchEstablishmentsForCompany.bind(null, {
    company,
    page_size: PAGE_SIZE,
  });
  return queryOptions({
    queryKey: [...establishmentKeys.all, { company }],
    queryFn,
    staleTime: STALE_TIME,
    select: (data): Establishment[] => data.results,
  });
};

export const useAggregatorEstablishments = (company: number) =>
  useSuspenseQuery(aggregatorEstablishmentsQueryOptions(company));
