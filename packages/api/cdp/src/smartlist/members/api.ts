import {
  type Fetch,
  type PaginatedResponse,
  buildUrlParams,
} from "@bsport/store-base";

import {
  SMARTLIST_API_V1,
  SMARTLIST_MEMBERS_DEFAULT_PAGE_SIZE,
} from "../constants";
import type { FetchSmartlistMembersParams, SmartlistMember } from "./types";

/**
 * Fetches a paginated list of members matching the smartlist filters.
 */
export const fetchSmartlistMembersAPI = async (
  fetch: Fetch<PaginatedResponse<SmartlistMember>>,
  params: FetchSmartlistMembersParams,
): Promise<PaginatedResponse<SmartlistMember>> => {
  const { smartlistId } = params;
  const page = params.page ?? 1;
  const page_size = params.page_size ?? SMARTLIST_MEMBERS_DEFAULT_PAGE_SIZE;
  const urlParams = buildUrlParams({ page, page_size });
  const { data } = await fetch(
    `${SMARTLIST_API_V1}/group/${smartlistId}/members/${urlParams}`,
  );

  return data;
};
