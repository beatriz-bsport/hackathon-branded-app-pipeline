import { Result } from "typescript-result";

import type { Action, PaginatedResponse } from "@bsport/store-base";

import { fetchPacksAPI } from "#src/api";
import type { Pack } from "#src/types";

import { setPacks } from "./store";

/**
 * Fetches a list of paginated packs.
 * @param params.page The page number.
 * @param params.page_size The number of items per page.
 */
export const fetchPacksAction: Action<
  { page: number; page_size: number },
  PaginatedResponse<Pack>
> = async (fetch, params) => {
  /** @indication Retrieve fetch arguments from your API method */
  const [uri, init] = fetchPacksAPI(params);

  return Result.try(
    async () => {
      const { data } = await fetch(uri, init);

      setPacks({
        packs: data.results,
        page: data.page,
        count: data.count,
      });

      return data;
    },
    (error) => new Error("Failed to fetch packs", { cause: error }),
  );
};
