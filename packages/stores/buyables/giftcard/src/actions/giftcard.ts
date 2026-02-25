import { Result } from "typescript-result";

import {
  type FetchGiftcardsParams,
  type Giftcard,
  archiveGiftcardAPI,
  createGiftcardAPI,
  duplicateGiftcardAPI,
  fetchGiftcardAPI,
  fetchGiftcardsAPI,
  restoreGiftcardAPI,
} from "@bsport/api-buyables";
import type { Action, PaginatedResponse, XhrAction } from "@bsport/store-base";
import { createErrorWithContext } from "@bsport/store-base";

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
  return Result.try(
    async () => {
      const data = await fetchGiftcardsAPI(fetch, params);

      setGiftcards({
        giftcards: data.results,
        page: data.page,
        count: data.count,
      });

      return data;
    },
    (error) =>
      createErrorWithContext(error, {
        message: "Failed to fetch giftcards",
        params,
      }),
  );
};

export const fetchGiftcardAction: Action<{ id: number }, Giftcard> = async (
  fetch,
  params,
) => {
  return Result.try(
    async () => {
      const data = await fetchGiftcardAPI(fetch, params);

      updateGiftcard(data);

      return data;
    },
    (error) =>
      createErrorWithContext(error, {
        message: `Failed to fetch giftcard n°${params.id}`,
        params,
      }),
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
  return Result.try(
    async () => {
      const data = await archiveGiftcardAPI(fetch, params);

      updateGiftcard(data);

      return data;
    },
    (error) =>
      createErrorWithContext(error, {
        message: `Failed to archive giftcard n°${params.id}`,
        params,
      }),
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
  return Result.try(
    async () => {
      const data = await restoreGiftcardAPI(fetch, params);

      updateGiftcard(data);

      return data;
    },
    (error) =>
      createErrorWithContext(error, {
        message: `Failed to restore giftcard n°${params.id}`,
        params,
      }),
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
  return Result.try(
    async () => {
      const data = await duplicateGiftcardAPI(fetch, params);

      updateGiftcard(data);

      return data;
    },
    (error) =>
      createErrorWithContext(error, {
        message: `Failed to duplicate giftcard n°${params.id}`,
        params,
      }),
  );
};

/**
 * Create a Giftcard with the provided data in the FormData params
 */
export const createGiftcardAction: XhrAction<FormData, Giftcard> = async (
  xhr,
  params,
) => {
  return Result.try(
    async () => {
      const data = await createGiftcardAPI(xhr, params);

      updateGiftcard(data);

      return data;
    },
    (error) =>
      createErrorWithContext(error, {
        message: "Failed to create giftcard",
      }),
  );
};
