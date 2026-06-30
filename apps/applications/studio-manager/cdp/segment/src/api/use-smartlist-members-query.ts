import { useQuery } from "@tanstack/react-query";

import {
  type FetchSmartlistMembersParams,
  smartlistMembersQueryOptions,
} from "@bsport/api-cdp/smartlist";

import { SMARTLIST_MEMBERS_LIST_DEFAULT_PAGE_SIZE } from "#src/components/smartlist-members-list/constants";
import { fetch } from "#src/utils/fetch";

/**
 * Fetches paginated smartlist members.
 */
export const useSmartlistMembersQuery = (
  params: FetchSmartlistMembersParams,
) => {
  return useQuery(
    smartlistMembersQueryOptions(fetch, {
      ...params,
      page_size: params.page_size ?? SMARTLIST_MEMBERS_LIST_DEFAULT_PAGE_SIZE,
    }),
  );
};
