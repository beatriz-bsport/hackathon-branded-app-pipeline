import { Result } from "typescript-result";

import {
  type Action,
  type PaginatedResponse,
  createErrorWithContext,
} from "@bsport/store-base";

import { fetchCommunicationAPI } from "#src/api";
import type { Communication } from "#src/types";

import { setCommunications } from "./store";

/**
 * Fetches a list of paginated communications.
 * @param params.page The page number.
 * @param params.page_size The number of items per page.
 */
export const fetchCommunicationsAction: Action<
  { page: number; page_size: number },
  PaginatedResponse<Communication>
> = async (fetch, params) => {
  const [uri, init] = fetchCommunicationAPI(params);

  return Result.try(
    async () => {
      const { data } = await fetch(uri, init);

      setCommunications({
        communications: data.results,
        page: data.page,
        count: data.count,
      });

      return data;
    },
    (error) =>
      createErrorWithContext(error, {
        message: "Failed to fetch communications",
        params,
      }),
  );
};
