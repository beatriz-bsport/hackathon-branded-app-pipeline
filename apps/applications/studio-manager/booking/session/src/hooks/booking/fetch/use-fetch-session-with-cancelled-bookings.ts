import { useSuspenseQuery } from "@tanstack/react-query";

import { sessionWithCancelledBookingsQueryOptions } from "@bsport/api-book";

import { fetch } from "#src/utils/fetch";

export const useFetchSessionWithCancelledBookings = (
  recurrenceRuleId: number,
) =>
  useSuspenseQuery(
    sessionWithCancelledBookingsQueryOptions(fetch, recurrenceRuleId),
  );
