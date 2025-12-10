import { Result } from "typescript-result";

import {
  FetchSessionsParams,
  ManagerSession,
  fetchManagerSessions,
} from "@bsport/api-book";
import type { Action } from "@bsport/store-base";
import { DEFAULT_PAGE, createErrorWithContext } from "@bsport/store-base";

import { setManagerSessions } from "./store";

export const fetchManagerSessionsAction: Action<
  FetchSessionsParams,
  ManagerSession[]
> = async (fetch, params) => {
  return Result.try(
    async () => {
      const data = await fetchManagerSessions(fetch, params);

      setManagerSessions({
        sessions: data,
        page: DEFAULT_PAGE,
        count: data.length,
      });

      return data;
    },
    (error) =>
      createErrorWithContext(error, {
        message: "Failed to fetch sessions",
        params,
      }),
  );
};
