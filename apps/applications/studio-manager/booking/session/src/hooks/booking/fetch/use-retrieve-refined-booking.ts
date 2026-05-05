import { useQueries, useQuery } from "@tanstack/react-query";
import { useMemo } from "react";

import { retrieveBookingQueryOptions } from "@bsport/api-book";
import {
  consumerPaymentPackListQueryOptions,
  passesQueryOptions,
} from "@bsport/api-buyables";
import { memberQueryOptions } from "@bsport/api-cdp";

import type { RefinedBooking } from "#src/types";
import { fetch } from "#src/utils/fetch";

const MEMBER_STALE_TIME = 2 * 60 * 1000; // 2 minutes

export const useRetrieveRefinedBooking = (bookingId: number | null) => {
  const bookingQuery = useQuery({
    ...retrieveBookingQueryOptions(fetch, bookingId!),
    enabled: bookingId != null,
    throwOnError: true,
  });

  const booking = bookingQuery.data;

  const cppId = booking?.consumer_payment_pack;

  const [memberQuery, consumerPaymentPacksQuery] = useQueries({
    queries: [
      {
        ...memberQueryOptions(fetch, {
          // memberId can be null, but the query should only run if it's a number
          memberId: booking?.member as number,
        }),
        enabled: booking?.member != null,
        staleTime: MEMBER_STALE_TIME,
        throwOnError: true,
      },
      {
        ...consumerPaymentPackListQueryOptions(fetch, {
          id__in: cppId ? [cppId] : [],
          page_size: 1,
        }),
        enabled: cppId != null,
        throwOnError: true,
      },
    ],
  });

  const passId = consumerPaymentPacksQuery.data?.results?.[0]?.payment_pack;

  const passesQuery = useQuery({
    ...passesQueryOptions(fetch, {
      id__in: passId ? [passId] : [],
      page_size: 1,
    }),
    enabled: passId != null,
    throwOnError: true,
  });

  const isLoading =
    bookingQuery.isLoading ||
    memberQuery.isLoading ||
    consumerPaymentPacksQuery.isLoading ||
    passesQuery.isLoading;

  const error =
    bookingQuery.error ||
    memberQuery.error ||
    consumerPaymentPacksQuery.error ||
    passesQuery.error;

  const refinedBooking = useMemo<RefinedBooking | null>(() => {
    if (!booking) return null;

    return {
      ...booking,
      memberData: memberQuery.data,
      consumerPaymentPackData: consumerPaymentPacksQuery.data?.results?.[0],
      passData: passesQuery.data?.results?.[0],
    };
  }, [
    booking,
    memberQuery.data,
    consumerPaymentPacksQuery.data?.results,
    passesQuery.data?.results,
  ]);

  return {
    refinedBooking,
    isLoading,
    error,
  };
};
