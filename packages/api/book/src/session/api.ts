import {
  ApiConfig,
  Fetch,
  PaginatedResponse,
  buildUrlParams,
} from "@bsport/store-base";

import type {
  CancelMultipleSessionsParams,
  CancelSessionParams,
  FetchSessionsParams,
  ListSessionsWithPendingReplacementRequestIdsParams,
  ManagerSession,
  MinimalSession,
  PaginatedFetchSessionsParams,
  Session,
} from "#src/session/types";

const API_URL = "book/v1";
const API_URL_SESSION = `${API_URL}/offer`;

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
