import { Result } from "typescript-result";

import type { Action } from "@bsport/store-base";

import { FetchSportCategoryParams, fetchSportCategories } from "#src/api";
import type { SportCategory } from "#src/types";

import { setSportCategories } from "./store";

export const fetchSportCategoriesAction: Action<
  FetchSportCategoryParams,
  SportCategory[]
> = async (fetch, params) => {
  const [uri, init] = fetchSportCategories(params);

  return Result.try(
    async () => {
      const { data } = await fetch(uri, init);

      setSportCategories({
        sportCategories: data,
      });

      return data;
    },
    (error) => new Error("Failed to fetch sport categories", { cause: error }),
  );
};
