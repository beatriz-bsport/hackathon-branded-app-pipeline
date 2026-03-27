import { useSuspenseQuery } from "@tanstack/react-query";

import {
  type SearchMembersParams,
  searchMembersQueryOptions,
} from "@bsport/api-cdp";

import { fetch } from "#src/utils/fetch";

export const useSearchMembers = (params: SearchMembersParams) =>
  useSuspenseQuery(searchMembersQueryOptions(fetch, params));
