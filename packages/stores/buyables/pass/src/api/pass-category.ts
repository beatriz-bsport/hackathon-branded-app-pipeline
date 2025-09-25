import {
  type ApiConfig,
  DEFAULT_PAGE,
  DEFAULT_PAGE_SIZE,
  buildUrlParams,
} from "@bsport/store-base";

import { API_URL } from "./constants";

const PASS_CATEGORY_API_URL = `${API_URL}/payment-pack-category`;

export type FetchPassCategoriesParams = {
  /** Number of items per page (for pagination). */
  page_size?: number;

  /** Page number of the results (for pagination). */
  page?: number;
};

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
