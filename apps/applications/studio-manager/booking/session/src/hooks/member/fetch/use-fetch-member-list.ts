import { useSuspenseQuery } from "@tanstack/react-query";

import {
  type PaginatedMemberListParams,
  memberListQueryOptions,
} from "@bsport/api-cdp";

import { fetch } from "#src/utils/fetch";

export const useFetchMemberList = (params?: PaginatedMemberListParams) =>
  useSuspenseQuery(memberListQueryOptions(fetch, params));
