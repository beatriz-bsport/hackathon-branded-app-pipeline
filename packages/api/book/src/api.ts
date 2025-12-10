import { Fetch, buildUrlParams } from "@bsport/store-base";

import type { FetchSessionsParams, ManagerSession } from "#src/types";

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
