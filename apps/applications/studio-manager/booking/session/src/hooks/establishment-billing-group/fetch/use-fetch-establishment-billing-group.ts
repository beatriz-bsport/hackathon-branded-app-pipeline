import { useQuery } from "@tanstack/react-query";

import {
  EstablishmentBillingGroup,
  FetchEstablishmentBillingGroupsParams,
  fetchEstablishmentBillingGroupsQueryOptions,
} from "@bsport/api-core/establishment-billing-groups";
import { PaginatedResponse } from "@bsport/store-base";

import { fetch } from "#src/utils/fetch";

type SelectEstablishmentBillingGroup = (
  data: PaginatedResponse<EstablishmentBillingGroup>,
) => EstablishmentBillingGroup[];

const BILLING_GROUPS_STALE_TIME = 5 * 60 * 1000;

export const useFetchEstablishmentBillingGroups = (
  params: FetchEstablishmentBillingGroupsParams,
  select?: SelectEstablishmentBillingGroup,
) => {
  return useQuery({
    ...fetchEstablishmentBillingGroupsQueryOptions(fetch, params),
    select,
    staleTime: BILLING_GROUPS_STALE_TIME,
    enabled: !!params.company,
  });
};
