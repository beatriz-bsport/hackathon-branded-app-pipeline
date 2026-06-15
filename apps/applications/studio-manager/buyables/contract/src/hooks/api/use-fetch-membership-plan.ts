import { useSuspenseQuery } from "@tanstack/react-query";

import { fetchBillingPlanQueryOptions } from "@bsport/api-buyables/billing-plan";

import { fetch } from "#src/utils/fetch";

export const useFetchMembershipPlan = (membershipPlanId: number) =>
  useSuspenseQuery(
    fetchBillingPlanQueryOptions(fetch, { id: membershipPlanId }),
  );
