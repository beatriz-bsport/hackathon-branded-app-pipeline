import { Result } from "typescript-result";

import type { Action, PaginatedResponse } from "@bsport/store-base";

import { fetchRolesAPI } from "#src/api";
import type { Role } from "#src/types";

import { setRoles } from "./store";

/**
 * Fetches a list of paginated roles.
 * @param params.page The page number.
 * @param params.page_size The number of items per page.
 */
export const fetchRolesAction: Action<
  { page: number; page_size: number },
  PaginatedResponse<Role>
> = async (fetch, params) => {
  /** @indication Retrieve fetch arguments from your API method */
  const [uri, init] = fetchRolesAPI(params);

  return Result.try(
    async () => {
      /** @indication Fetch returned type is specified in Action<> */
      const { data } = await fetch(uri, init);

      /** @indication Use store actions to update your Zustand store */
      setRoles({
        roles: data.results,
        page: data.page,
        count: data.count,
      });

      /** @indication Not mandatory as you can retrieve data from your store */
      return data;
    },
    (error) => new Error("Failed to fetch roles", { cause: error }),
  );
};
