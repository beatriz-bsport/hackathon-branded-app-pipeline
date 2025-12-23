import {
  keepPreviousData,
  queryOptions,
  useQuery,
} from "@tanstack/react-query";

import {
  type SearchEstablishmentParams,
  searchEstablishments,
} from "@bsport/api-core";

import { fetch } from "../utils/fetch";

const ESTABLISHMENTS_DEFAULT_PAGE_SIZE = 20;
const ESTABLISHMENTS_STALE_TIME = 2 * 60 * 1000; // 2 minutes

const fetchSearchEstablishments = async (params: SearchEstablishmentParams) => {
  const result = await searchEstablishments(fetch, params);
  return result.results;
};

const establishmentsQueryOptions = (searchValue: string) => {
  return queryOptions({
    queryKey: ["establishments", searchValue],
    queryFn: () =>
      fetchSearchEstablishments({
        q: searchValue,
        page: 1,
        page_size: ESTABLISHMENTS_DEFAULT_PAGE_SIZE,
        disabled: false,
      }),
    staleTime: ESTABLISHMENTS_STALE_TIME,
  });
};

export const useSearchEstablishments = (searchValue: string) => {
  return useQuery({
    ...establishmentsQueryOptions(searchValue),
    placeholderData: keepPreviousData,
    select: (establishments) =>
      establishments?.map((establishment) => ({
        id: `${establishment.id}`,
        label: establishment.title,
      })) || [],
  });
};
