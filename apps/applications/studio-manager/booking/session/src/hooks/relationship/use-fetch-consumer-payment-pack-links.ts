import { useSuspenseQuery } from "@tanstack/react-query";

import {
  type FetchConsumerPaymentPackLinksParams,
  consumerPaymentPackLinksQueryOptions,
} from "@bsport/api-core";

import { fetch } from "#src/utils/fetch";

export const useFetchConsumerPaymentPackLinks = (
  params: FetchConsumerPaymentPackLinksParams,
) => useSuspenseQuery(consumerPaymentPackLinksQueryOptions(fetch, params));
