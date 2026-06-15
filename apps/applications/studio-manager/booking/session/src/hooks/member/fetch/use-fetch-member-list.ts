import { useSuspenseQuery } from "@tanstack/react-query";

import {
  MEMBER_STALE_TIME,
  type PaginatedMemberListParams,
  memberListQueryOptions,
} from "@bsport/api-cdp/member";

import { fetch } from "#src/utils/fetch";

export const useFetchMemberList = (params?: PaginatedMemberListParams) =>
  useSuspenseQuery({
    ...memberListQueryOptions(fetch, params),
    staleTime: MEMBER_STALE_TIME,
  });
