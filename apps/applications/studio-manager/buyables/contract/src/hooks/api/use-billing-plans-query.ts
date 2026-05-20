import { useQuery, useSuspenseQuery } from "@tanstack/react-query";

import {
  type FetchBillingPlansParams,
  fetchBillingPlansQueryOptions,
} from "@bsport/api-buyables/billing-plan";

import { fetch } from "#src/utils/fetch";

export const useBillingPlansSuspenseQuery = (params: FetchBillingPlansParams) =>
  useSuspenseQuery(fetchBillingPlansQueryOptions(fetch, params));

export const useBillingPlansQuery = (params: FetchBillingPlansParams) =>
  useQuery({
    ...fetchBillingPlansQueryOptions(fetch, params),
    enabled: !!params.id__in?.length,
  });
