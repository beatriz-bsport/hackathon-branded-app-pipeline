import { queryOptions } from "@tanstack/react-query";

import { type Fetch, buildUrlParams } from "@bsport/store-base";

import { API_V1_URL } from "#src/constants";

import type {
  ConsumerPaymentPackLink,
  FetchConsumerPaymentPackLinksParams,
} from "./types";

export const relationshipKeys = {
  all: ["@api-core", "relationship"] as const,
  consumerPaymentPackLinks: (params: FetchConsumerPaymentPackLinksParams) =>
    [...relationshipKeys.all, "consumer-payment-pack-links", params] as const,
} as const;

export const fetchConsumerPaymentPackLinksAPI = async (
  fetch: Fetch<ConsumerPaymentPackLink[]>,
  params: FetchConsumerPaymentPackLinksParams = {},
): Promise<ConsumerPaymentPackLink[]> => {
  const { data } = await fetch(
    `${API_V1_URL}/relationship/consumer_payment_pack/${buildUrlParams(params)}`,
  );
  return data;
};

export const consumerPaymentPackLinksQueryOptions = (
  fetch: Fetch<ConsumerPaymentPackLink[]>,
  params: FetchConsumerPaymentPackLinksParams = {},
) =>
  queryOptions({
    queryKey: relationshipKeys.consumerPaymentPackLinks(params),
    queryFn: () => fetchConsumerPaymentPackLinksAPI(fetch, params),
  });
