import { useSuspenseQuery } from "@tanstack/react-query";

import { groupSessionRelatedBookingsQueryOptions } from "@bsport/api-book";

import { fetch } from "#src/utils/fetch";

export const useFetchGroupSessionRelatedBookings = (bookingId: number) =>
  useSuspenseQuery(groupSessionRelatedBookingsQueryOptions(fetch, bookingId));
