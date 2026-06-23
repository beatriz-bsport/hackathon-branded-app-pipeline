import {
  type ApiConfig,
  type Fetch,
  type URLParams,
  buildUrlParams,
} from "@bsport/store-base";

import { API_V1_URL, QUERY_KEY_MAIN } from "#src/constants";

// ----------------------------------------------------------------------------

export const API_URL_EVENT = `${API_V1_URL}/event/event`;

export const QUERY_KEY_EVENT = [QUERY_KEY_MAIN, "event"] as const;

// ----------------------------------------------------------------------------

export const fetchEventsAPIConfig = (params: URLParams): ApiConfig => {
  return [`${API_URL_EVENT}/${buildUrlParams(params)}`];
};

export const fetchEventsAPI = async <T>(
  fetch: Fetch<T[]>,
  params: URLParams,
): Promise<T[]> => {
  const [uri, init] = fetchEventsAPIConfig(params);
  const { data } = await fetch(uri, init);
  return data;
};
