import { useSuspenseQuery } from "@tanstack/react-query";

import {
  type PaginatedConsumerPaymentPackFilterParams,
  maxoutBookingQueryOptions,
} from "@bsport/api-buyables";

import { fetch } from "#src/utils/fetch";

export const useFetchMaxoutBooking = (
  params: PaginatedConsumerPaymentPackFilterParams,
) => useSuspenseQuery(maxoutBookingQueryOptions(fetch, params));
