import { ApiConfig, Fetch } from "@bsport/store-base";

import { API_V1_URL } from "#src/constants";

import { FetchWellhubProductsResponse } from "./types";

const API_WELLHUB_URI = `${API_V1_URL}wellhub`;

const API_WELLHUB_GYM_URI = `${API_WELLHUB_URI}/wellhub-gym`;

export const fetchWellhubProductsAPIConfig = (): ApiConfig => {
  return [`${API_WELLHUB_GYM_URI}/get-products-by-wellhub-gym/`];
};

export const fetchWellhubProductsAPI = async (
  fetch: Fetch<FetchWellhubProductsResponse>,
): Promise<FetchWellhubProductsResponse> => {
  const [uri, init] = fetchWellhubProductsAPIConfig();
  const { data } = await fetch(uri, init);

  return data;
};
