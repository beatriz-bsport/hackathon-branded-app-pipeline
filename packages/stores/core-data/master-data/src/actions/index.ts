import { Result } from "typescript-result";

import {
  FetchSportCategoryParams,
  type SportCategory,
  fetchSportCategories,
} from "@bsport/api-core";
import type { Action } from "@bsport/store-base";

import { setSportCategories } from "./store";

export const fetchSportCategoriesAction: Action<
  FetchSportCategoryParams,
  SportCategory[]
> = async (fetch, params) => {
  return Result.try(
    async () => {
      const sportCategories = await fetchSportCategories(fetch, params);

      setSportCategories({
        sportCategories,
      });

      return sportCategories;
    },
    (error) => new Error("Failed to fetch sport categories", { cause: error }),
  );
};
