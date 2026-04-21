import { useQuery } from "@tanstack/react-query";

import { fetchSportCategoriesQueryOptions } from "@bsport/api-core/categories";

import { fetch } from "#src/utils/fetch";

const CATEGORIES_STALE_TIME = 5 * 60 * 1000; // 5 minutes - Unlikely to change (static DB)

export const useCategoriesQuery = (companyId: number) => {
  return useQuery({
    ...fetchSportCategoriesQueryOptions(fetch, { company_id: companyId }),
    staleTime: CATEGORIES_STALE_TIME,
  });
};
