import { Result } from "typescript-result";

import type { Action, PaginatedResponse } from "@bsport/store-base";

import { fetchModelsAPI } from "#src/api";
import type { Model } from "#src/types";

import { setModels } from "./store";

/**
 * Fetches a list of paginated models.
 * @param params.page The page number.
 * @param params.page_size The number of items per page.
 */
export const fetchModelsAction: Action<
  { page: number; page_size: number },
  PaginatedResponse<Model>
> = async (fetch, params) => {
  /** @indication Retrieve fetch arguments from your API method */
  const [uri, init] = fetchModelsAPI(params);

  return Result.try(
    async () => {
      /** @indication Fetch returned type is specified in Action<> */
      const { data } = await fetch(uri, init);

      /** @indication Use store actions to update your Zustand store */
      setModels({
        models: data.results,
        page: data.page,
        count: data.count,
      });

      /** @indication Not mandatory as you can retrieve data from your store */
      return data;
    },
    (error) => new Error("Failed to fetch models", { cause: error }),
  );
};
