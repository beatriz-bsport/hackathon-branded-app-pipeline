import { Result } from "typescript-result";

import type { Action, PaginatedResponse, XhrAction } from "@bsport/store-base";

import {
  type FetchGiftcardImagesParams,
  type UploadGiftcardImageParams,
  archiveGiftcardImageAPI,
  fetchGiftcardImagesAPI,
  restoreGiftcardImageAPI,
  uploadGiftcardImageAPI,
} from "#src/api";
import type { GiftcardImage } from "#src/types";

import { setGiftcardImages, updateGiftcardImage } from "./store";

/**
 * Fetch a paginated list of GiftcardBackgroundImage.
 * @param params.page The page number.
 * @param params.page_size The number of items per page.
 * @param params.company Id of the company for which we want to load the images.
 */
export const fetchGiftcardImagesAction: Action<
  FetchGiftcardImagesParams,
  PaginatedResponse<GiftcardImage>
> = async (fetch, params) => {
  const [uri, init] = fetchGiftcardImagesAPI(params);

  return Result.try(
    async () => {
      const { data } = await fetch(uri, init);

      setGiftcardImages({
        giftcardImages: data.results,
        page: data.page,
        count: data.count,
      });

      return data;
    },
    (error) => new Error("Failed to fetch giftcardImages", { cause: error }),
  );
};

/**
 * Archive an active GiftcardBackgroundImage.
 * @param params.id Id of the GiftcardBackgroundImage to archive.
 */
export const archiveGiftcardImageAction: Action<
  { id: number },
  GiftcardImage
> = async (fetch, params) => {
  const [uri, init] = archiveGiftcardImageAPI(params);

  return Result.try(
    async () => {
      const { data } = await fetch(uri, init);

      updateGiftcardImage(data);

      return data;
    },
    (error) =>
      new Error(`Failed to archive giftcard image n°${params.id}`, {
        cause: error,
      }),
  );
};

/**
 * Restore an archived GiftcardBackgroundImage.
 * @param params.id Id of the GiftcardBackgroundImage to restore.
 */
export const restoreGiftcardImageAction: Action<
  { id: number },
  GiftcardImage
> = async (fetch, params) => {
  const [uri, init] = restoreGiftcardImageAPI(params);

  return Result.try(
    async () => {
      const { data } = await fetch(uri, init);

      updateGiftcardImage(data);

      return data;
    },
    (error) =>
      new Error(`Failed to restore giftcard image n°${params.id}`, {
        cause: error,
      }),
  );
};

/**
 * Upload GiftcardBackgroundImage while tracking the request progress.
 * Make it abortable using an AbortSignal.
 * Careful : you should provide your xhr instance instead of fetch.
 */
export const uploadGiftcardImageAction: XhrAction<
  UploadGiftcardImageParams,
  void
> = async (xhr, params) => {
  const [uri, init] = uploadGiftcardImageAPI(params);

  return Result.try(
    async () => {
      await xhr(uri, init);
    },
    (error) => {
      if (params.signal.aborted) {
        return new Error(`Upload has been aborted by the user`, {
          cause: error,
        });
      }
      return new Error(`Failed to upload a new giftcard image`, {
        cause: error,
      });
    },
  );
};
