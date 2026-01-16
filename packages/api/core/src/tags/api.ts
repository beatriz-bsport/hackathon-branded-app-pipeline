import { ApiConfig, Fetch } from "@bsport/store-base";

import { Tag, TagGroup } from "./types";

const API_URL = "customer-data-platform/v0/tagging";

const fetchTagsAPIConfig = (): ApiConfig => {
  return [`${API_URL}/tag/`];
};

export const fetchTagsAPI = async (fetch: Fetch<Tag[]>) => {
  const [uri, init] = fetchTagsAPIConfig();

  const { data } = await fetch(uri, init);

  return data;
};

const fetchTagGroupsAPIConfig = (): ApiConfig => {
  return [`${API_URL}/tag-group/`];
};

export const fetchTagGroupsAPI = async (fetch: Fetch<TagGroup[]>) => {
  const [uri, init] = fetchTagGroupsAPIConfig();

  const { data } = await fetch(uri, init);

  return data;
};
