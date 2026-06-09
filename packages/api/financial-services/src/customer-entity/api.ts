import { queryOptions } from "@tanstack/react-query";

import { type Fetch } from "@bsport/store-base";

import { API_URL_PLATFORM_BILLING, QUERY_KEY_MAIN } from "#src/constants";

import type { CustomerEntity } from "./types";

export const customerEntityKeys = {
  all: [QUERY_KEY_MAIN, "customer-entity"] as const,
  me: () => [...customerEntityKeys.all, "me"] as const,
} as const;

export const fetchCustomerEntityAPI = async (
  fetch: Fetch<CustomerEntity>,
): Promise<CustomerEntity> => {
  const { data } = await fetch(
    `${API_URL_PLATFORM_BILLING}/platform_customer_entity/me/`,
  );

  return data;
};

export const fetchCustomerEntityQueryOptions = (fetch: Fetch<CustomerEntity>) =>
  queryOptions({
    queryKey: customerEntityKeys.me(),
    queryFn: () => fetchCustomerEntityAPI(fetch),
  });
