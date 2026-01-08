import {
  type ApiConfig,
  DEFAULT_PAGE,
  DEFAULT_PAGE_SIZE,
  buildUrlParams,
} from "@bsport/store-base";

import type {
  FetchWebshopItemsParams,
  SearchWebshopItemsParams,
} from "#src/types";

import { API_URL } from "./constants";

const ITEM_API_URL = `${API_URL}/item`;

export const fetchWebshopItemsAPI = (
  params: FetchWebshopItemsParams,
): ApiConfig => {
  const { page_size, page, category, id__in, ...otherParams } = params ?? {};

  const defaultPageSize = id__in?.length ? id__in.length : DEFAULT_PAGE_SIZE;
  const finalParams = {
    page_size: page_size ?? defaultPageSize,
    page: page ?? DEFAULT_PAGE,
    ...(id__in?.length ? { id__in } : {}),
    ...(category ? { subshop: category } : {}),
    ...otherParams,
  };

  return [`${ITEM_API_URL}/${buildUrlParams(finalParams)}`];
};

export const searchWebshopItemsAPI = (
  params: SearchWebshopItemsParams,
): ApiConfig => {
  const { category, ...otherParams } = params ?? {};

  const finalParams = {
    ...otherParams,
    ...(category ? { subshop: category } : {}),
  };

  return [`${ITEM_API_URL}/search/${buildUrlParams(finalParams)}`];
};
