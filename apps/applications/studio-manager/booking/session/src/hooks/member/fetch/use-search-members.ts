import { keepPreviousData, useQuery } from "@tanstack/react-query";

import {
  type SearchMembersParams,
  searchMembersQueryOptions,
} from "@bsport/api-cdp";

import { fetch } from "#src/utils/fetch";

const MEMBERS_SEARCH_COUNT = 20;
const SEARCH_MEMBER_STALE_TIME = 2 * 60 * 1000; // 2 minutes

export const useSearchMembers = (params: SearchMembersParams) =>
  useQuery({
    ...searchMembersQueryOptions(fetch, {
      ...params,
      count: MEMBERS_SEARCH_COUNT,
    }),
    enabled: params.text.trim().length > 0,
    placeholderData: keepPreviousData,
    staleTime: SEARCH_MEMBER_STALE_TIME,
  });
