import { Result } from "typescript-result";

import type { Action, PaginatedResponse } from "@bsport/store-base";
import { DEFAULT_PAGE, createErrorWithContext } from "@bsport/store-base";

import { fetchManagerSessionsAPI } from "#src/api";
import type { FetchSessionsParams, ManagerSession } from "#src/types";

import { setManagerSessions } from "./store";

export const fetchManagerSessionsAction: Action<
  FetchSessionsParams,
  PaginatedResponse<ManagerSession> | ManagerSession[]
> = async (fetch, params) => {
  const [uri, init] = fetchManagerSessionsAPI(params);

  return Result.try(
    async () => {
      const { data } = await fetch(uri, init);

      if (Array.isArray(data)) {
        setManagerSessions({
          sessions: data,
          page: DEFAULT_PAGE,
          count: data.length,
        });
      } else {
        setManagerSessions({
          sessions: data.results,
          page: data.page,
          count: data.count,
        });
      }

      return data;
    },
    (error) =>
      createErrorWithContext(error, {
        message: "Failed to fetch sessions",
        params,
      }),
  );
};
