import { queryOptions } from "@tanstack/react-query";

import { Fetch, PaginatedResponse } from "@bsport/store-base";

import {
  MEMBER_STALE_TIME,
  fetchMemberAPI,
  fetchMemberListAPI,
  getLatestMemberAPI,
  memberKeys,
  searchMembersAPI,
} from "./api";
import {
  GetMemberParams,
  Member,
  MemberDetail,
  PaginatedMemberListParams,
  SearchMembersParams,
} from "./types";

export const memberQueryOptions = (
  fetch: Fetch<MemberDetail>,
  params: GetMemberParams,
) =>
  queryOptions({
    queryKey: memberKeys.detail(params.memberId),
    queryFn: () => fetchMemberAPI(fetch, params),
  });

export const searchMembersQueryOptions = (
  fetch: Fetch<Member[]>,
  params: SearchMembersParams,
) =>
  queryOptions({
    queryKey: memberKeys.search(params),
    queryFn: () => searchMembersAPI(fetch, params),
  });
export const memberListQueryOptions = (
  fetch: Fetch<PaginatedResponse<Member>>,
  params: PaginatedMemberListParams = {},
) => {
  return queryOptions({
    queryKey: memberKeys.list(params),
    queryFn: () => fetchMemberListAPI(fetch, params),
    staleTime: MEMBER_STALE_TIME,
  });
};
export const getLatestMemberQueryOptions = (fetch: Fetch<number>) =>
  queryOptions({
    queryKey: memberKeys.latest(),
    queryFn: () => getLatestMemberAPI(fetch),
  });
