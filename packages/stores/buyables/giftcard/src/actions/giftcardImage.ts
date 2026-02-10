import { Result } from "typescript-result";

import {
  type FetchGiftcardImagesParams,
  type GiftcardImage,
  type UploadGiftcardImageParams,
  archiveGiftcardImageAPI,
  fetchGiftcardImagesAPI,
  restoreGiftcardImageAPI,
  uploadGiftcardImageAPI,
} from "@bsport/api-buyables";
import type { Action, PaginatedResponse, XhrAction } from "@bsport/store-base";
import { createErrorWithContext } from "@bsport/store-base";

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
  return Result.try(
    async () => {
      const data = await fetchGiftcardImagesAPI(fetch, params);

      setGiftcardImages({
        giftcardImages: data.results,
        page: data.page,
        count: data.count,
      });

      return data;
    },
    (error) =>
      createErrorWithContext(error, {
        message: "Failed to fetch giftcardImages",
        params,
      }),
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
  return Result.try(
    async () => {
      const data = await archiveGiftcardImageAPI(fetch, params);

      updateGiftcardImage(data);

      return data;
    },
    (error) =>
      createErrorWithContext(error, {
        message: `Failed to archive giftcard image n°${params.id}`,
        params,
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
  return Result.try(
    async () => {
      const data = await restoreGiftcardImageAPI(fetch, params);

      updateGiftcardImage(data);

      return data;
    },
    (error) =>
      createErrorWithContext(error, {
        message: `Failed to restore giftcard image n°${params.id}`,
        params,
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
  return Result.try(
    async () => {
      await uploadGiftcardImageAPI(xhr, params);
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
