import { Result } from "typescript-result";

import type { Action, PaginatedResponse } from "@bsport/store-base";

import { fetchPassesAPI } from "#src/api";
import type { Pass } from "#src/types";

import { setPasses } from "./store";

/**
 * Fetches a list of paginated passs.
 * @param params.page The page number.
 * @param params.page_size The number of items per page.
 */
export const fetchPasssAction: Action<
  { page: number; page_size: number },
  PaginatedResponse<Pass>
> = async (fetch, params) => {
  const [uri, init] = fetchPassesAPI(params);

  return Result.try(
    async () => {
      const { data } = await fetch(uri, init);

      setPasses({
        passes: data.results,
        page: data.page,
        count: data.count,
      });

      return data;
    },
    (error) => new Error("Failed to fetch passes", { cause: error }),
  );
};
