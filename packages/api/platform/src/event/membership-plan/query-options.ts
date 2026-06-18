import { queryOptions } from "@tanstack/react-query";

import { type Fetch } from "@bsport/store-base";

import { fetchMembershipPlanEventsAPI, membershipPlanEventKeys } from "./api";
import type {
  BillingPlanEvent,
  FetchMembershipPlanEventsParams,
} from "./types";

// ----------------------------------------------------------------------------

export const membershipPlanEventsQueryOptions = (
  fetch: Fetch<BillingPlanEvent[]>,
  params: FetchMembershipPlanEventsParams,
) =>
  queryOptions({
    // eslint-disable-next-line @tanstack/query/exhaustive-deps -- fetch is an injected stable dependency
    queryKey: membershipPlanEventKeys.list(params),
    queryFn: () => fetchMembershipPlanEventsAPI(fetch, params),
  });
