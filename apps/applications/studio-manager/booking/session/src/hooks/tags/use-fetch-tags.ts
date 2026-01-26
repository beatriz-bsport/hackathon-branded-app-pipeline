import { queryOptions, useQuery } from "@tanstack/react-query";
import { keyBy } from "lodash";

import { fetchTagsAPI } from "@bsport/api-core";

import { fetch } from "#src/utils/fetch";

import { TAGS_QUERY_KEY, TAGS_STALE_TIME } from "./constants";

const fetchTags = fetchTagsAPI.bind(null, fetch);

const tagsQueryOptions = () => {
  return queryOptions({
    queryKey: [TAGS_QUERY_KEY],
    queryFn: () => fetchTags(),
    staleTime: TAGS_STALE_TIME,
  });
};

export const useFetchTags = () => {
  return useQuery({
    ...tagsQueryOptions(),
    select: (tags) => keyBy(tags, "id"),
  });
};
