import { useSuspenseInfiniteQuery } from "@tanstack/react-query";
import { useEffect, useMemo } from "react";

import {
  type Pass,
  passCategoriesInfiniteQueryOptions,
  passesInfiniteQueryOptions,
} from "@bsport/api-buyables";

import {
  COMPATIBLE_PASSES_CATEGORIES_PAGE_SIZE,
  COMPATIBLE_PASSES_PAGE_SIZE,
} from "#src/hooks/constants";
import type { CompatiblePass, CompatiblePassGroup } from "#src/types";
import { fetch } from "#src/utils/fetch";

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

export const useCompatiblePasses = (metaActivityId: number) => {
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
    }),
  );

  useEffect(() => {
    if (hasNextPage && !isFetchingNextPage && !isFetchNextPageError)
      fetchNextPage();
  }, [hasNextPage, isFetchingNextPage, isFetchNextPageError, fetchNextPage]);

  const {
    data: archivedData,
    fetchNextPage: fetchNextArchivedPage,
    hasNextPage: hasNextArchivedPage,
    isFetchingNextPage: isFetchingNextArchivedPage,
    isFetchNextPageError: isFetchNextArchivedPageError,
  } = useSuspenseInfiniteQuery(
    passesInfiniteQueryOptions(fetch, {
      meta_activity: metaActivityId,
      disabled: true,
      page_size: COMPATIBLE_PASSES_PAGE_SIZE,
    }),
  );

  useEffect(() => {
    if (
      hasNextArchivedPage &&
      !isFetchingNextArchivedPage &&
      !isFetchNextArchivedPageError
    )
      fetchNextArchivedPage();
  }, [
    hasNextArchivedPage,
    isFetchingNextArchivedPage,
    isFetchNextArchivedPageError,
    fetchNextArchivedPage,
  ]);

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

  const groups = useMemo<CompatiblePassGroup[]>(() => {
    if (!passes.length) return [];

    const categories = categoriesData?.pages.flatMap((p) => p.results) ?? [];

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
  }, [passes, categoriesData]);

  const archivedPasses = useMemo(
    () =>
      archivedData?.pages.flatMap((p) => p.results).map(toCompatiblePass) ?? [],
    [archivedData],
  );

  const archivedCount = archivedData?.pages[0]?.count ?? 0;

  return {
    groups,
    count,
    archivedPasses,
    archivedCount,
  };
};
