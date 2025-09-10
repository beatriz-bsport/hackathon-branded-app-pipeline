import { type ApiConfig, buildUrlParams } from "@bsport/store-base";

import type { FetchSubscriptionQueryParams } from "./types";

const API_URL = "buyable/v0/subscription";

export const fetchSubscriptionListAPI = (
  params: FetchSubscriptionQueryParams,
): ApiConfig => {
  return [`${API_URL}/contract/${buildUrlParams(params)}`];
};

export const searchSubscriptionAPI = (
  params: FetchSubscriptionQueryParams & { q: string },
): ApiConfig => {
  return [`${API_URL}/contract/search/${buildUrlParams(params)}`];
};
