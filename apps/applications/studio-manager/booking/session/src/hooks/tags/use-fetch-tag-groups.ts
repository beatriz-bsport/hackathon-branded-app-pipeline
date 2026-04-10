import { useQuery } from "@tanstack/react-query";

import { fetchTagGroupsQueryOptions } from "@bsport/api-cdp/tags";

import { fetch } from "#src/utils/fetch";

import { TAGS_STALE_TIME } from "./constants";

export const useFetchTagGroups = () => {
  return useQuery({
    ...fetchTagGroupsQueryOptions(fetch),
    staleTime: TAGS_STALE_TIME,
  });
};
