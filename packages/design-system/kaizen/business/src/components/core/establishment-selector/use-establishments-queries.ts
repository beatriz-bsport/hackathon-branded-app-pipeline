import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";

import {
  type Establishment,
  type FetchEstablishmentParams,
  type SearchEstablishmentParams,
  fetchEstablishmentsInfiniteQueryOptions,
  fetchEstablishmentsQueryOptions,
  searchEstablishmentsInfiniteQueryOptions,
} from "@bsport/api-book/establishments";
import type { Fetch } from "@bsport/fetch";

import { useInfiniteScroll } from "#src/hooks/use-infinite-scroll";

const ESTABLISHMENTS_STALE_TIME = 2 * 60 * 1000; // 2 minutes
const DEFAULT_PAGE_SIZE = 20;

/**
 * Infinite-fetches establishments without a search query.
 * Used for the default (unfiltered) list view of the selector.
 */
export const useEstablishmentsInfiniteQuery = (
  fetch: Fetch,
  params: FetchEstablishmentParams,
  enabled: boolean,
) =>
  useInfiniteQuery({
    ...fetchEstablishmentsInfiniteQueryOptions(fetch, params),
    enabled,
    staleTime: ESTABLISHMENTS_STALE_TIME,
  });

/**
 * Infinite-searches establishments with a search query.
 * Used as soon as the user types into the autocomplete input.
 */
export const useSearchEstablishmentsInfiniteQuery = (
  fetch: Fetch,
  params: SearchEstablishmentParams,
  enabled: boolean,
) =>
  useInfiniteQuery({
    ...searchEstablishmentsInfiniteQueryOptions(fetch, params),
    enabled,
    staleTime: ESTABLISHMENTS_STALE_TIME,
  });

/**
 * Fetches a fixed set of establishments by their ids in a single page.
 * Used to resolve the labels of already-selected establishments even when they
 * are not part of the currently visible (filtered) page.
 */
export const useEstablishmentsByIdsQuery = (fetch: Fetch, ids: number[]) =>
  useQuery({
    ...fetchEstablishmentsQueryOptions(fetch, {
      id__in: ids,
      page_size: ids.length,
    }),
    enabled: ids.length > 0,
    staleTime: ESTABLISHMENTS_STALE_TIME,
  });

type UseEstablishmentSelectorQueriesParams = {
  fetch: Fetch;
  /** Company whose establishments are listed. */
  companyId: number;
  /** Establishment ids currently selected in the form. Used to resolve their labels. */
  selectedIds: number[];
};

type AutocompleteItem = { id: string; label: string };
type AutocompleteGroup = { title: string; options: AutocompleteItem[] };

/**
 * Groups establishments by their location address into the grouped
 * `AutocompleteItems` shape. The Autocomplete renders one section title per
 * address and inserts dividers between groups on its own.
 */
function groupEstablishmentsByAddress(
  establishments: Establishment[],
): AutocompleteGroup[] {
  const grouped = new Map<string, AutocompleteItem[]>();

  establishments.forEach((establishment) => {
    const option = {
      id: establishment.id.toString(),
      label: establishment.title,
    };

    const existing = grouped.get(establishment.location.address);
    if (existing) {
      existing.push(option);
    } else {
      grouped.set(establishment.location.address, [option]);
    }
  });

  return Array.from(grouped.entries()).map(([title, options]) => ({
    title,
    options,
  }));
}

/**
 * Composite hook that wires the three establishment queries into the props expected
 * by `AutocompleteControlled` (items, isLoading, search handlers, infinite scroll).
 *
 * - When the search query is empty, falls back to the paginated default list.
 * - When the search query is non-empty, switches to the search endpoint.
 * - Always merges the currently selected establishments into the items list so the
 *   selected labels remain visible even when filtered out.
 */
export const useEstablishmentSelectorQueries = ({
  fetch,
  companyId,
  selectedIds,
}: UseEstablishmentSelectorQueriesParams) => {
  const [searchQuery, setSearchQuery] = useState("");
  const isSearchMode = searchQuery.length > 0;

  const baseParams: FetchEstablishmentParams = {
    company: companyId,
    page_size: DEFAULT_PAGE_SIZE,
    disabled: false,
  };

  const listQuery = useEstablishmentsInfiniteQuery(
    fetch,
    baseParams,
    !isSearchMode,
  );

  const searchQueryResult = useSearchEstablishmentsInfiniteQuery(
    fetch,
    { ...baseParams, q: searchQuery },
    isSearchMode,
  );

  const activeQuery = isSearchMode ? searchQueryResult : listQuery;

  const fetchedEstablishments = useMemo<Establishment[]>(
    () => activeQuery.data?.pages.flatMap((page) => page.results) ?? [],
    [activeQuery.data],
  );

  const { data: selectedEstablishmentsPage } = useEstablishmentsByIdsQuery(
    fetch,
    selectedIds,
  );

  const selectedEstablishments = useMemo<Establishment[]>(
    () => selectedEstablishmentsPage?.results ?? [],
    [selectedEstablishmentsPage],
  );

  const items = useMemo<AutocompleteGroup[]>(() => {
    const seen = new Set<number>();
    const merged: Establishment[] = [];
    for (const establishment of [
      ...selectedEstablishments,
      ...fetchedEstablishments,
    ]) {
      if (seen.has(establishment.id)) continue;
      seen.add(establishment.id);
      merged.push(establishment);
    }
    return groupEstablishmentsByAddress(merged);
  }, [selectedEstablishments, fetchedEstablishments]);

  const { onScroll } = useInfiniteScroll({
    hasNextPage: activeQuery.hasNextPage,
    isFetchingNextPage: activeQuery.isFetchingNextPage,
    fetchNextPage: activeQuery.fetchNextPage,
  });

  return {
    items,
    selectedEstablishments,
    isLoading: activeQuery.isLoading,
    onValueChange: setSearchQuery,
    onClear: () => setSearchQuery(""),
    onScroll,
  };
};
