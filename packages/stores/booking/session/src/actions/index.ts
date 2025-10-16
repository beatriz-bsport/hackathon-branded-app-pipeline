import { Result } from "typescript-result";

import type { Action, PaginatedResponse } from "@bsport/store-base";
import { createErrorWithContext } from "@bsport/store-base";

import { fetchSessionsAPI } from "#src/api";
import type { Session } from "#src/types";

import { setSessions } from "./store";

export const fetchSessionsAction: Action<
  { page: number; page_size: number },
  PaginatedResponse<Session>
> = async (fetch, params) => {
  const [uri, init] = fetchSessionsAPI(params);

  return Result.try(
    async () => {
      const { data } = await fetch(uri, init);

      setSessions({
        sessions: data.results,
        page: data.page,
        count: data.count,
      });

      return data;
    },
    (error) =>
      createErrorWithContext(error, { message: "Failed to fetch sessions" }),
  );
};
