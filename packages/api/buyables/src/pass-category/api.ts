import { PaginatedResponse, buildUrlParams } from "@bsport/store-base";

import { API_V1_URL_PAYMENT_PACK, QUERY_KEY_MAIN } from "#src/constants";
import {
  createAPI,
  createInfiniteQueryOptions,
  createQueryOptions,
} from "#src/shared";

import { FetchPassCategoriesParams, PassCategory } from "./types";

// ----------------------------------------------------------------------------

const PASS_CATEGORY_API_URL = `${API_V1_URL_PAYMENT_PACK}/payment-pack-category`;

export const passCategoryKeys = {
  all: [QUERY_KEY_MAIN, "pass-category"] as const,

  lists: () => [...passCategoryKeys.all, "list"] as const,
  list: (params: FetchPassCategoriesParams) =>
    [...passCategoryKeys.lists(), params] as const,

  infinites: () => [...passCategoryKeys.lists(), "infinite"] as const,
  infinite: (params: FetchPassCategoriesParams) =>
    [...passCategoryKeys.infinites(), params] as const,
} as const;

// ----------------------------------------------------------------------------

export const fetchPassCategoriesAPI = createAPI<
  PaginatedResponse<PassCategory>,
  FetchPassCategoriesParams
>((params) => [`${PASS_CATEGORY_API_URL}/${buildUrlParams(params)}`]);

export const fetchPassCategoriesQueryOptions = createQueryOptions<
  PaginatedResponse<PassCategory>,
  FetchPassCategoriesParams
>(
  (params) => [`${PASS_CATEGORY_API_URL}/${buildUrlParams(params)}`],
  (params) => passCategoryKeys.list(params),
);

export const fetchPassCategoriesInfiniteQueryOptions =
  createInfiniteQueryOptions<
    PaginatedResponse<PassCategory>,
    FetchPassCategoriesParams
  >(
    (params) => [`${PASS_CATEGORY_API_URL}/${buildUrlParams(params)}`],
    (params) => passCategoryKeys.infinite(params),
  );
