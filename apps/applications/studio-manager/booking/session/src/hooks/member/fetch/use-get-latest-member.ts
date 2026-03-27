import { useSuspenseQuery } from "@tanstack/react-query";

import { getLatestMemberQueryOptions } from "@bsport/api-cdp";

import { fetch } from "#src/utils/fetch";

export const useGetLatestMember = () =>
  useSuspenseQuery(getLatestMemberQueryOptions(fetch));
