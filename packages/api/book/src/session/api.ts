import { queryOptions } from "@tanstack/react-query";

import {
  ApiConfig,
  Fetch,
  PaginatedResponse,
  buildUrlParams,
} from "@bsport/store-base";

import type {
  CancelMultipleSessionsParams,
  CancelSessionParams,
  CheckTagEligibilityParams,
  DeleteSessionParams,
  FetchSessionsParams,
  ListSessionsWithPendingReplacementRequestIdsParams,
  ManagerSession,
  MinimalSession,
  PaginatedFetchSessionsParams,
  RecurrenceResponse,
  RetrieveSessionParams,
  Session,
  SessionCreationPayload,
  SessionEditPayload,
  SessionStatus,
  SessionStatusParams,
  ToggleWaitingListFreezeParams,
  UpdateInternalNoteParams,
} from "#src/session/types";

const API_URL = "book/v1";
const API_URL_SESSION = `${API_URL}/offer`;

export const sessionKeys = {
  all: ["@api-book", "session"] as const,
  detail: (sessionId: number) => [...sessionKeys.all, sessionId] as const,
  status: (sessionId: number, params?: SessionStatusParams) =>
    [...sessionKeys.detail(sessionId), "status", params] as const,
  statusList: (ids: number[], params?: PaginatedFetchSessionsParams) =>
    [...sessionKeys.all, "status-list", ids, params] as const,
} as const;

export const fetchSessionsAPIConfig = (
  params: FetchSessionsParams | PaginatedFetchSessionsParams,
): string => {
  return `${API_URL_SESSION}/${buildUrlParams(params)}`;
};

export const fetchSessionsAPI = async (
  fetch: Fetch<PaginatedResponse<Session>>,
  params: FetchSessionsParams,
): Promise<PaginatedResponse<Session>> => {
  const uri = fetchSessionsAPIConfig(params);
  const { data: fetchedData } = await fetch(uri);

  return fetchedData;
};

export const fetchMinimalSessionsAPIConfig = (
  params: FetchSessionsParams,
): string => {
  return `${API_URL_SESSION}/minimal/${buildUrlParams(params)}`;
};

export const fetchMinimalSessionsAPI = async (
  fetch: Fetch<MinimalSession[]>,
  params: FetchSessionsParams,
): Promise<MinimalSession[]> => {
  const uri = fetchMinimalSessionsAPIConfig(params);
  const { data: fetchedData } = await fetch(uri);

  return fetchedData;
};

export const fetchManagerSessionsURL = (
  params: FetchSessionsParams,
): string => {
  return `${API_URL_SESSION}/as_manager/${buildUrlParams(params)}`;
};

export const fetchManagerSessions = async (
  fetch: Fetch<ManagerSession[]>,
  params: FetchSessionsParams,
): Promise<ManagerSession[]> => {
  const uri = fetchManagerSessionsURL(params);
  const { data: fetchedData } = await fetch(uri);

  return fetchedData;
};

export const fetchSimilarSessionsAPIConfig = (
  sessionId: number,
  params: PaginatedFetchSessionsParams | FetchSessionsParams,
): string => {
  return `${API_URL_SESSION}/${sessionId}/similars/${buildUrlParams(params)}`;
};

export const fetchSimilarSessionsAPI = async (
  fetch: Fetch<Session[]>,
  sessionId: number,
  params: FetchSessionsParams,
): Promise<Session[]> => {
  const uri = fetchSimilarSessionsAPIConfig(sessionId, params);
  const { data: fetchedData } = await fetch(uri);

  return fetchedData;
};

export const fetchPaginatedSimilarSessionsAPI = async (
  fetch: Fetch<PaginatedResponse<Session[]>>,
  sessionId: number,
  params: PaginatedFetchSessionsParams,
): Promise<PaginatedResponse<Session[]>> => {
  const uri = fetchSimilarSessionsAPIConfig(sessionId, params);
  const { data: fetchedData } = await fetch(uri);

  return fetchedData;
};

export const listSessionsWithPendingReplacementRequestIdsAPIConfig = (
  params: ListSessionsWithPendingReplacementRequestIdsParams,
): ApiConfig => {
  return [
    `${API_URL_SESSION}/with_pending_replacement_request/`,
    {
      method: "POST",
      body: JSON.stringify(params),
    },
  ];
};

export const listSessionsWithPendingReplacementRequestIdsAPI = async (
  fetch: Fetch<number[]>,
  params: ListSessionsWithPendingReplacementRequestIdsParams,
) => {
  const [uri, init] =
    listSessionsWithPendingReplacementRequestIdsAPIConfig(params);
  const { data } = await fetch(uri, init);
  return data;
};

export const cancelSessionAPIConfig = (
  id: number,
  params: CancelSessionParams,
): ApiConfig => {
  return [
    `${API_URL_SESSION}/manager/${id}/cancel/`,
    {
      method: "PATCH",
      body: JSON.stringify(params),
    },
  ];
};

export const cancelSessionAPI = async (
  fetch: Fetch<void>,
  id: number,
  params: CancelSessionParams,
): Promise<string | null> => {
  const [uri, init] = cancelSessionAPIConfig(id, params);
  const { backgroundTaskUuid } = await fetch(uri, init);
  return backgroundTaskUuid;
};

export const restoreSessionAPIConfig = (id: number): ApiConfig => {
  return [
    `${API_URL_SESSION}/${id}/restore/`,
    {
      method: "PUT",
    },
  ];
};

export const restoreSessionAPI = async (
  fetch: Fetch<Session>,
  id: number,
): Promise<Session> => {
  const [uri, init] = restoreSessionAPIConfig(id);
  const { data } = await fetch(uri, init);
  return data;
};

export const deleteSessionAPIConfig = (
  id: number,
  params: DeleteSessionParams,
): ApiConfig => {
  return [
    `${API_URL_SESSION}/manager/${id}/delete/`,
    {
      method: "DELETE",
      body: JSON.stringify(params),
    },
  ];
};

export const deleteSessionAPI = async (
  fetch: Fetch<void>,
  id: number,
  params: DeleteSessionParams,
): Promise<string | null> => {
  const [uri, init] = deleteSessionAPIConfig(id, params);
  const { backgroundTaskUuid } = await fetch(uri, init);
  return backgroundTaskUuid;
};

const fetchNumberOfSessionsToCancelAPIConfig = (
  params: CancelMultipleSessionsParams,
): ApiConfig => {
  return [
    `${API_URL_SESSION}/number_of_mass_disable_offer/${buildUrlParams(params)}`,
  ];
};

export const fetchNumberOfSessionsToCancelAPI = async (
  fetch: Fetch<number>,
  params: CancelMultipleSessionsParams,
): Promise<number> => {
  const [uri] = fetchNumberOfSessionsToCancelAPIConfig(params);
  const { data: numberOfCanceledSessions } = await fetch(uri);
  return numberOfCanceledSessions;
};

export const cancelMultipleSessionsAPIConfig = (
  params: CancelMultipleSessionsParams,
): ApiConfig => {
  const { start, end, ...filters } = params;
  return [
    `${API_URL_SESSION}/mass_disable/${buildUrlParams(filters)}`,
    {
      method: "POST",
      body: JSON.stringify({ start, end }),
    },
  ];
};

export const cancelMultipleSessionsAPI = async (
  fetch: Fetch<void>,
  params: CancelMultipleSessionsParams,
): Promise<string | null> => {
  const [uri, init] = cancelMultipleSessionsAPIConfig(params);
  const { backgroundTaskUuid } = await fetch(uri, init);
  return backgroundTaskUuid;
};

export const createSessionAPIConfig = (
  data: SessionCreationPayload,
): ApiConfig => {
  return [
    `${API_URL_SESSION}/create_similar_offers/`,
    {
      method: "POST",
      body: JSON.stringify(data),
    },
  ];
};

export const createSessionAPI = async (
  fetch: Fetch<Session>,
  data: SessionCreationPayload,
): Promise<string | null> => {
  const [uri, init] = createSessionAPIConfig(data);
  const { backgroundTaskUuid } = await fetch(uri, init);
  return backgroundTaskUuid;
};

export const editSessionAPIConfig = (
  sessionId: number,
  data: SessionEditPayload,
): ApiConfig => {
  return [
    `${API_URL_SESSION}/${sessionId}/`,
    {
      method: "PUT",
      body: JSON.stringify(data),
    },
  ];
};

export const editSessionAPI = async (
  fetch: Fetch<Session>,
  sessionId: number,
  data: SessionEditPayload,
): Promise<string | null> => {
  const [uri, init] = editSessionAPIConfig(sessionId, data);
  const { backgroundTaskUuid } = await fetch(uri, init);
  return backgroundTaskUuid;
};

const fetchRecurrenceFromSessionAPIConfig = (sessionId: number) => {
  return [`${API_URL_SESSION}/${sessionId}/recurrence/`];
};

export const fetchRecurrenceFromSessionAPI = async (
  fetch: Fetch<RecurrenceResponse>,
  sessionId: number,
): Promise<RecurrenceResponse> => {
  const [uri] = fetchRecurrenceFromSessionAPIConfig(sessionId);
  const { data: recurrenceId } = await fetch(uri);
  return recurrenceId;
};

export const retrieveSessionAPIConfig = (
  sessionId: number,
  params: RetrieveSessionParams = {
    with_booking_window: false,
  },
): ApiConfig => {
  return [`${API_URL_SESSION}/${sessionId}/${buildUrlParams(params)}`];
};

export const retrieveSessionAPI = async (
  fetch: Fetch<Session>,
  sessionId: number,
  params?: RetrieveSessionParams,
): Promise<Session> => {
  const [uri, init] = retrieveSessionAPIConfig(sessionId, params);
  const { data: session } = await fetch(uri, init);
  return session;
};

const fetchSessionStatusAPIConfig = (
  sessionId: number,
  params: SessionStatusParams = {},
): ApiConfig => {
  return [
    `${API_URL_SESSION}/${sessionId}/bookable_status/${buildUrlParams(params)}`,
  ];
};

export const fetchSessionStatusAPI = async (
  fetch: Fetch<SessionStatus>,
  sessionId: number,
  params?: SessionStatusParams,
): Promise<SessionStatus> => {
  const [uri, init] = fetchSessionStatusAPIConfig(sessionId, params);
  const { data } = await fetch(uri, init);
  return data;
};

export const sessionStatusQueryOptions = (
  fetch: Fetch<SessionStatus>,
  sessionId: number,
  params?: SessionStatusParams,
) =>
  queryOptions({
    queryKey: sessionKeys.status(sessionId, params),
    queryFn: () => fetchSessionStatusAPI(fetch, sessionId, params),
  });

const fetchSessionStatusListAPIConfig = (
  params: PaginatedFetchSessionsParams,
): ApiConfig => {
  return [`${API_URL_SESSION}/bookable_status_list/${buildUrlParams(params)}`];
};

export const fetchSessionStatusListAPI = async (
  fetch: Fetch<PaginatedResponse<SessionStatus>>,
  params: PaginatedFetchSessionsParams,
): Promise<PaginatedResponse<SessionStatus>> => {
  const [uri, init] = fetchSessionStatusListAPIConfig(params);
  const { data } = await fetch(uri, init);
  return data;
};

export const sessionStatusListQueryOptions = (
  fetch: Fetch<PaginatedResponse<SessionStatus>>,
  params: PaginatedFetchSessionsParams,
) => {
  const { id__in, ...otherParams } = params;
  return queryOptions({
    queryKey: sessionKeys.statusList(id__in ?? [], otherParams),
    queryFn: () => fetchSessionStatusListAPI(fetch, params),
  });
};

export const postRollCallAPIConfig = (sessionId: number): ApiConfig => {
  return [`${API_URL_SESSION}/${sessionId}/rollcall/`, { method: "POST" }];
};

export const postRollCallAPI = async (
  fetch: Fetch<void>,
  sessionId: number,
): Promise<void> => {
  const [uri, init] = postRollCallAPIConfig(sessionId);
  await fetch(uri, init);
};

export const toggleWaitingListFreezeAPIConfig = (
  sessionId: number,
  params: ToggleWaitingListFreezeParams,
): ApiConfig => {
  return [
    `${API_URL_SESSION}/${sessionId}/toogle_waiting_list_freeze/`,
    {
      method: "POST",
      body: JSON.stringify(params),
    },
  ];
};

export const toggleWaitingListFreezeAPI = async (
  fetch: Fetch<Session>,
  sessionId: number,
  params: ToggleWaitingListFreezeParams,
): Promise<Session> => {
  const [uri, init] = toggleWaitingListFreezeAPIConfig(sessionId, params);
  const { data: session } = await fetch(uri, init);
  return session;
};

export const updateInternalNoteAPIConfig = (
  sessionId: number,
  params: UpdateInternalNoteParams,
): ApiConfig => {
  return [
    `${API_URL_SESSION}/${sessionId}/update_internal_note/`,
    {
      method: "PATCH",
      body: JSON.stringify(params),
    },
  ];
};

export const updateInternalNoteAPI = async (
  fetch: Fetch<Session>,
  sessionId: number,
  params: UpdateInternalNoteParams,
): Promise<Session> => {
  const [uri, init] = updateInternalNoteAPIConfig(sessionId, params);
  const { data } = await fetch(uri, init);
  return data;
};

export const checkTagEligibilityAPIConfig = (
  sessionId: number,
  params: CheckTagEligibilityParams = {},
): ApiConfig => {
  return [
    `${API_URL_SESSION}/${sessionId}/check_tags_eligibility/`,
    {
      method: "POST",
      body: JSON.stringify(params),
    },
  ];
};

export const checkTagEligibilityAPI = async (
  fetch: Fetch<void>,
  sessionId: number,
  params?: CheckTagEligibilityParams,
): Promise<void> => {
  const [uri, init] = checkTagEligibilityAPIConfig(sessionId, params);
  await fetch(uri, init);
};
