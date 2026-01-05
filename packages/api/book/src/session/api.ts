import { ApiConfig, Fetch, buildUrlParams } from "@bsport/store-base";

import type {
  CancelMultipleSessionsParams,
  FetchSessionsParams,
  ListSessionsWithPendingReplacementRequestIdsParams,
  ManagerSession,
} from "#src/session/types";

const API_URL = "book/v1";
const API_URL_SESSION = `${API_URL}/offer`;

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
): Promise<void> => {
  const [uri, init] = cancelMultipleSessionsAPIConfig(params);
  await fetch(uri, init);
};
