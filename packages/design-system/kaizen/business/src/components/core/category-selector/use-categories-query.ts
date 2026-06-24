import { useQuery } from "@tanstack/react-query";

import {
  SportCategory,
  fetchSportCategoriesQueryOptions,
} from "@bsport/api-core/categories";
import type { Fetch } from "@bsport/fetch";

const CATEGORIES_STALE_TIME = 5 * 60 * 1000; // 5 minutes - Unlikely to change (static DB)

function selectItems(data?: SportCategory[]) {
  return (data ?? []).map((category) => ({
    id: category.id.toString(),
    label: category.name,
  }));
}

export const useCategoriesQuery = (fetch: Fetch, companyId: number) => {
  // Categories are a small, stable list (~100), so they are fetched in full and
  // filtered client-side — no pagination or remote search needed.
  return useQuery({
    ...fetchSportCategoriesQueryOptions(fetch, { company_id: companyId }),
    staleTime: CATEGORIES_STALE_TIME,
    select: selectItems,
  });
};
