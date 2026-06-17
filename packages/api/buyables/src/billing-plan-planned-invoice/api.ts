import { mutationOptions, queryOptions } from "@tanstack/react-query";

import {
  type ApiConfig,
  Fetch,
  type PaginatedResponse,
  buildUrlParams,
} from "@bsport/store-base";

import { API_V0_URL_SUBSCRIPTION, QUERY_KEY_MAIN } from "#src/constants";

import type {
  FetchPlannedInvoicesParams,
  PlannedInvoice,
  UpdateInvoicePriceParams,
} from "./types";

// ----------------------------------------------------------------------------

export const API_V0_URL_PLANNED_INVOICE = `${API_V0_URL_SUBSCRIPTION}/planned-invoice`;

export const queryKeys = {
  all: [QUERY_KEY_MAIN, "billing-plan-planned-invoice"] as const,

  lists: () => [...queryKeys.all, "list"] as const,
  listByPlan: (planId: number) => [...queryKeys.lists(), planId] as const,
  list: (params: FetchPlannedInvoicesParams) =>
    [...queryKeys.listByPlan(params.billing_plan), params] as const,
} as const;

// ----------------------------------------------------------------------------

const fetchPlannedInvoicesAPIConfig = (
  params: FetchPlannedInvoicesParams,
): ApiConfig => {
  return [`${API_V0_URL_PLANNED_INVOICE}/${buildUrlParams(params)}`];
};

const fetchPlannedInvoicesAPI = async (
  fetch: Fetch<PaginatedResponse<PlannedInvoice>>,
  params: FetchPlannedInvoicesParams,
): Promise<PaginatedResponse<PlannedInvoice>> => {
  const [uri, init] = fetchPlannedInvoicesAPIConfig(params);

  const { data } = await fetch(uri, init);

  return data;
};

export const fetchPlannedInvoicesQueryOptions = (
  fetch: Fetch<PaginatedResponse<PlannedInvoice>>,
  params: FetchPlannedInvoicesParams,
) =>
  queryOptions({
    queryKey: queryKeys.list(params),
    queryFn: () => fetchPlannedInvoicesAPI(fetch, params),
  });

// ----------------------------------------------------------------------------

// TODO: wire POST /subscription/billing-plan/:id/update_price/ when available.
export const updateInvoicePriceMutationOptions = (
  _fetch: Fetch<UpdateInvoicePriceParams>,
) =>
  mutationOptions({
    mutationFn: async (
      _params: UpdateInvoicePriceParams,
    ): Promise<UpdateInvoicePriceParams> => {
      throw new Error("Invoice price update is not available yet.");
    },
  });
