import { queryOptions } from "@tanstack/react-query";

import { type ApiConfig, Fetch, buildUrlParams } from "@bsport/store-base";

import { API_V1_URL, QUERY_KEY_MAIN } from "../constants";
import { FetchSportCategoryParams, SportCategory } from "./types";

// ----------------------------------------------------------------------------

const API_URL = `${API_V1_URL}/master-data`;

export const queryKeys = {
  all: [QUERY_KEY_MAIN, "categories"] as const,

  lists: () => [...queryKeys.all, "list"] as const,
  list: (params: FetchSportCategoryParams) =>
    [...queryKeys.lists(), params] as const,
} as const;

// ----------------------------------------------------------------------------

export const fetchSportCategoriesAPIConfig = (
  params: FetchSportCategoryParams,
): ApiConfig => {
  return [`${API_URL}/sct/${buildUrlParams(params)}`];
};

export const fetchSportCategoriesAPI = async (
  fetch: Fetch<SportCategory[]>,
  params: FetchSportCategoryParams,
): Promise<SportCategory[]> => {
  const [uri, init] = fetchSportCategoriesAPIConfig(params);
  const { data } = await fetch(uri, init);

  return data;
};

export const fetchSportCategoriesQueryOptions = (
  fetch: Fetch<SportCategory[]>,
  params: FetchSportCategoryParams,
) =>
  queryOptions({
    queryKey: queryKeys.list(params),
    queryFn: () => fetchSportCategoriesAPI(fetch, params),
  });
