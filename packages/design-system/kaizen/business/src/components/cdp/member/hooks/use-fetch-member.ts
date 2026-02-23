import { queryOptions, useQuery } from "@tanstack/react-query";

import { type Member, fetchMember } from "@bsport/api-cdp";
import type { Fetch } from "@bsport/store-base";

const MEMBER_STALE_TIME = 2 * 60 * 1000; // 2 minutes

const getMemberQueryOptions = (fetch: Fetch<Member>, memberId?: number) => {
  const getMember = fetchMember.bind(null, fetch);
  return queryOptions({
    queryKey: ["members", "detail", memberId ?? null],
    queryFn: () => getMember({ memberId: memberId! }),
    staleTime: MEMBER_STALE_TIME,
    enabled: memberId !== undefined,
  });
};

export const useFetchMember = (fetch: Fetch<Member>, memberId?: number) => {
  return useQuery({
    ...getMemberQueryOptions(fetch, memberId),
  });
};
