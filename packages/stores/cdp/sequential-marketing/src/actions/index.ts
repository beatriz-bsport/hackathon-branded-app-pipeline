import { Result } from "typescript-result";

import type { Action, PaginatedResponse } from "@bsport/store-base";

import { fetchCadencesAPI } from "#src/api";
import type { Cadence } from "#src/types";

import { setCadences } from "./store";

/**
 * Fetches a list of paginated cadences.
 * @param params.page The page number.
 * @param params.page_size The number of items per page.
 * @param params.id__in Optional list of IDs to filter by.
 */
export const fetchCadencesAction: Action<
  { page: number; page_size: number; id__in?: number[] },
  PaginatedResponse<Cadence>
> = async (fetch, params) => {
  const [uri, init] = fetchCadencesAPI(params);

  return Result.try(
    async () => {
      const { data } = await fetch(uri, init);

      setCadences({
        cadences: data.results,
        page: data.page,
        count: data.count,
      });

      return data;
    },
    (error) => new Error("Failed to fetch cadences", { cause: error }),
  );
};
