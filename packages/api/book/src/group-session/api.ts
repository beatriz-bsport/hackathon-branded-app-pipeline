import { Fetch, PaginatedResponse, buildUrlParams } from "@bsport/store-base";

import type { GroupSession, PaginatedGroupSessionParams } from "./types";

const API_URL = "book/v1";
const API_URL_GROUP_SESSION = `${API_URL}/offer_group`;

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
