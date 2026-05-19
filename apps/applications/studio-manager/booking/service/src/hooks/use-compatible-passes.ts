import { useSuspenseInfiniteQuery } from "@tanstack/react-query";
import { useEffect, useMemo } from "react";

import {
  type Pass,
  type PassCategory,
  passCategoriesInfiniteQueryOptions,
  passesInfiniteQueryOptions,
} from "@bsport/api-buyables";

import {
  COMPATIBLE_PASSES_CATEGORIES_PAGE_SIZE,
  COMPATIBLE_PASSES_PAGE_SIZE,
} from "#src/hooks/constants";
import type { CompatiblePass, CompatiblePassGroup } from "#src/types";
import { fetch } from "#src/utils/fetch";

type CompatiblePassFilters = {
  searchQuery?: string;
  categoryIds?: number[];
  properties?: string[];
};

const toCompatiblePass = (pass: Pass): CompatiblePass => ({
  id: pass.id,
  name: pass.name,
  price: pass.price,
  manager_only: pass.manager_only,
  new_member_only: pass.new_member_only,
  linked_private_pass: pass.linked_private_pass,
  is_usable_by_staff: pass.is_usable_by_staff,
  credits: pass.credits,
  unlimited: pass.unlimited,
  SCTs: pass.SCTs,
  metaActivities: pass.metaActivities,
  establishments: pass.establishments,
  off_peak_schedule: pass.off_peak_schedule,
});

/**
 * Client-side only. The passes API has no multi-value property filter,
 * so we evaluate flags against the already-fetched pass data.
 */
const matchesProperty = (pass: CompatiblePass, prop: string): boolean => {
  switch (prop) {
    case "universal":
      return pass.linked_private_pass !== null;
    case "unlisted":
      return pass.manager_only;
    case "staffRestricted":
      return !pass.is_usable_by_staff;
    case "newMembersOnly":
      return pass.new_member_only;
    default:
      return false;
  }
};

export const useCompatiblePasses = (
  metaActivityId: number,
  filters: CompatiblePassFilters = {},
) => {
  const { searchQuery = "", categoryIds = [], properties = [] } = filters;

  // SERVER-SIDE: `meta_activity` and `disabled` are filtered by the API.
  // When `q` is provided, the request goes to the dedicated /search/ endpoint
  // (see passesInfiniteQueryOptions in @bsport/api-buyables); otherwise the
  // standard list endpoint is used.
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isFetchNextPageError,
  } = useSuspenseInfiniteQuery(
    passesInfiniteQueryOptions(fetch, {
      meta_activity: metaActivityId,
      disabled: false,
      page_size: COMPATIBLE_PASSES_PAGE_SIZE,
      ...(searchQuery ? { q: searchQuery } : {}),
    }),
  );

  useEffect(() => {
    if (hasNextPage && !isFetchingNextPage && !isFetchNextPageError)
      fetchNextPage();
  }, [hasNextPage, isFetchingNextPage, isFetchNextPageError, fetchNextPage]);

  // Categories are fetched independently — no server-side filtering needed.
  // All pages are auto-fetched so every category is available for grouping.
  const {
    data: categoriesData,
    fetchNextPage: fetchNextCategoriesPage,
    hasNextPage: hasNextCategoriesPage,
    isFetchingNextPage: isFetchingNextCategoriesPage,
    isFetchNextPageError: isFetchNextCategoriesPageError,
  } = useSuspenseInfiniteQuery(
    passCategoriesInfiniteQueryOptions(fetch, {
      page_size: COMPATIBLE_PASSES_CATEGORIES_PAGE_SIZE,
    }),
  );

  useEffect(() => {
    if (
      hasNextCategoriesPage &&
      !isFetchingNextCategoriesPage &&
      !isFetchNextCategoriesPageError
    )
      fetchNextCategoriesPage();
  }, [
    hasNextCategoriesPage,
    isFetchingNextCategoriesPage,
    isFetchNextCategoriesPageError,
    fetchNextCategoriesPage,
  ]);

  const passes = useMemo(
    () => data?.pages.flatMap((p) => p.results) ?? [],
    [data],
  );

  const count = data?.pages[0]?.count ?? 0;

  const categories = useMemo<PassCategory[]>(
    () => categoriesData?.pages.flatMap((p) => p.results) ?? [],
    [categoriesData],
  );

  const groups = useMemo<CompatiblePassGroup[]>(() => {
    if (!passes.length) return [];

    const passesByCategory = new Map<
      number | null,
      CompatiblePassGroup["passes"]
    >();

    for (const pass of passes) {
      const key = pass.category ?? null;
      if (!passesByCategory.has(key)) passesByCategory.set(key, []);
      passesByCategory.get(key)!.push(toCompatiblePass(pass));
    }

    const categorized = categories
      .filter((c) => passesByCategory.has(c.id))
      .sort((a, b) => a.category_ordering - b.category_ordering)
      .map((c) => ({
        category: c,
        passes: passesByCategory.get(c.id)!,
      }));

    const categorizedIds = new Set(categorized.map((g) => g.category.id));
    const orphanPasses = [...passesByCategory.entries()]
      .filter(([id]) => id !== null && !categorizedIds.has(id as number))
      .flatMap(([, p]) => p);

    const uncategorized = [
      ...(passesByCategory.get(null) ?? []),
      ...orphanPasses,
    ];

    return uncategorized.length
      ? [...categorized, { category: null, passes: uncategorized }]
      : categorized;
  }, [passes, categories]);

  // CLIENT-SIDE: category and property filters are applied in-memory.
  // The passes API only supports a single `category` param (no multi-value),
  // so multi-select category filtering and all property flag filtering must
  // happen here against the already-fetched dataset.
  const filteredGroups = useMemo<CompatiblePassGroup[]>(() => {
    return groups
      .map(({ category, passes: groupPasses }) => {
        let filtered = groupPasses;

        if (categoryIds.length > 0) {
          if (category === null || !categoryIds.includes(category.id)) {
            filtered = [];
          }
        }

        if (properties.length > 0) {
          filtered = filtered.filter((pass) =>
            properties.some((prop) => matchesProperty(pass, prop)),
          );
        }

        return { category, passes: filtered };
      })
      .filter(({ passes: filteredPasses }) => filteredPasses.length > 0);
  }, [groups, categoryIds, properties]);

  const isFiltered =
    !!searchQuery || categoryIds.length > 0 || properties.length > 0;

  return {
    groups: filteredGroups,
    count,
    categories,
    isFiltered,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
  };
};
