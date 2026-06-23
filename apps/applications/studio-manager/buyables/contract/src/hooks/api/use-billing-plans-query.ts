import { useQuery, useSuspenseQuery } from "@tanstack/react-query";

import {
  type FetchBillingPlansParams,
  type FetchPaginatedMembershipPlansParams,
  fetchBillingPlansQueryOptions,
  fetchPaginatedBillingPlansQueryOptions,
} from "@bsport/api-buyables/billing-plan";

import { fetch } from "#src/utils/fetch";

export const useBillingPlansPaginatedSuspenseQuery = (
  params: FetchPaginatedMembershipPlansParams,
) =>
  useSuspenseQuery({
    ...fetchPaginatedBillingPlansQueryOptions(fetch, params),
    staleTime: 5 * 60_000,
  });

export const useMembershipPlansSuspenseQuery = (
  params: FetchBillingPlansParams,
) =>
  useSuspenseQuery({
    ...fetchBillingPlansQueryOptions(fetch, params),
    staleTime: 5 * 60_000,
  });

export const useBillingPlansQuery = (params: FetchBillingPlansParams) =>
  useQuery({
    ...fetchBillingPlansQueryOptions(fetch, params),
    enabled: !!params.id__in?.length,
  });
