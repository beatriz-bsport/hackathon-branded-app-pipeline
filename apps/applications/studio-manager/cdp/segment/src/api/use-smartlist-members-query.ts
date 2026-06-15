import { useQuery } from "@tanstack/react-query";

import {
  type FetchSmartlistMembersParams,
  smartlistMembersQueryOptions,
} from "@bsport/api-cdp/smartlist";

import { fetch } from "#src/utils/fetch";

/**
 * Fetches paginated smartlist members.
 */
export const useSmartlistMembersQuery = (
  params: FetchSmartlistMembersParams,
) => {
  return useQuery(smartlistMembersQueryOptions(fetch, params));
};
