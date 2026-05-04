import { ApiConfig, Fetch } from "@bsport/store-base";

import { API_V0, QUERY_KEY_MAIN } from "#src/constants";

import { Tag, TagGroup } from "./types";

// ----------------------------------------------------------------------------

const TAGGING_API_V0 = `${API_V0}/tagging`;

export const tagsKeys = {
  all: [QUERY_KEY_MAIN, "tagging"] as const,
  // ── Tag ──
  tagAll: () => [...tagsKeys.all, "tags"] as const,
  tagList: () => [...tagsKeys.tagAll(), "list"] as const,
  // ── TagGroup ──
  tagGroupAll: () => [...tagsKeys.all, "tags-groups"] as const,
  tagGroupList: () => [...tagsKeys.tagGroupAll(), "list"] as const,
} as const;

// ----------------------------------------------------------------------------

const getFetchTagsConfig = (): ApiConfig => {
  return [`${TAGGING_API_V0}/tag/`];
};

export const fetchTagsAPI = async (fetch: Fetch<Tag[]>) => {
  const [uri, init] = getFetchTagsConfig();

  const { data } = await fetch(uri, init);

  return data;
};

// ----------------------------------------------------------------------------

const getFetchTagGroupsConfig = (): ApiConfig => {
  return [`${TAGGING_API_V0}/tag-group/`];
};

export const fetchTagGroupsAPI = async (fetch: Fetch<TagGroup[]>) => {
  const [uri, init] = getFetchTagGroupsConfig();

  const { data } = await fetch(uri, init);

  return data;
};
