import { type ApiConfig } from "@bsport/store-base";

import type {
  CreateTagGroupPayload,
  CreateTagPayload,
  DeleteTagGroupParams,
  DeleteTagParams,
  UpdateTagGroupPayload,
  UpdateTagPayload,
} from "./types";

const API_URL = "customer-data-platform/v0";

export const createTagGroupAPI = (
  payload: CreateTagGroupPayload,
): ApiConfig => {
  return [
    `${API_URL}/tagging/tag-group/`,
    { method: "POST", body: JSON.stringify(payload) },
  ];
};

export const updateTagGroupAPI = (
  payload: UpdateTagGroupPayload,
): ApiConfig => {
  return [
    `${API_URL}/tagging/tag-group/${payload.id}/`,
    { method: "PUT", body: JSON.stringify(payload) },
  ];
};

export const deleteTagGroupAPI = (params: DeleteTagGroupParams): ApiConfig => {
  return [`${API_URL}/tagging/tag-group/${params.id}/`, { method: "DELETE" }];
};

export const createTagAPI = (payload: CreateTagPayload): ApiConfig => {
  return [
    `${API_URL}/tagging/tag/`,
    { method: "POST", body: JSON.stringify(payload) },
  ];
};

export const updateTagAPI = (payload: UpdateTagPayload): ApiConfig => {
  return [
    `${API_URL}/tagging/tag/${payload.id}/`,
    { method: "PUT", body: JSON.stringify(payload) },
  ];
};

export const deleteTagAPI = (params: DeleteTagParams): ApiConfig => {
  return [`${API_URL}/tagging/tag/${params.id}/`, { method: "DELETE" }];
};

export const fetchTagUsagesAPI = (): ApiConfig => {
  return [`${API_URL}/tagging/tag/usage/`];
};
