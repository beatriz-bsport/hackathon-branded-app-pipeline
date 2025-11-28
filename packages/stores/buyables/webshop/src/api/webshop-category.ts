import { type ApiConfig, buildUrlParams } from "@bsport/store-base";

import type { FetchWebshopCategoriesParams } from "#src/types";

import { API_URL } from "./constants";

const CATEGORY_API_URL = `${API_URL}/subshop`;

export const fetchWebshopCategoriesAPI = (
  params: FetchWebshopCategoriesParams,
): ApiConfig => {
  return [`${CATEGORY_API_URL}/${buildUrlParams(params ?? {})}`];
};
