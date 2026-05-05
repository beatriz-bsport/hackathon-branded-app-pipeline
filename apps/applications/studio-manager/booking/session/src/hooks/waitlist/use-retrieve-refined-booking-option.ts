import { useQueries, useQuery } from "@tanstack/react-query";
import { useMemo } from "react";

import {
  BookingOptionDetail,
  fetchWaitingListPositionsQueryOption,
  retrieveBookingOptionQueryOptions,
} from "@bsport/api-book";
import { memberQueryOptions } from "@bsport/api-cdp";

import type { RefinedBookingOption } from "#src/types";
import { fetch } from "#src/utils/fetch";

const MEMBER_STALE_TIME = 2 * 60 * 1000; // 2 minutes

export const useRetrieveRefinedBookingOption = (
  bookingOptionId: number | null,
) => {
  const bookingOptionQuery = useQuery({
    ...retrieveBookingOptionQueryOptions(fetch, bookingOptionId!),
    enabled: bookingOptionId != null,
    throwOnError: true,
  });

  const bookingOption = bookingOptionQuery.data;

  const sessionId = bookingOption?.offer.id;

  const [memberQuery, positionsQuery] = useQueries({
    queries: [
      {
        ...memberQueryOptions(fetch, {
          memberId: bookingOption?.member as number,
        }),
        enabled: bookingOption?.member != null,
        staleTime: MEMBER_STALE_TIME,
        throwOnError: true,
      },
      {
        ...fetchWaitingListPositionsQueryOption(fetch, sessionId!),
        enabled: sessionId != null,
        throwOnError: true,
      },
    ],
  });

  const isLoading =
    bookingOptionQuery.isLoading ||
    memberQuery.isLoading ||
    positionsQuery.isLoading;

  const error =
    bookingOptionQuery.error || memberQuery.error || positionsQuery.error;

  const refinedBookingOption =
    useMemo<RefinedBookingOption<BookingOptionDetail> | null>(() => {
      if (!bookingOption) return null;

      const position = positionsQuery.data?.find(
        (p) => p.id === bookingOption.id,
      );

      return {
        ...bookingOption,
        memberData: memberQuery.data,
        waitingListPosition: position?.waiting_list_position,
      };
    }, [bookingOption, memberQuery.data, positionsQuery.data]);

  return {
    refinedBookingOption,
    isLoading,
    error,
  };
};
