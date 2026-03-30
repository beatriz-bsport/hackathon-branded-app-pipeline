import { useSuspenseQuery } from "@tanstack/react-query";

import {
  type RecurrenceRuleBookingFilterParams,
  recurrenceRuleBookingsQueryOptions,
} from "@bsport/api-book";

import { fetch } from "#src/utils/fetch";

export const useFetchRecurrenceRuleBookings = (
  params?: RecurrenceRuleBookingFilterParams,
) => useSuspenseQuery(recurrenceRuleBookingsQueryOptions(fetch, params));
