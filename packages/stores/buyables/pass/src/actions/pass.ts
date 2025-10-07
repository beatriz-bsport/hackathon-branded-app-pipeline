import { Result } from "typescript-result";

import { DEFAULT_PAGE, createErrorWithContext } from "@bsport/store-base";
import type {
  Action,
  PaginatedResponse,
  SearchResponse,
} from "@bsport/store-base";

import { fetchPassesAPI, searchPassesAPI } from "#src/api/pass";
import type { FetchPassesParams, Pass, SearchPassesParams } from "#src/types";

import { setPasses } from "./store";

export const fetchPassesAction: Action<
  FetchPassesParams,
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
        kind: params?.disabled ? "archived" : "active",
      });

      return data;
    },
    (error) =>
      createErrorWithContext(error, {
        message: "Failed to fetch passes",
        params,
      }),
  );
};

export const searchPassesAction: Action<
  SearchPassesParams,
  SearchResponse<Pass>
> = async (fetch, params) => {
  const [uri, init] = searchPassesAPI(params);

  return Result.try(
    async () => {
      const { data } = await fetch(uri, init);

      setPasses({
        passes: data.results,
        page: DEFAULT_PAGE,
        count: data.count,
        kind: "searched",
      });

      return data;
    },
    (error) =>
      createErrorWithContext(error, {
        message: "Failed to search passes",
        params,
      }),
  );
};
