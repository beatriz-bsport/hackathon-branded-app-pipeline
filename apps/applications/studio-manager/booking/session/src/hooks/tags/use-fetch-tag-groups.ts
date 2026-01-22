import { queryOptions, useQuery } from "@tanstack/react-query";

import { fetchTagGroupsAPI } from "@bsport/api-core";

import { fetch } from "#src/utils/fetch";

import { TAGS_STALE_TIME, TAG_GROUPS_QUERY_KEY } from "./constants";

const fetchTagGroups = fetchTagGroupsAPI.bind(null, fetch);

const tagGroupsQueryOptions = () => {
  return queryOptions({
    queryKey: [TAG_GROUPS_QUERY_KEY],
    queryFn: () => fetchTagGroups(),
    staleTime: TAGS_STALE_TIME,
  });
};

export const useFetchTagGroups = () => {
  return useQuery({
    ...tagGroupsQueryOptions(),
  });
};
