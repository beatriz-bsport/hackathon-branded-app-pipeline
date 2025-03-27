/** TODO
 * - Move all of this in pkg store store/buyables/giftcard
 * - Remove boilerplate
 * - Classic get list : only one with the disabled as params
 * - Error handling
 * */
import type { Dispatch, SetStateAction } from "react";

import { fetchWithAuth, getAuthToken } from "@bsport/b2b-backbone";

import { xhr } from "#src/utils/fetch";

const API_URI = "api/v1";

export type Giftcard = {
  amount_gifted: string;
  available_payment_method_identifiers: Array<number>;
  bookkeeping_account: number | null;
  company: number;
  cover: string;
  description: string;
  disabled: boolean;
  expiration_days: number | null;
  id: number;
  is_shared_giftcard: boolean;
  manager_only: boolean;
  name: string;
  price: string;
  tags_on_consumer_item_creation: Array<string>;
};

export type GiftcardImage = {
  id: number;
  image: string; // src url
};

// ----- Giftcard List (Active and Archived -----

/**
 * Retrieve a paginated list of GiftcardImage
 */
export async function getGiftcardList({
  currentPage,
  rowsPerPage,
  setGiftcardList,
  setTotalItems,
}: {
  currentPage: number;
  rowsPerPage: number;
  setGiftcardList: Dispatch<SetStateAction<Giftcard[]>>;
  setTotalItems: Dispatch<SetStateAction<number>>;
}) {
  try {
    // TODO : Add pagination on the backend
    console.log("Should paginate with : ", { currentPage, rowsPerPage });
    const { data } = await fetchWithAuth(
      `${API_URI}/giftcard/giftcard?disabled=false`,
    );
    // TODO : Retrieve paginated response instead of just response
    // @ts-expect-error data must be typed Giftcard[]
    setGiftcardList(data);
    setTotalItems(data.length);
  } catch (error) {
    console.error(error);
  }
}

/**
 * Retrieve a paginated list of archievd Giftcard
 */
export async function getGiftcardArchivedList({
  currentPage,
  rowsPerPage,
  setGiftcardList,
  setTotalItems,
}: {
  currentPage: number;
  rowsPerPage: number;
  setGiftcardList: Dispatch<SetStateAction<Giftcard[]>>;
  setTotalItems: Dispatch<SetStateAction<number>>;
}) {
  try {
    // TODO : Add pagination on the backend
    console.log("Should paginate with : ", { currentPage, rowsPerPage });
    const { data } = await fetchWithAuth(
      `${API_URI}/giftcard/giftcard?disabled=true`,
    );
    // TODO : Retrieve paginated response instead of just response
    // @ts-expect-error data must be typed Giftcard[]
    setGiftcardList(data);
    setTotalItems(data.length);
  } catch (error) {
    console.error(error);
  }
}

/**
 * Restore an archived giftcard
 */
export async function restoreGiftcard({ giftcardId }: { giftcardId: number }) {
  try {
    const { data } = await fetchWithAuth(
      `${API_URI}/giftcard/giftcard/${giftcardId}/restore/`,
      {
        method: "POST",
      },
    );
    return data;
  } catch (error) {
    console.error(error);
  }
}

/**
 * Archive an active giftcard
 */
export async function archiveGiftcard({ giftcardId }: { giftcardId: number }) {
  try {
    const { data } = await fetchWithAuth(
      `${API_URI}/giftcard/giftcard/${giftcardId}`,
      {
        method: "DELETE",
      },
    );
    return data;
  } catch (error) {
    console.error(error);
  }
}

/**
 * Duplicate an active giftcard
 */
export async function duplicateGiftcard({
  giftcardId,
}: {
  giftcardId: number;
}): Promise<Giftcard | void> {
  try {
    const { data } = await fetchWithAuth(
      `${API_URI}/giftcard/giftcard/${giftcardId}/copy/`,
      {
        method: "POST",
      },
    );
    // @ts-expect-error data should be typed with Giftcard
    return data;
  } catch (error) {
    console.error(error);
  }
}

// ----- Giftcard Image Upload Modal -----

/**
 * Retrieve Company theme
 */
export async function getCompanyTheme({
  setTheme,
}: {
  setTheme: Dispatch<SetStateAction<{ cover: string }>>;
}) {
  try {
    const { data } = await fetchWithAuth("api/v1/company/theme/me/");
    // @ts-expect-error data should be typed with theme
    setTheme(data);
  } catch (error) {
    console.error(error);
  }
}

/**
 * Retrieve a paginated list of GiftcardBackgroundImage
 */
export async function getGiftcardImageList({
  currentPage,
  rowsPerPage,
  setItemList,
  setTotalItems,
}: {
  currentPage: number;
  rowsPerPage: number;
  setItemList: Dispatch<SetStateAction<GiftcardImage[]>>;
  setTotalItems: Dispatch<SetStateAction<number>>;
}) {
  try {
    // TODO : Add pagination on the backend
    console.log("Should paginate with : ", { currentPage, rowsPerPage });
    // TODO : Filter bg image with company directly in the backend
    const { data } = await fetchWithAuth(
      `${API_URI}/giftcard/giftcard_background_image?company=2`,
    );
    // Retrieve paginated response instead of just response
    // @ts-expect-error data should be typed with GiftcardImage[]
    setItemList(data);
    setTotalItems(data.length);
  } catch (error) {
    console.error(error);
  }
}

/**
 * Upload Giftcard Background Image while tracking the request progress.
 * Make it abortable using an AbortSignal.
 */
export async function uploadGiftcardImage({
  file,
  signal,
  onUploadProgress,
}: {
  file: File;
  signal: AbortSignal;
  onUploadProgress: (progressEvent: ProgressEvent) => void;
}): Promise<
  { status: "success" | "abort" } | { status: "error"; error_code: number }
> {
  try {
    const token = getAuthToken();
    const formData = new FormData();
    formData.append("image", file);

    await xhr(`${API_URI}/giftcard/giftcard_background_image/`, {
      headers: { Authorization: `Token ${token}` },
      method: "POST",
      formData: formData,
      onUploadProgress: onUploadProgress,
      signal: signal,
    });
    // If ok, should return Upload state "success"
    return { status: "success" };
  } catch (error) {
    console.error(error);
    if (signal.aborted) {
      // Log a signal to highlight that the upload error has been triggered by the user.
      console.log("Upload aborted successfully by the user");
      return { status: "abort" };
    }
    // If failed, should return the custom error code why it has failed
    // TODO : detect error_code from API call
    return { status: "error", error_code: 400 };
  }
}

/**
 * Archive a GiftcardBackgroundImage.
 */
export async function archiveGiftcardImage({ id }: { id: number }) {
  try {
    await fetchWithAuth(`${API_URI}/giftcard/giftcard_background_image/${id}`, {
      method: "DELETE",
    });
  } catch (error) {
    console.error(error);
  }
}

export async function restoreGiftcardImage({ id }: { id: number }) {
  try {
    // TODO : Implement the endpoint
    await fetchWithAuth(
      `${API_URI}/giftcard/giftcard_background_image/restore/${id}`,
      {
        method: "POST",
      },
    );
  } catch (error) {
    console.error(error);
  }
}
