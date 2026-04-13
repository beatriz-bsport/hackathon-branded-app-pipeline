import { queryOptions } from "@tanstack/react-query";

import {
  type Fetch,
  type PaginatedResponse,
  buildUrlParams,
} from "@bsport/store-base";

import type {
  GetMemberParams,
  Member,
  MemberPayload,
  PaginatedMemberListParams,
  SearchMembersParams,
} from "#src/member/types";

const API_URL = "customer-data-platform/v1/member";

export const MEMBER_STALE_TIME = 2 * 60 * 1000; // 2 minutes

export const memberKeys = {
  all: ["@api-cdp", "member"] as const,

  listScope: () => [...memberKeys.all, "list"] as const,

  list: (params: PaginatedMemberListParams = {}) =>
    [...memberKeys.listScope(), params] as const,

  detail: (id: number) => [...memberKeys.all, "detail", id] as const,

  latest: () => [...memberKeys.all, "latest"] as const,

  search: (params: SearchMembersParams) =>
    [...memberKeys.all, "search", params] as const,
} as const;

export const fetchMember = async (
  fetch: Fetch<Member>,
  params: GetMemberParams,
): Promise<Member> => {
  const { data } = await fetch(`${API_URL}/${params.memberId}/`);
  return data;
};

export const memberQueryOptions = (
  fetch: Fetch<Member>,
  params: GetMemberParams,
) =>
  queryOptions({
    queryKey: memberKeys.detail(params.memberId),
    queryFn: () => fetchMember(fetch, params),
  });

export const searchMembersAPI = async (
  fetch: Fetch<Member[]>,
  params: SearchMembersParams,
): Promise<Member[]> => {
  const { data } = await fetch(`${API_URL}/search/`, {
    method: "POST",
    body: JSON.stringify(params),
  });
  return data;
};

export const searchMembersQueryOptions = (
  fetch: Fetch<Member[]>,
  params: SearchMembersParams,
) =>
  queryOptions({
    queryKey: memberKeys.search(params),
    queryFn: () => searchMembersAPI(fetch, params),
  });

export const fetchMemberListAPI = async (
  fetch: Fetch<PaginatedResponse<Member>>,
  params: PaginatedMemberListParams = {},
): Promise<PaginatedResponse<Member>> => {
  const { data } = await fetch(
    `${API_URL}/${buildUrlParams(params, { withDefaultPagination: true })}`,
  );
  return data;
};

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

export const getLatestMemberAPI = async (
  fetch: Fetch<number>,
): Promise<number> => {
  const { data } = await fetch(`${API_URL}/latest/`);
  return data;
};

export const getLatestMemberQueryOptions = (fetch: Fetch<number>) =>
  queryOptions({
    queryKey: memberKeys.latest(),
    queryFn: () => getLatestMemberAPI(fetch),
  });

export const addMemberAPI = async (
  fetch: Fetch<Member>,
  payload: MemberPayload,
): Promise<Member> => {
  const { data } = await fetch(`${API_URL}/`, {
    method: "POST",
    body: JSON.stringify(payload),
  });
  return data;
};

export const updateMemberAPI = async (
  fetch: Fetch<Member>,
  id: number,
  payload: MemberPayload,
): Promise<Member> => {
  const { data } = await fetch(`${API_URL}/${id}/`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });
  return data;
};
