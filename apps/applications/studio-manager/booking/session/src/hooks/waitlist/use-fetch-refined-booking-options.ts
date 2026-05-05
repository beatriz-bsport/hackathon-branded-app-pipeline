import { useQueries, useQuery } from "@tanstack/react-query";
import { useMemo } from "react";

import {
  type BookingOptionListParams,
  fetchPaginatedBookingOptionsQueryOption,
  fetchWaitingListPositionsQueryOption,
} from "@bsport/api-book";
import { memberListQueryOptions } from "@bsport/api-cdp";

import { useSessionManagementStore } from "#src/stores/session-management/store.js";
import { WaitlistFilter } from "#src/stores/session-management/types.js";
import type { RefinedBookingOption } from "#src/types";
import { fetch } from "#src/utils/fetch";

const STALE_TIME = 2 * 60 * 1000; // 2 minutes

export const useFetchRefinedBookingOptions = (
  params: BookingOptionListParams,
) => {
  const waitlistFilters = useSessionManagementStore(
    (state) => state.waitlistFilters,
  );

  const bookingOptionsQueryParams: BookingOptionListParams = {
    ...params,
    ...{ cancelled: waitlistFilters === WaitlistFilter.CANCELLED },
    ...(waitlistFilters === WaitlistFilter.IS_CONVERTIBLE && {
      is_convertible: true,
    }),
  };

  const bookingOptionsQuery = useQuery({
    ...fetchPaginatedBookingOptionsQueryOption(
      fetch,
      bookingOptionsQueryParams,
    ),
    throwOnError: true,
    staleTime: STALE_TIME,
  });

  const bookingOptions = useMemo(
    () => bookingOptionsQuery.data?.results ?? [],
    [bookingOptionsQuery.data?.results],
  );

  const memberIds = [
    ...new Set(bookingOptions.map((option) => option.member).filter(Boolean)),
  ];

  const sessionId = params.offer;

  const [membersQuery, positionsQuery] = useQueries({
    queries: [
      {
        ...memberListQueryOptions(fetch, {
          id__in: memberIds,
          page_size: memberIds.length,
        }),
        enabled: memberIds.length > 0,
        throwOnError: true,
        staleTime: STALE_TIME,
      },
      {
        ...fetchWaitingListPositionsQueryOption(fetch, sessionId!),
        enabled: sessionId != null,
        throwOnError: true,
        staleTime: STALE_TIME,
      },
    ],
  });

  const isLoading =
    bookingOptionsQuery.isLoading ||
    membersQuery.isLoading ||
    positionsQuery.isLoading;
  const error =
    bookingOptionsQuery.error || membersQuery.error || positionsQuery.error;

  const refinedBookingOptions = useMemo(() => {
    const membersMap = new Map(
      membersQuery.data?.results.map((member) => [member.id, member]),
    );
    const positionsMap = new Map(
      (positionsQuery.data ?? []).map((position) => [
        position.id,
        position.waiting_list_position,
      ]),
    );

    return bookingOptions.map<RefinedBookingOption>((option) => ({
      ...option,
      memberData: membersMap.get(option.member),
      waitingListPosition: positionsMap.get(option.id),
    }));
  }, [bookingOptions, membersQuery.data?.results, positionsQuery.data]);

  return {
    ...bookingOptionsQuery.data,
    results: refinedBookingOptions,
    isLoading,
    error,
  };
};
