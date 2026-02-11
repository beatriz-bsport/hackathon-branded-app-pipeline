import { Result } from "typescript-result";

import type { Action, PaginatedResponse } from "@bsport/store-base";

import {
  type FetchGiftcardsParams,
  archiveGiftcardAPI,
  duplicateGiftcardAPI,
  fetchGiftcardsAPI,
  restoreGiftcardAPI,
} from "#src/api";
import type { Giftcard } from "#src/types";

import { setGiftcards, updateGiftcard } from "./store";

/**
 * Fetch a paginated list of Giftcard.
 * @param params.page The page number.
 * @param params.page_size The number of items per page.
 * @param params.disabled Whether to load disabled items or not.
 * @param params.... Any other URL parameter you want.
 */
export const fetchGiftcardsAction: Action<
  FetchGiftcardsParams,
  PaginatedResponse<Giftcard>
> = async (fetch, params) => {
  const [uri, init] = fetchGiftcardsAPI(params);

  return Result.try(
    async () => {
      const { data } = await fetch(uri, init);

      setGiftcards({
        giftcards: data.results,
        page: data.page,
        count: data.count,
      });

      return data;
    },
    (error) => new Error("Failed to fetch giftcards", { cause: error }),
  );
};

/**
 * Archive an active Giftcard.
 * @param params.id Id of the Giftcard to archive.
 */
export const archiveGiftcardAction: Action<{ id: number }, Giftcard> = async (
  fetch,
  params,
) => {
  const [uri, init] = archiveGiftcardAPI(params);

  return Result.try(
    async () => {
      const { data } = await fetch(uri, init);

      updateGiftcard(data);

      return data;
    },
    (error) =>
      new Error(`Failed to archive giftcard n°${params.id}`, { cause: error }),
  );
};

/**
 * Restore an archived Giftcard.
 * @param params.id Id of the Giftcard to restore.
 */
export const restoreGiftcardAction: Action<{ id: number }, Giftcard> = async (
  fetch,
  params,
) => {
  const [uri, init] = restoreGiftcardAPI(params);

  return Result.try(
    async () => {
      const { data } = await fetch(uri, init);

      updateGiftcard(data);

      return data;
    },
    (error) =>
      new Error(`Failed to restore giftcard n°${params.id}`, { cause: error }),
  );
};

/**
 * Duplicate an active Giftcard.
 * @param params.id Id of the Giftcard to duplicate.
 */
export const duplicateGiftcardAction: Action<{ id: number }, Giftcard> = async (
  fetch,
  params,
) => {
  const [uri, init] = duplicateGiftcardAPI(params);

  return Result.try(
    async () => {
      const { data } = await fetch(uri, init);

      updateGiftcard(data);

      return data;
    },
    (error) =>
      new Error(`Failed to duplicate giftcard n°${params.id}`, {
        cause: error,
      }),
  );
};
