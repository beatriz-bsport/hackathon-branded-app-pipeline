import { type ApiConfig, buildUrlParams } from "@bsport/store-base";

import { FetchSmartlistsParams } from "./actions";
import type {
  CreateSmartlistParams,
  EditSmartlistParams,
  GeneralSmartlistParams,
} from "./types";

const API_URL = "api/v1/smartlist";
const CDP_API_URL = "customer-data-platform/v1/smartlist";

export const fetchSmartlistsAPI = (
  params?: FetchSmartlistsParams,
): ApiConfig => {
  const urlParams = params ? buildUrlParams(params) : "";
  return [`${API_URL}/group/${urlParams}`];
};

export const fetchSearchSmartlistsAPI = (params: {
  search: string;
}): ApiConfig => {
  return [
    `${CDP_API_URL}/group/search${buildUrlParams({
      q: params.search,
    })}`,
  ];
};

export const createSmartlistAPI = (
  params: CreateSmartlistParams,
): ApiConfig => {
  return [
    `${API_URL}/group/`,
    {
      method: "POST",
      body: JSON.stringify(params),
    },
  ];
};

export const editSmartlistAPI = (params: EditSmartlistParams): ApiConfig => {
  return [
    `${API_URL}/group/${params.id}/`,
    {
      method: "PATCH",
      body: JSON.stringify(params),
    },
  ];
};

export const deleteSmartlistAPI = (
  params: GeneralSmartlistParams,
): ApiConfig => {
  return [
    `${API_URL}/group/${params.id}/`,
    {
      method: "DELETE",
    },
  ];
};

export const duplicateSmartlistAPI = (
  params: GeneralSmartlistParams,
): ApiConfig => {
  return [
    `${API_URL}/group/${params.id}/create_copy/`,
    {
      method: "POST",
    },
  ];
};

export const fetchCadencesInSmartlistAPI = (
  params: GeneralSmartlistParams,
): ApiConfig => {
  return [`${API_URL}/group/${params.id}/cadences_in/`];
};
