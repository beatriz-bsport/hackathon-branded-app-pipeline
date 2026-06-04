import { Result } from "typescript-result";

import { fetchPassCategoriesAPI } from "@bsport/api-buyables/pass-category";
import {
  DEFAULT_PAGE,
  DEFAULT_PAGE_SIZE,
  createErrorWithContext,
} from "@bsport/store-base";
import type { Action, PaginatedResponse } from "@bsport/store-base";

import type { FetchPassCategoriesParams, PassCategory } from "#src/types";

import { setPassCategories } from "./store";

export const fetchPassCategoriesAction: Action<
  FetchPassCategoriesParams,
  PaginatedResponse<PassCategory>
> = async (fetch, params) => {
  const { id__in, page, page_size, ...otherParams } = params ?? {};

  const defaultPageSize = id__in?.length ? id__in.length : DEFAULT_PAGE_SIZE;
  const finalParams = {
    page_size: page_size ?? defaultPageSize,
    page: page ?? DEFAULT_PAGE,
    ...(id__in?.length ? { id__in } : {}),
    ...otherParams,
  };

  return Result.try(
    async () => {
      const data = await fetchPassCategoriesAPI(fetch, finalParams);

      setPassCategories({
        passCategories: data.results,
        page: data.page,
        count: data.count,
      });

      return data;
    },
    (error) =>
      createErrorWithContext(error, {
        message: "Failed to fetch pass categories",
        params,
      }),
  );
};
