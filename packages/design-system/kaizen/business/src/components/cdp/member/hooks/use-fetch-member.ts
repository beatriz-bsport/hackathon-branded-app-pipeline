import { queryOptions, useQuery } from "@tanstack/react-query";

import { type MemberDetail, fetchMemberAPI } from "@bsport/api-cdp/member";
import type { Fetch } from "@bsport/store-base";

const MEMBER_STALE_TIME = 2 * 60 * 1000; // 2 minutes

const getMemberQueryOptions = (
  fetch: Fetch<MemberDetail>,
  memberId?: number,
) => {
  const getMember = fetchMemberAPI.bind(null, fetch);
  return queryOptions({
    queryKey: ["members", "detail", memberId ?? null],
    queryFn: () => getMember({ memberId: memberId! }),
    staleTime: MEMBER_STALE_TIME,
    enabled: memberId !== undefined,
  });
};

export const useFetchMember = (
  fetch: Fetch<MemberDetail>,
  memberId?: number,
) => {
  return useQuery({
    ...getMemberQueryOptions(fetch, memberId),
  });
};
