import { type ApiConfig, buildUrlParams } from "@bsport/store-base";

import type { FetchPassCategoriesParams } from "#src/types";

import { API_URL } from "./constants";

const PASS_CATEGORY_API_URL = `${API_URL}/payment-pack-category`;

export const fetchPassCategoriesAPI = (
  params?: FetchPassCategoriesParams,
): ApiConfig => {
  return [`${PASS_CATEGORY_API_URL}/${buildUrlParams(params ?? {})}`];
};
