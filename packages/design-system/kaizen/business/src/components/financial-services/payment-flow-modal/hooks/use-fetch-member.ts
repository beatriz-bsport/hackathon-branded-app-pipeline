import { queryOptions, useQuery } from "@tanstack/react-query";

import { fetchMemberAPI } from "@bsport/api-cdp/member";
import type { Fetch } from "@bsport/fetch";

const MEMBER_STALE_TIME = 2 * 60 * 1000; // 2 minutes

const fetchMemberQueryOptions = (fetch: Fetch, memberId: number) => {
  const fetchMemberById = fetchMemberAPI.bind(null, fetch);

  return queryOptions({
    queryKey: ["payment-flow-modal", "member", memberId],
    queryFn: () => fetchMemberById({ memberId }),
    staleTime: MEMBER_STALE_TIME,
    enabled: memberId > 0,
  });
};

export const useFetchMember = (fetch: Fetch, memberId: number) =>
  useQuery({
    ...fetchMemberQueryOptions(fetch, memberId),
  });
