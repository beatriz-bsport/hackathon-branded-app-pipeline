import { useQuery } from "@tanstack/react-query";
import keyBy from "lodash/keyBy";

import { fetchTagsQueryOptions } from "@bsport/api-cdp/tags";

import { fetch } from "#src/utils/fetch";

import { TAGS_STALE_TIME } from "./constants";

export const useFetchTags = () => {
  return useQuery({
    ...fetchTagsQueryOptions(fetch),
    staleTime: TAGS_STALE_TIME,
    select: (tags) => keyBy(tags, "id"),
  });
};
