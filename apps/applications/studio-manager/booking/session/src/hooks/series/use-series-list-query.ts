import {
  type QueryObserverResult,
  keepPreviousData,
  useQuery,
} from "@tanstack/react-query";
import { useCallback, useEffect, useMemo, useRef } from "react";

import {
  type PaginatedGroupSessionParams,
  fetchGroupSessionsQueryOptions,
  searchGroupSessionsQueryOptions,
} from "@bsport/api-book";
import { type DateTime, getIsoDate } from "@bsport/datetime-manipulation";
import type {
  FilterElementState,
  PaginationProps,
} from "@bsport/kaizen-primitive-core";
import type { PaginatedResponse } from "@bsport/store-base";
import { usePaginationQueryParams } from "@bsport/use-pagination-query-params";

import {
  getSeriesAvailableParamFromFilters,
  getSeriesParamsFromFilters,
} from "#src/components/series-list/filters/get-params-from-filters";
import { useToday } from "#src/hooks/use-today";
import type { Series, SeriesOrdering } from "#src/types";
import { fetch } from "#src/utils/fetch";

const SERIES_PAGINATION_NAMESPACE = "series";
const SERIES_DEFAULT_PAGE = 1;
const SERIES_DEFAULT_PAGE_SIZE = 10;
const SERIES_STALE_TIME = 2 * 60 * 1000; // 2 minutes
const EMPTY_SERIES_FILTERS: FilterElementState[] = [];

type UseSeriesListQueryParams = {
  available?: boolean;
  enabled?: boolean;
  filters?: FilterElementState[];
  maxDate?: DateTime | null;
  minDate?: DateTime;
  ordering?: SeriesOrdering;
  searchQuery?: string;
  canShowCancelled?: boolean;
  showCancelled?: boolean;
};

type SeriesListQueryResult = {
  hasAnySeries: boolean;
  isCheckingSeriesExistence: boolean;
  paginationProps: PaginationProps;
  query: QueryObserverResult<PaginatedResponse<Series>, Error>;
  resetPage: () => void;
  series: Series[];
};

const selectHasAnySeries = (response: PaginatedResponse<Series>): boolean =>
  response.count > 0;

export const useSeriesListQuery = ({
  available = true,
  enabled = true,
  filters = EMPTY_SERIES_FILTERS,
  maxDate,
  minDate,
  ordering = "upcoming",
  searchQuery = "",
  canShowCancelled = true,
  showCancelled = true,
}: UseSeriesListQueryParams = {}): SeriesListQueryResult => {
  const today = useToday();
  const effectiveMinDate = minDate ?? today;
  const minDateIso = getIsoDate(effectiveMinDate);
  const maxDateIso = maxDate ? getIsoDate(maxDate) : null;
  const trimmedSearchQuery = searchQuery.trim();
  const hasSearchQuery = trimmedSearchQuery.length > 0;
  const { currentPage, currentPageSize, setPage, setPageSettings } =
    usePaginationQueryParams({
      namespace: SERIES_PAGINATION_NAMESPACE,
      defaultValues: {
        page: SERIES_DEFAULT_PAGE,
        page_size: SERIES_DEFAULT_PAGE_SIZE,
      },
    });

  const filterParams = useMemo(
    () => getSeriesParamsFromFilters(filters, { canShowCancelled }),
    [canShowCancelled, filters],
  );
  const effectiveShowCancelled = canShowCancelled ? showCancelled : false;
  const availableParam = useMemo(
    () =>
      getSeriesAvailableParamFromFilters(
        filters,
        effectiveShowCancelled,
        available,
        canShowCancelled,
      ),
    [available, canShowCancelled, effectiveShowCancelled, filters],
  );
  const existenceAvailableParam = useMemo(
    () =>
      getSeriesAvailableParamFromFilters(
        filters,
        canShowCancelled,
        available,
        canShowCancelled,
      ),
    [available, canShowCancelled, filters],
  );
  const orderingParam = ordering === "name" ? ordering : undefined;

  const queryParams = useMemo<PaginatedGroupSessionParams>(
    () => ({
      ...(availableParam !== undefined ? { available: availableParam } : {}),
      ...filterParams,
      ...(orderingParam ? { ordering: orderingParam } : {}),
      page: currentPage,
      page_size: currentPageSize,
      min_date: minDateIso,
      ...(maxDateIso ? { max_date: maxDateIso } : {}),
    }),
    [
      availableParam,
      currentPage,
      currentPageSize,
      filterParams,
      maxDateIso,
      minDateIso,
      orderingParam,
    ],
  );

  const seriesExistenceQueryParams = useMemo<PaginatedGroupSessionParams>(
    () => ({
      ...(existenceAvailableParam !== undefined
        ? { available: existenceAvailableParam }
        : {}),
      page: SERIES_DEFAULT_PAGE,
      page_size: 1,
    }),
    [existenceAvailableParam],
  );

  const pageResetKey = JSON.stringify({
    maxDateIso,
    minDateIso,
    ordering,
    searchQuery: trimmedSearchQuery,
    showCancelled: effectiveShowCancelled,
  });
  const previousPageResetKeyRef = useRef(pageResetKey);

  useEffect(() => {
    if (previousPageResetKeyRef.current === pageResetKey) {
      return;
    }

    previousPageResetKeyRef.current = pageResetKey;
    setPage(SERIES_DEFAULT_PAGE);
  }, [pageResetKey, setPage]);

  const seriesSearchQuery = useQuery({
    ...searchGroupSessionsQueryOptions(fetch, {
      ...queryParams,
      q: trimmedSearchQuery,
    }),
    enabled: enabled && hasSearchQuery,
    placeholderData: keepPreviousData,
    staleTime: SERIES_STALE_TIME,
  });

  const listQuery = useQuery({
    ...fetchGroupSessionsQueryOptions(fetch, queryParams),
    enabled: enabled && !hasSearchQuery,
    placeholderData: keepPreviousData,
    staleTime: SERIES_STALE_TIME,
  });

  const query = hasSearchQuery ? seriesSearchQuery : listQuery;

  const seriesExistenceQuery = useQuery({
    // The table query is date-filtered by the current range. This page-size-one
    // query ignores display-only cancelled visibility so the empty state can
    // distinguish "no series exist" from "some are hidden by current criteria".
    ...fetchGroupSessionsQueryOptions(fetch, seriesExistenceQueryParams),
    enabled,
    select: selectHasAnySeries,
    staleTime: SERIES_STALE_TIME,
  });

  const paginationProps = useMemo<PaginationProps>(
    () => ({
      currentPage,
      disabled: query.isFetching,
      rowsPerPage: currentPageSize,
      showRowsPerPageSelector: true,
      totalItems: query.data?.count ?? 0,
      onPageSettingsChange: setPageSettings,
    }),
    [
      currentPage,
      currentPageSize,
      query.data?.count,
      query.isFetching,
      setPageSettings,
    ],
  );

  const resetPage = useCallback(() => setPage(SERIES_DEFAULT_PAGE), [setPage]);

  return {
    hasAnySeries: seriesExistenceQuery.data ?? false,
    isCheckingSeriesExistence: seriesExistenceQuery.isLoading,
    paginationProps,
    query,
    resetPage,
    series: query.data?.results ?? [],
  };
};
