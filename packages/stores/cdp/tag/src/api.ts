import { type ApiConfig } from "@bsport/store-base";

const API_URL = "customer-data-platform/v0";

export const fetchTagsAPI = (): ApiConfig => {
  return [`${API_URL}/tagging/tag/`];
};

export const fetchTagGroupsAPI = (): ApiConfig => {
  return [`${API_URL}/tagging/tag-group/`];
};
