import {
  type ApiConfig,
  type URLParams,
  buildUrlParams,
} from "@bsport/store-base";

import type { PackFormData } from "./types";

const API_URL = "buyable/v1/payment_combo";

function getUrlParams(params: URLParams) {
  const { archived, ...otherParams } = params;
  const finalParams =
    archived === undefined || archived === null
      ? otherParams
      : {
          ...otherParams,
          available: !archived,
        };
  return buildUrlParams(finalParams);
}

export type FetchPacksParams = {
  page: number;
  page_size: number;
  archived?: boolean;
  include_expired?: boolean;
  offer?: number;
};

export const fetchPacksAPI = (params: FetchPacksParams): ApiConfig => {
  return [`${API_URL}${getUrlParams(params)}`];
};

export type FuzzySearchParams = Omit<FetchPacksParams, "page"> & {
  queryString: string;
};

export const fuzzySearchPacksAPI = (params: FuzzySearchParams): ApiConfig => {
  const { queryString, ...otherParams } = params;
  return [
    `${API_URL}/search/${getUrlParams({ ...otherParams, q: queryString ?? "" })}`,
  ];
};

export const archivePackAPI = ({ id }: { id: number }): ApiConfig => {
  return [
    `${API_URL}/${id}/`,
    {
      method: "DELETE",
    },
  ];
};

export const restorePackAPI = ({ id }: { id: number }): ApiConfig => {
  return [
    `${API_URL}/${id}/restore/`,
    {
      method: "PATCH",
    },
  ];
};

export const createPackAPI = (data: PackFormData): ApiConfig => {
  return [
    `${API_URL}/`,
    {
      method: "POST",
      body: JSON.stringify(data),
    },
  ];
};
