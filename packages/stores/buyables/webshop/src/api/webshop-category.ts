import {
  type ApiConfig,
  DEFAULT_PAGE,
  DEFAULT_PAGE_SIZE,
  buildUrlParams,
} from "@bsport/store-base";

import type { FetchWebshopCategoriesParams } from "#src/types";

import { API_URL } from "./constants";

const CATEGORY_API_URL = `${API_URL}/subshop`;

export const fetchWebshopCategoriesAPI = (
  params: FetchWebshopCategoriesParams,
): ApiConfig => {
  const { page, page_size } = params ?? {};
  const finalParams = {
    page_size: page_size ?? DEFAULT_PAGE_SIZE,
    page: page ?? DEFAULT_PAGE,
  };
  return [`${CATEGORY_API_URL}/${buildUrlParams(finalParams)}`];
};
