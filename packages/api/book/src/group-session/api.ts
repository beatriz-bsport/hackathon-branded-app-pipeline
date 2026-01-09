import { Fetch, buildUrlParams } from "@bsport/store-base";

import type { GroupSession, PaginatedGroupSessionParams } from "./types";

const API_URL = "book/v1";
const API_URL_GROUP_SESSION = `${API_URL}/offer_group`;

export const fetchGroupSessionsAPIConfig = (
  sessionId: number,
  params: PaginatedGroupSessionParams,
): string => {
  return `${API_URL_GROUP_SESSION}/${buildUrlParams(params)}`;
};

export const fetchGroupSessionsAPI = async (
  fetch: Fetch<GroupSession[]>,
  sessionId: number,
  params: PaginatedGroupSessionParams,
): Promise<GroupSession[]> => {
  const uri = fetchGroupSessionsAPIConfig(sessionId, params);
  const { data: fetchedData } = await fetch(uri);

  return fetchedData;
};
