import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";

import {
  type FetchGroupActivitiesParams,
  type MetaActivity,
  type SearchGroupActivitiesParams,
  fetchGroupActivitiesAndWorkshopsInfiniteQueryOptions,
  fetchGroupActivitiesAndWorkshopsQueryOptions,
  searchGroupActivitiesAndWorkshopsInfiniteQueryOptions,
} from "@bsport/api-book/group-activity";
import type { Fetch } from "@bsport/fetch";

import { useInfiniteScroll } from "#src/hooks/use-infinite-scroll";

const ACTIVITIES_STALE_TIME = 2 * 60 * 1000; // 2 minutes
const DEFAULT_PAGE_SIZE = 20;

/**
 * Infinite-fetches group activities and workshops without a search query.
 * Used for the default (unfiltered) list view of the activity selector.
 */
export const useActivitiesInfiniteQuery = (
  fetch: Fetch,
  params: FetchGroupActivitiesParams,
  enabled: boolean,
) =>
  useInfiniteQuery({
    ...fetchGroupActivitiesAndWorkshopsInfiniteQueryOptions(fetch, params),
    enabled,
    staleTime: ACTIVITIES_STALE_TIME,
  });

/**
 * Infinite-searches group activities and workshops with a search query.
 * Used as soon as the user types into the autocomplete input.
 */
export const useSearchActivitiesInfiniteQuery = (
  fetch: Fetch,
  params: SearchGroupActivitiesParams,
  enabled: boolean,
) =>
  useInfiniteQuery({
    ...searchGroupActivitiesAndWorkshopsInfiniteQueryOptions(fetch, params),
    enabled,
    staleTime: ACTIVITIES_STALE_TIME,
  });

/**
 * Fetches a fixed set of activities by their ids in a single page.
 * Used to resolve the labels of already-selected activities even when they
 * are not part of the currently visible (filtered) page.
 */
export const useActivitiesByIdsQuery = (fetch: Fetch, ids: number[]) =>
  useQuery({
    ...fetchGroupActivitiesAndWorkshopsQueryOptions(fetch, {
      inIdList: ids,
      pageSize: ids.length,
    }),
    enabled: ids.length > 0,
    staleTime: ACTIVITIES_STALE_TIME,
  });

type UseActivitySelectorQueriesParams = {
  fetch: Fetch;
  /** Activity ids currently selected in the form. Used to resolve their labels. */
  selectedIds: number[];
  /** Filter by workshop / group activity. When undefined, both are returned. */
  isWorkshop?: boolean;
  /** Whether to include archived activities (false) or only active ones (true). */
  customerEnabled?: boolean;
  pageSize?: number;
};

type AutocompleteItem = { id: string; label: string };

/**
 * Composite hook that wires the three activity queries into the props expected
 * by `AutocompleteControlled` (items, isLoading, search handlers, infinite scroll).
 *
 * - When the search query is empty, falls back to the paginated default list.
 * - When the search query is non-empty, switches to the search endpoint.
 * - Always merges the currently selected activities into the items list so the
 *   selected labels remain visible even when filtered out.
 */
export const useActivitySelectorQueries = ({
  fetch,
  selectedIds,
  isWorkshop,
  customerEnabled = true,
  pageSize = DEFAULT_PAGE_SIZE,
}: UseActivitySelectorQueriesParams) => {
  const [searchQuery, setSearchQuery] = useState("");
  const isSearchMode = searchQuery.length > 0;

  const baseParams: FetchGroupActivitiesParams = {
    pageSize,
    customerEnabled,
    ...(isWorkshop !== undefined && { isWorkshop }),
  };

  const listQuery = useActivitiesInfiniteQuery(
    fetch,
    baseParams,
    !isSearchMode,
  );

  const searchQueryResult = useSearchActivitiesInfiniteQuery(
    fetch,
    { ...baseParams, searchQuery },
    isSearchMode,
  );

  const activeQuery = isSearchMode ? searchQueryResult : listQuery;

  const fetchedActivities = useMemo<MetaActivity[]>(
    () => activeQuery.data?.pages.flatMap((page) => page.results) ?? [],
    [activeQuery.data],
  );

  const { data: selectedActivitiesPage } = useActivitiesByIdsQuery(
    fetch,
    selectedIds,
  );

  const selectedActivities = useMemo<MetaActivity[]>(
    () => selectedActivitiesPage?.results ?? [],
    [selectedActivitiesPage],
  );

  const items = useMemo<AutocompleteItem[]>(() => {
    const seen = new Set<number>();
    const merged: MetaActivity[] = [];
    for (const activity of [...selectedActivities, ...fetchedActivities]) {
      if (seen.has(activity.id)) continue;
      seen.add(activity.id);
      merged.push(activity);
    }
    return merged.map((activity) => ({
      id: activity.id.toString(),
      label: activity.name,
    }));
  }, [selectedActivities, fetchedActivities]);

  const { onScroll } = useInfiniteScroll({
    hasNextPage: activeQuery.hasNextPage,
    isFetchingNextPage: activeQuery.isFetchingNextPage,
    fetchNextPage: activeQuery.fetchNextPage,
  });

  return {
    items,
    selectedActivities,
    isLoading: activeQuery.isLoading,
    onValueChange: setSearchQuery,
    onClear: () => setSearchQuery(""),
    onScroll,
  };
};
