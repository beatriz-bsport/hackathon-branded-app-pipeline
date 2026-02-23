import {
  type ApiConfig,
  type Fetch,
  type PaginatedResponse,
  type SearchResponse,
  buildUrlParams,
} from "@bsport/store-base";

import type {
  Establishment,
  FetchEstablishmentParams,
  SearchEstablishmentParams,
} from "#src/establishments/types";

import { API_V1_URL } from "../constants";

const ESTABLISHMENT_API_URL = `${API_V1_URL}/establishment`;

const fetchEstablishmentsAPI = (
  params: FetchEstablishmentParams = {},
): ApiConfig => {
  return [`${ESTABLISHMENT_API_URL}/${buildUrlParams(params)}`];
};

export const fetchEstablishments = async (
  fetch: Fetch<PaginatedResponse<Establishment>>,
  params: FetchEstablishmentParams = {},
): Promise<PaginatedResponse<Establishment>> => {
  const [uri, init] = fetchEstablishmentsAPI(params);
  const { data } = await fetch(uri, init);

  return data;
};

const searchEstablishmentsAPI = (
  params: SearchEstablishmentParams,
): ApiConfig => {
  return [`${ESTABLISHMENT_API_URL}/search/${buildUrlParams(params)}`];
};

export const searchEstablishments = async (
  fetch: Fetch<SearchResponse<Establishment>>,
  params: SearchEstablishmentParams,
): Promise<SearchResponse<Establishment>> => {
  const [uri, init] = searchEstablishmentsAPI(params);
  const { data } = await fetch(uri, init);

  return data;
};
