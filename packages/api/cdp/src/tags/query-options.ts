import { queryOptions } from "@tanstack/react-query";

import { Fetch } from "@bsport/store-base";

import { fetchTagGroupsAPI, fetchTagsAPI, tagsKeys } from "./api";
import { Tag, TagGroup } from "./types";

export const fetchTagsQueryOptions = (fetch: Fetch<Tag[]>) =>
  queryOptions({
    queryKey: tagsKeys.tagList(),
    queryFn: () => fetchTagsAPI(fetch),
  });

export const fetchTagGroupsQueryOptions = (fetch: Fetch<TagGroup[]>) =>
  queryOptions({
    queryKey: tagsKeys.tagGroupList(),
    queryFn: () => fetchTagGroupsAPI(fetch),
  });
