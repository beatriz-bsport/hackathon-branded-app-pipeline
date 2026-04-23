import { useQueries, useQuery } from "@tanstack/react-query";
import { useMemo } from "react";

import {
  type PaginatedBookingFilterParams,
  bookingsQueryOptions,
} from "@bsport/api-book";
import {
  consumerPaymentPackListQueryOptions,
  passesQueryOptions,
} from "@bsport/api-buyables";
import { memberListQueryOptions } from "@bsport/api-cdp";

import { getBookingParamsFromFilters } from "#src/components/session-management/filters/get-booking-params-from-filters";
import { useSessionManagementStore } from "#src/stores/session-management/store";
import type { RefinedBooking } from "#src/types";
import { fetch } from "#src/utils/fetch";

export const useFetchRefinedBookings = (
  params: PaginatedBookingFilterParams,
) => {
  const bookingsFilters = useSessionManagementStore(
    (state) => state.bookingFilters,
  );

  const bookingsFilterParams = getBookingParamsFromFilters(bookingsFilters);

  const bookingsQuery = useQuery(
    bookingsQueryOptions(fetch, { ...params, ...bookingsFilterParams }),
  );

  const bookings = useMemo(
    () => bookingsQuery.data?.results ?? [],
    [bookingsQuery.data?.results],
  );

  const memberIds = [
    ...new Set(
      bookings
        .map((booking) => booking.member)
        .filter((id): id is number => id !== null),
    ),
  ];

  const consumerPaymentPackIds = [
    ...new Set(
      bookings
        .map((booking) => booking.consumer_payment_pack)
        .filter((id): id is number => id !== null),
    ),
  ];

  const [membersQuery, consumerPaymentPacksQuery] = useQueries({
    queries: [
      {
        ...memberListQueryOptions(fetch, {
          id__in: memberIds,
          page_size: memberIds.length,
        }),
        enabled: memberIds.length > 0,
      },
      {
        ...consumerPaymentPackListQueryOptions(fetch, {
          id__in: consumerPaymentPackIds,
          page_size: consumerPaymentPackIds.length,
        }),
        enabled: consumerPaymentPackIds.length > 0,
      },
    ],
  });

  const passIds = [
    ...new Set(
      (consumerPaymentPacksQuery.data?.results ?? [])
        .map((cpp) => cpp.payment_pack)
        .filter((id): id is number => id != null),
    ),
  ];

  const passesQuery = useQuery({
    ...passesQueryOptions(fetch, {
      id__in: passIds,
      page_size: passIds.length,
    }),
    enabled: passIds.length > 0,
  });

  const isLoading =
    bookingsQuery.isLoading ||
    membersQuery.isLoading ||
    consumerPaymentPacksQuery.isLoading ||
    passesQuery.isLoading;
  const error =
    bookingsQuery.error ||
    membersQuery.error ||
    consumerPaymentPacksQuery.error ||
    passesQuery.error;

  const refinedBookings = useMemo(() => {
    const membersMap = new Map(
      membersQuery.data?.results.map((member) => [member.id, member]),
    );
    const consumerPaymentPacksMap = new Map(
      consumerPaymentPacksQuery.data?.results.map((cpp) => [cpp.id, cpp]),
    );
    const passesMap = new Map(
      passesQuery.data?.results.map((pass) => [pass.id, pass]),
    );

    return bookings.map<RefinedBooking>((booking) => {
      const cppData = booking.consumer_payment_pack
        ? consumerPaymentPacksMap.get(booking.consumer_payment_pack)
        : undefined;
      return {
        ...booking,
        memberData: booking.member ? membersMap.get(booking.member) : undefined,
        consumerPaymentPackData: cppData,
        passData: cppData ? passesMap.get(cppData.payment_pack) : undefined,
      };
    });
  }, [
    bookings,
    membersQuery.data?.results,
    consumerPaymentPacksQuery.data?.results,
    passesQuery.data?.results,
  ]);

  return {
    ...bookingsQuery.data,
    results: refinedBookings,
    isLoading,
    error,
  };
};
