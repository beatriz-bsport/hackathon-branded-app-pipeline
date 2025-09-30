import { Result } from "typescript-result";

import { createErrorWithContext } from "@bsport/store-base";
import type { Action, PaginatedResponse } from "@bsport/store-base";

import {
  type FetchPassCategoriesParams,
  fetchPassCategoriesAPI,
} from "#src/api/pass-category";
import type { PassCategory } from "#src/types";

import { setPassCategories } from "./store";

export const fetchPassCategoriesAction: Action<
  FetchPassCategoriesParams,
  PaginatedResponse<PassCategory>
> = async (fetch, params) => {
  const [uri, init] = fetchPassCategoriesAPI(params);

  return Result.try(
    async () => {
      const { data } = await fetch(uri, init);

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
