import { queryOptions } from "@tanstack/react-query";

import { Fetch, PaginatedResponse, buildUrlParams } from "@bsport/store-base";

import { BOOKING_QUERY_KEY, DEFAULT_STALE_TIME } from "#src/constants";

import type { GroupSession, PaginatedGroupSessionParams } from "./types";

const API_URL = "book/v1";
const API_URL_GROUP_SESSION = `${API_URL}/offer_group`;

export const groupSessionKeys = {
  all: [BOOKING_QUERY_KEY, "groupSessions"] as const,
  list: () => [...groupSessionKeys.all, "list"] as const,
  detail: (id: number) => [...groupSessionKeys.all, id] as const,
};

export const fetchGroupSessionsAPIConfig = (
  params: PaginatedGroupSessionParams,
): string => {
  return `${API_URL_GROUP_SESSION}/${buildUrlParams(params)}`;
};

export const fetchGroupSessionsAPI = async (
  fetch: Fetch<PaginatedResponse<GroupSession>>,
  params: PaginatedGroupSessionParams,
): Promise<PaginatedResponse<GroupSession>> => {
  const uri = fetchGroupSessionsAPIConfig(params);
  const { data: fetchedData } = await fetch(uri);

  return fetchedData;
};

export const retrieveGroupSession = async (
  fetch: Fetch<GroupSession>,
  groupSessionId: number,
): Promise<GroupSession> => {
  const { data: groupSession } = await fetch(
    `${API_URL_GROUP_SESSION}/${groupSessionId}/`,
  );
  return groupSession;
};

export const retrieveGroupSessionQueryOption = (
  fetch: Fetch<GroupSession>,
  groupSessionId: number,
) =>
  queryOptions({
    queryKey: groupSessionKeys.detail(groupSessionId),
    queryFn: () => retrieveGroupSession(fetch, groupSessionId),
    staleTime: DEFAULT_STALE_TIME,
  });
