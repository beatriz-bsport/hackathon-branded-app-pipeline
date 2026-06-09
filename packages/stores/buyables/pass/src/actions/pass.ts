import { Result } from "typescript-result";

import { fetchPassesAPI, searchPassesAPI } from "@bsport/api-buyables/pass";
import {
  DEFAULT_PAGE,
  DEFAULT_PAGE_SIZE,
  createErrorWithContext,
} from "@bsport/store-base";
import type {
  Action,
  PaginatedResponse,
  SearchResponse,
} from "@bsport/store-base";

import type { FetchPassesParams, Pass, SearchPassesParams } from "#src/types";

import { setPasses } from "./store";

export const fetchPassesAction: Action<
  FetchPassesParams,
  PaginatedResponse<Pass>
> = async (fetch, params) => {
  const { page_size, page, id__in, ...otherParams } = params ?? {};

  const defaultPageSize = id__in?.length ? id__in.length : DEFAULT_PAGE_SIZE;
  const finalParams = {
    page_size: page_size ?? defaultPageSize,
    page: page ?? DEFAULT_PAGE,
    ...(id__in?.length ? { id__in } : {}),
    ...otherParams,
  };

  return Result.try(
    async () => {
      const data = await fetchPassesAPI(fetch, finalParams);

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
  return Result.try(
    async () => {
      const data = await searchPassesAPI(fetch, params);

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
