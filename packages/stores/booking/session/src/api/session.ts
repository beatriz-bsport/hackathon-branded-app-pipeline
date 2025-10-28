import { type ApiConfig, buildUrlParams } from "@bsport/store-base";

import type { FetchSessionsParams } from "#src/types";

import { API_URL } from "./constants";

const API_URL_SESSION = `${API_URL}/offer`;

export const fetchManagerSessionsAPI = (
  params: FetchSessionsParams,
): ApiConfig => {
  return [`${API_URL_SESSION}/as_manager/${buildUrlParams(params)}`];
};
