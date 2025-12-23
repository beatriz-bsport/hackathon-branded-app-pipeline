import {
  keepPreviousData,
  queryOptions,
  useQuery,
} from "@tanstack/react-query";

import {
  type SearchEstablishmentGroupParams,
  searchEstablishmentGroups,
} from "@bsport/api-core";

import { fetch } from "../utils/fetch";

const ESTABLISHMENT_GROUPS_DEFAULT_PAGE_SIZE = 20;
const ESTABLISHMENT_GROUPS_STALE_TIME = 2 * 60 * 1000; // 2 minutes

const fetchSearchEstablishmentGroups = async (
  params: SearchEstablishmentGroupParams,
) => {
  const result = await searchEstablishmentGroups(fetch, params);
  return result.results;
};

const establishmentGroupsQueryOptions = (searchValue: string) => {
  return queryOptions({
    queryKey: ["establishmentGroups", searchValue],
    queryFn: () =>
      fetchSearchEstablishmentGroups({
        q: searchValue,
        page: 1,
        page_size: ESTABLISHMENT_GROUPS_DEFAULT_PAGE_SIZE,
      }),
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
