import { type ApiConfig, type Fetch } from "@bsport/store-base";

import { API_URL } from "../constants";
import type { FetchStripeReadersResponse, StripeReader } from "./types";

export const fetchStripeReadersAPIConfig = (): ApiConfig => {
  return [`${API_URL}/terminal/reader/`];
};

export const fetchStripeReadersAPI = async (
  fetch: Fetch<FetchStripeReadersResponse>,
): Promise<StripeReader[]> => {
  const [uri, init] = fetchStripeReadersAPIConfig();
  const { data } = await fetch(uri, init);

  if (Array.isArray(data)) {
    return data;
  }

  return Array.isArray(data?.data) ? data.data : [];
};
