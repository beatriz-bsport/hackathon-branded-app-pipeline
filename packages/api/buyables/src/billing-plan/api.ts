import { queryOptions } from "@tanstack/react-query";

import {
  type ApiConfig,
  Fetch,
  type PaginatedResponse,
  buildUrlParams,
} from "@bsport/store-base";

import { API_V0_URL_SUBSCRIPTION, QUERY_KEY_MAIN } from "#src/constants";

import type {
  BillingPlan,
  FetchBillingPlanParams,
  FetchBillingPlansParams,
  FetchPaginatedMembershipPlansParams,
} from "./types";

// ----------------------------------------------------------------------------

export const API_V0_URL_BILLING_PLAN = `${API_V0_URL_SUBSCRIPTION}/billing-plan`;

export const queryKeys = {
  all: [QUERY_KEY_MAIN, "billing-plan"] as const,

  details: () => [...queryKeys.all, "detail"] as const,
  detail: (id: number) => [...queryKeys.details(), id] as const,

  lists: () => [...queryKeys.all, "list"] as const,
  list: (params: FetchBillingPlansParams) =>
    [...queryKeys.lists(), params] as const,

  paginatedLists: () => [...queryKeys.lists(), "paginated"] as const,
  paginatedList: (params: FetchPaginatedMembershipPlansParams) =>
    [...queryKeys.paginatedLists(), params] as const,
} as const;

// ----------------------------------------------------------------------------

const fetchBillingPlansAPIConfig = (
  params: FetchBillingPlansParams | FetchPaginatedMembershipPlansParams,
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

const fetchPaginatedBillingPlansAPI = async (
  fetch: Fetch<PaginatedResponse<BillingPlan>>,
  params: FetchPaginatedMembershipPlansParams,
): Promise<PaginatedResponse<BillingPlan>> => {
  const [uri, init] = fetchBillingPlansAPIConfig(params);

  const { data } = await fetch(uri, init);

  return data;
};

export const fetchPaginatedBillingPlansQueryOptions = (
  fetch: Fetch<PaginatedResponse<BillingPlan>>,
  params: FetchPaginatedMembershipPlansParams,
) =>
  queryOptions({
    queryKey: queryKeys.paginatedList(params),
    queryFn: () => fetchPaginatedBillingPlansAPI(fetch, params),
  });

// ----------------------------------------------------------------------------

const fetchBillingPlanAPI = async (
  fetch: Fetch<BillingPlan>,
  params: FetchBillingPlanParams,
): Promise<BillingPlan> => {
  const { data } = await fetch(`${API_V0_URL_BILLING_PLAN}/${params.id}/`);

  return data;
};

export const fetchBillingPlanQueryOptions = (
  fetch: Fetch<BillingPlan>,
  params: FetchBillingPlanParams,
) =>
  queryOptions({
    queryKey: queryKeys.detail(params.id),
    queryFn: () => fetchBillingPlanAPI(fetch, params),
  });

// ----------------------------------------------------------------------------
