import { useSuspenseQuery } from "@tanstack/react-query";

import {
  type PaginatedConsumerPaymentPackFilterParams,
  consumerPaymentPackListQueryOptions,
} from "@bsport/api-buyables";

import { fetch } from "#src/utils/fetch";

export const useFetchConsumerPaymentPackList = (
  params: PaginatedConsumerPaymentPackFilterParams,
) => useSuspenseQuery(consumerPaymentPackListQueryOptions(fetch, params));
