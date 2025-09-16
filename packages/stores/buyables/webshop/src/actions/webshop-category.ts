import { Result } from "typescript-result";

import type { Action, PaginatedResponse } from "@bsport/store-base";
import { createErrorWithContext } from "@bsport/store-base";

import {
  type FetchWebshopCategoriesParams,
  fetchWebshopCategoriesAPI,
} from "#src/api/webshop-category";
import type { WebshopCategory } from "#src/types";

import { setWebshopCategories } from "./store";

export const fetchWebshopCategoriesAction: Action<
  FetchWebshopCategoriesParams,
  PaginatedResponse<WebshopCategory>
> = async (fetch, params) => {
  const [uri, init] = fetchWebshopCategoriesAPI(params);

  return Result.try(
    async () => {
      const { data } = await fetch(uri, init);

      setWebshopCategories({
        webshopCategories: data.results,
        page: data.page,
        count: data.count,
      });

      return data;
    },
    (error) =>
      createErrorWithContext(error, {
        message: "Failed to fetch webshop categories",
        params,
      }),
  );
};
