import { queryOptions } from "@tanstack/react-query";

import {
  type Fetch,
  type PaginatedResponse,
  buildUrlParams,
} from "@bsport/store-base";

import { BOOKING_QUERY_KEY, DEFAULT_STALE_TIME } from "#src/constants";

import type {
  CreateGroupSessionsPayload,
  DeleteGroupSessionPayload,
  GroupSession,
  PaginatedGroupSessionParams,
  PrepareGroupSessionsCreationPayload,
  PrepareGroupSessionsCreationResponse,
  UpdateGroupSessionPayload,
} from "./types";

const API_URL = "book/v1";
const API_URL_GROUP_SESSION = `${API_URL}/offer_group`;

export const groupSessionKeys = {
  all: [BOOKING_QUERY_KEY, "groupSessions"] as const,
  lists: () => [...groupSessionKeys.all, "list"] as const,
  list: (params?: PaginatedGroupSessionParams) =>
    [...groupSessionKeys.lists(), params] as const,
  detail: (id: number) => [...groupSessionKeys.all, id] as const,
};

export const fetchGroupSessionsAPIConfig = (
  params: PaginatedGroupSessionParams,
): string => {
  return `${API_URL_GROUP_SESSION}/${buildUrlParams(params)}`;
};

export const fetchGroupSessionsAPI = async (
  fetch: Fetch<PaginatedResponse<GroupSession>>,
  params: PaginatedGroupSessionParams = {},
): Promise<PaginatedResponse<GroupSession>> => {
  const { data: fetchedData } = await fetch(
    `${API_URL_GROUP_SESSION}/${buildUrlParams(params)}`,
  );

  return fetchedData;
};

export const fetchGroupSessionsQueryOptions = (
  fetch: Fetch<PaginatedResponse<GroupSession>>,
  params: PaginatedGroupSessionParams = {},
) => {
  const queryFn = fetchGroupSessionsAPI.bind(null, fetch, params);
  return queryOptions({
    queryKey: groupSessionKeys.list(params),
    queryFn,
    staleTime: DEFAULT_STALE_TIME,
  });
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

export const retrieveGroupSessionQueryOptions = (
  fetch: Fetch<GroupSession>,
  groupSessionId: number,
) => {
  const queryFn = retrieveGroupSession.bind(null, fetch, groupSessionId);
  return queryOptions({
    queryKey: groupSessionKeys.detail(groupSessionId),
    queryFn,
    staleTime: DEFAULT_STALE_TIME,
  });
};

export const retrieveGroupSessionQueryOption = retrieveGroupSessionQueryOptions;

export const updateGroupSessionAPI = async (
  fetch: Fetch<GroupSession>,
  groupSessionId: number,
  payload: UpdateGroupSessionPayload,
): Promise<string | null> => {
  const { backgroundTaskUuid } = await fetch(
    `${API_URL_GROUP_SESSION}/${groupSessionId}/update_group/`,
    {
      method: "POST",
      body: JSON.stringify(payload),
    },
  );

  return backgroundTaskUuid;
};

export const prepareGroupSessionsCreationAPI = async (
  fetch: Fetch<PrepareGroupSessionsCreationResponse>,
  payload: PrepareGroupSessionsCreationPayload,
): Promise<PrepareGroupSessionsCreationResponse> => {
  // Backend calls this preparation endpoint "generate_preview", but the
  // product flow creates immediately without a user-facing preview step.
  const { data } = await fetch(`${API_URL_GROUP_SESSION}/generate_preview/`, {
    method: "POST",
    body: JSON.stringify(payload),
  });

  return data;
};

export const createGroupSessionsWithOffersAPI = async (
  fetch: Fetch<void>,
  payload: CreateGroupSessionsPayload,
): Promise<string | null> => {
  const { backgroundTaskUuid } = await fetch(
    `${API_URL_GROUP_SESSION}/create_groups_with_offers/`,
    {
      method: "POST",
      body: JSON.stringify(payload),
    },
  );

  return backgroundTaskUuid;
};

export const deleteGroupSessionAPI = async (
  fetch: Fetch<void>,
  groupSessionId: number,
  payload: DeleteGroupSessionPayload,
): Promise<string | null> => {
  const { backgroundTaskUuid } = await fetch(
    `${API_URL_GROUP_SESSION}/${groupSessionId}/`,
    {
      method: "DELETE",
      body: JSON.stringify(payload),
    },
  );

  return backgroundTaskUuid;
};
