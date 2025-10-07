import {
  type ApiConfig,
  DEFAULT_PAGE,
  DEFAULT_PAGE_SIZE,
  buildUrlParams,
} from "@bsport/store-base";

import type { FetchPassCategoriesParams } from "#src/types";

import { API_URL } from "./constants";

const PASS_CATEGORY_API_URL = `${API_URL}/payment-pack-category`;

export const fetchPassCategoriesAPI = (
  params?: FetchPassCategoriesParams,
): ApiConfig => {
  const { page, page_size } = params ?? {};
  const finalParams = {
    page_size: page_size ?? DEFAULT_PAGE_SIZE,
    page: page ?? DEFAULT_PAGE,
  };
  return [`${PASS_CATEGORY_API_URL}/${buildUrlParams(finalParams)}`];
};
