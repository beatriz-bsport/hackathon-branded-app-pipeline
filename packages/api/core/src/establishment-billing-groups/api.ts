import { queryOptions } from "@tanstack/react-query";

import {
  type Fetch,
  PaginatedResponse,
  buildUrlParams,
} from "@bsport/store-base";

import { API_V1_URL, QUERY_KEY_MAIN } from "../constants";
import type {
  EstablishmentBillingGroup,
  FetchEstablishmentBillingGroupsParams,
} from "./types";

const ESTABLISHMENT_BILLING_GROUP_API_URL = `${API_V1_URL}/establishment-billing-group`;

export const establishmentBillingGroupKeys = {
  all: [QUERY_KEY_MAIN, "establishment-billing-group"] as const,
  lists: () => [...establishmentBillingGroupKeys.all, "list"] as const,
  list: (params: FetchEstablishmentBillingGroupsParams) =>
    [...establishmentBillingGroupKeys.lists(), buildUrlParams(params)] as const,
};

export const fetchEstablishmentBillingGroups = async (
  fetch: Fetch<PaginatedResponse<EstablishmentBillingGroup>>,
  params: FetchEstablishmentBillingGroupsParams,
): Promise<PaginatedResponse<EstablishmentBillingGroup>> => {
  const { data } = await fetch(
    `${ESTABLISHMENT_BILLING_GROUP_API_URL}/${buildUrlParams(params)}`,
  );
  return data;
};

export const fetchEstablishmentBillingGroupsQueryOptions = (
  fetch: Fetch<PaginatedResponse<EstablishmentBillingGroup>>,
  params: FetchEstablishmentBillingGroupsParams,
) => {
  const queryFn = fetchEstablishmentBillingGroups.bind(null, fetch, params);
  return queryOptions({
    queryKey: establishmentBillingGroupKeys.list(params),
    queryFn,
  });
};
