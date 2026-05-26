import { queryOptions } from "@tanstack/react-query";

import { type ApiConfig, Fetch, buildUrlParams } from "@bsport/store-base";

import { API_V0_URL_SUBSCRIPTION, QUERY_KEY_MAIN } from "#src/constants";

import type { BillingPlan, FetchBillingPlansParams } from "./types";

// ----------------------------------------------------------------------------

export const API_V0_URL_BILLING_PLAN = `${API_V0_URL_SUBSCRIPTION}/billing-plan`;

export const queryKeys = {
  all: [QUERY_KEY_MAIN, "billing-plan"] as const,

  lists: () => [...queryKeys.all, "list"] as const,

  list: (params: FetchBillingPlansParams) =>
    [...queryKeys.lists(), params] as const,
} as const;

// ----------------------------------------------------------------------------

const fetchBillingPlansAPIConfig = (
  params: FetchBillingPlansParams,
): ApiConfig => {
  return [`${API_V0_URL_BILLING_PLAN}/${buildUrlParams(params)}`];
};

const fetchBillingPlansAPI = async (
  fetch: Fetch<BillingPlan[]>,
  params: FetchBillingPlansParams,
): Promise<BillingPlan[]> => {
  const [uri, init] = fetchBillingPlansAPIConfig(params);

  const { data } = await fetch(uri, init);

  return data;
};

export const fetchBillingPlansQueryOptions = (
  fetch: Fetch<BillingPlan[]>,
  params: FetchBillingPlansParams,
) =>
  queryOptions({
    queryKey: queryKeys.list(params),
    queryFn: () => fetchBillingPlansAPI(fetch, params),
  });

// ----------------------------------------------------------------------------
