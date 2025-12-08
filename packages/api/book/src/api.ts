import { buildUrlParams } from "@bsport/store-base";

import { fetch } from "#src/fetch";
import { ManagerSession } from "#src/types";

const API_URL = "book/v1";
const API_URL_SESSION = `${API_URL}/offer`;

type FetchSessionsParams = {
  min_date: string;
  max_date: string;
};

export const fetchManagerSessionsURL = (
  params: FetchSessionsParams,
): string => {
  return `${API_URL_SESSION}/as_manager/${buildUrlParams(params)}`;
};

export const fetchManagerSessions = async (
  params: FetchSessionsParams,
): Promise<ManagerSession[]> => {
  const uri = fetchManagerSessionsURL(params);
  const { data: fetchedData } = await fetch<ManagerSession[]>(uri);

  return fetchedData;
};
