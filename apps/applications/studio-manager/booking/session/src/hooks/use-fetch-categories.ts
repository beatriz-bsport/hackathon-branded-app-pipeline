import { useQuery } from "@tanstack/react-query";

import { fetchSportCategoriesQueryOptions } from "@bsport/api-core/categories";

import { fetch } from "#src/utils/fetch";

const CATEGORIES_STALE_TIME = 2 * 60 * 1000; // 2 minutes

export const useFetchCategories = (companyId?: number) => {
  return useQuery({
    ...fetchSportCategoriesQueryOptions(fetch, { company_id: companyId! }),
    enabled: !!companyId,
    staleTime: CATEGORIES_STALE_TIME,
  });
};
