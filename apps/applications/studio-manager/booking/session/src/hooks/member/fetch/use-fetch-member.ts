import { keepPreviousData, useQuery } from "@tanstack/react-query";

import {
  type GetMemberParams,
  memberQueryOptions,
} from "@bsport/api-cdp/member";

import { fetch } from "#src/utils/fetch";

const MEMBER_STALE_TIME = 5 * 60 * 1000; // 5 minutes

export const useFetchMember = (params: GetMemberParams) =>
  useQuery({
    ...memberQueryOptions(fetch, params),
    staleTime: MEMBER_STALE_TIME,
    enabled: !!params.memberId,
    placeholderData: keepPreviousData,
  });
