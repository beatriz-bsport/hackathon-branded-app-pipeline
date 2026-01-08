import {
  type ApiConfig,
  DEFAULT_PAGE,
  DEFAULT_PAGE_SIZE,
  buildUrlParams,
} from "@bsport/store-base";

import type { FetchPassesParams, SearchPassesParams } from "#src/types/api";

import { API_URL } from "./constants";

const PASS_API_URL = `${API_URL}/payment-pack`;

export const fetchPassesAPI = (params?: FetchPassesParams): ApiConfig => {
  const { page_size, page, id__in, ...otherParams } = params ?? {};

  const defaultPageSize = id__in?.length ? id__in.length : DEFAULT_PAGE_SIZE;
  const finalParams = {
    page_size: page_size ?? defaultPageSize,
    page: page ?? DEFAULT_PAGE,
    ...(id__in?.length ? { id__in } : {}),
    ...otherParams,
  };

  return [`${PASS_API_URL}/${buildUrlParams(finalParams)}`];
};

export const searchPassesAPI = (params?: SearchPassesParams): ApiConfig => {
  return [`${PASS_API_URL}/search/${buildUrlParams(params ?? {})}`];
};
