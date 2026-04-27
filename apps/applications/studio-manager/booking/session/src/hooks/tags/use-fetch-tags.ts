import { useQuery } from "@tanstack/react-query";
import { Dictionary } from "lodash";
import keyBy from "lodash/keyBy";

import { Tag, fetchTagsQueryOptions } from "@bsport/api-cdp/tags";

import { fetch } from "#src/utils/fetch";

import { TAGS_STALE_TIME } from "./constants";

export function useFetchTags<TSelected = Dictionary<Tag>>(
  select?: (data: Tag[]) => TSelected,
) {
  return useQuery({
    ...fetchTagsQueryOptions(fetch),
    staleTime: TAGS_STALE_TIME,
    select: select ?? ((tags) => keyBy(tags, "id") as TSelected),
  });
}
