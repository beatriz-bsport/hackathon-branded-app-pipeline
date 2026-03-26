import { useSuspenseQuery } from "@tanstack/react-query";

import {
  type PaginatedBookingFilterParams,
  bookingsQueryOptions,
} from "@bsport/api-book";

import { fetch } from "#src/utils/fetch";

export const useFetchBookings = (params: PaginatedBookingFilterParams) =>
  useSuspenseQuery(bookingsQueryOptions(fetch, params));
