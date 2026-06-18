import { type Fetch } from "@bsport/store-base";

import { QUERY_KEY_EVENT, fetchEventsAPI } from "#src/event/api";

import type {
  BillingPlanEvent,
  FetchMembershipPlanEventsParams,
} from "./types";

// ----------------------------------------------------------------------------

export const membershipPlanEventKeys = {
  all: [...QUERY_KEY_EVENT, "membership-plan"] as const,

  lists: () => [...membershipPlanEventKeys.all, "list"] as const,
  listByPlan: (billingPlanId: number) =>
    [...membershipPlanEventKeys.lists(), billingPlanId] as const,
  list: ({ billing_plan, ...params }: FetchMembershipPlanEventsParams) =>
    [...membershipPlanEventKeys.listByPlan(billing_plan), params] as const,
} as const;

// ----------------------------------------------------------------------------

const buildFetchParams = ({
  event_types: eventTypes,
  ...params
}: FetchMembershipPlanEventsParams) => ({
  ...params,
  ...(eventTypes?.length ? { event_types: eventTypes } : {}),
});

export const fetchMembershipPlanEventsAPI = (
  fetch: Fetch<BillingPlanEvent[]>,
  params: FetchMembershipPlanEventsParams,
): Promise<BillingPlanEvent[]> =>
  fetchEventsAPI(fetch, buildFetchParams(params));
