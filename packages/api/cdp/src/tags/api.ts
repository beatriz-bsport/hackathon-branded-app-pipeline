import { queryOptions } from "@tanstack/react-query";

import { ApiConfig, Fetch } from "@bsport/store-base";

import { API_V0, QUERY_KEY_MAIN } from "#src/constants";

import { Tag, TagGroup } from "./types";

// ----------------------------------------------------------------------------

const TAGGING_API_V0 = `${API_V0}/tagging`;

export const queryKeys = {
  all: [QUERY_KEY_MAIN, "tagging"] as const,

  // ── Tag ──

  tagAll: () => [...queryKeys.all, "tags"] as const,

  tagList: () => [...queryKeys.tagAll(), "list"] as const,

  // ── TagGroup ──

  tagGroupAll: () => [...queryKeys.all, "tags-groups"] as const,

  tagGroupList: () => [...queryKeys.tagGroupAll(), "list"] as const,
} as const;

// ----------------------------------------------------------------------------

const fetchTagsAPIConfig = (): ApiConfig => {
  return [`${TAGGING_API_V0}/tag/`];
};

export const fetchTagsAPI = async (fetch: Fetch<Tag[]>) => {
  const [uri, init] = fetchTagsAPIConfig();

  const { data } = await fetch(uri, init);

  return data;
};

export const fetchTagsQueryOptions = (fetch: Fetch<Tag[]>) =>
  queryOptions({
    queryKey: queryKeys.tagList(),
    queryFn: () => fetchTagsAPI(fetch),
  });

// ----------------------------------------------------------------------------

const fetchTagGroupsAPIConfig = (): ApiConfig => {
  return [`${TAGGING_API_V0}/tag-group/`];
};

export const fetchTagGroupsAPI = async (fetch: Fetch<TagGroup[]>) => {
  const [uri, init] = fetchTagGroupsAPIConfig();

  const { data } = await fetch(uri, init);

  return data;
};

export const fetchTagGroupsQueryOptions = (fetch: Fetch<TagGroup[]>) =>
  queryOptions({
    queryKey: queryKeys.tagGroupList(),
    queryFn: () => fetchTagGroupsAPI(fetch),
  });
