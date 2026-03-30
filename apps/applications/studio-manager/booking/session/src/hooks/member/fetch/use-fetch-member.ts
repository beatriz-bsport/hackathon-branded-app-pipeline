import { useSuspenseQuery } from "@tanstack/react-query";

import { type GetMemberParams, memberQueryOptions } from "@bsport/api-cdp";

import { fetch } from "#src/utils/fetch";

export const useFetchMember = (params: GetMemberParams) =>
  useSuspenseQuery(memberQueryOptions(fetch, params));
