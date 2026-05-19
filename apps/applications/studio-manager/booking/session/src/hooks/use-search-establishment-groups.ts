import {
  keepPreviousData,
  queryOptions,
  useQuery,
} from "@tanstack/react-query";

import {
  type SearchEstablishmentGroupSearchParams,
  establishmentGroupKeys,
  searchEstablishmentGroups,
} from "@bsport/api-book";

import { fetch } from "../utils/fetch";

const ESTABLISHMENT_GROUPS_DEFAULT_PAGE_SIZE = 20;
const ESTABLISHMENT_GROUPS_STALE_TIME = 2 * 60 * 1000; // 2 minutes

const fetchSearchEstablishmentGroups = async (
  params: SearchEstablishmentGroupSearchParams,
) => {
  const result = await searchEstablishmentGroups(fetch, params);
  return result.results;
};

const establishmentGroupsQueryOptions = (searchValue: string) => {
  const params = {
    q: searchValue,
    page: 1,
    page_size: ESTABLISHMENT_GROUPS_DEFAULT_PAGE_SIZE,
  };
  return queryOptions({
    queryKey: establishmentGroupKeys.search(params),
    queryFn: () => fetchSearchEstablishmentGroups(params),
    staleTime: ESTABLISHMENT_GROUPS_STALE_TIME,
  });
};

export const useSearchEstablishmentGroups = (searchValue: string) => {
  return useQuery({
    ...establishmentGroupsQueryOptions(searchValue),
    placeholderData: keepPreviousData,
    select: (establishmentGroups) =>
      establishmentGroups?.map((establishmentGroup) => ({
        id: `${establishmentGroup.id}`,
        label: establishmentGroup.name,
      })) || [],
  });
};
