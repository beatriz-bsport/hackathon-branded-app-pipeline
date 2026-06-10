import { useQuery } from "@tanstack/react-query";

import { fetchBillingPlanQueryOptions } from "@bsport/api-buyables/billing-plan";

import { fetch } from "#src/utils/fetch";

export const useFetchMembershipPlan = (membershipPlanId: number) =>
  useQuery({
    ...fetchBillingPlanQueryOptions(fetch, { id: membershipPlanId }),
    throwOnError: true,
  });
