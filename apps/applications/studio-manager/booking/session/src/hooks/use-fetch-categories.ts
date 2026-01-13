import { queryOptions, useQuery } from "@tanstack/react-query";

import { fetchSportCategories } from "@bsport/api-core";

import { fetch } from "#src/utils/fetch";

const CATEGORIES_STALE_TIME = 2 * 60 * 1000; // 2 minutes

const fetchCategories = fetchSportCategories.bind(null, fetch);

const categoriesQueryOptions = (companyId?: number) => {
  return queryOptions({
    queryKey: ["categories", companyId],
    queryFn: () =>
      fetchCategories({
        companyId: companyId!,
      }),
    enabled: !!companyId,
    staleTime: CATEGORIES_STALE_TIME,
  });
};

export const useFetchCategories = (companyId?: number) => {
  return useQuery({
    ...categoriesQueryOptions(companyId),
  });
};
