import {
  type ApiConfig,
  type URLParams,
  type XhrApiConfig,
  buildUrlParams,
} from "@bsport/store-base";

const API_URL = "api/v1/giftcard";

// ----- Giftcard APIs -----

export type FetchGiftcardsParams = {
  page: number;
  page_size: number;
  disabled: boolean;
} & URLParams;

export const fetchGiftcardsAPI = (params: FetchGiftcardsParams): ApiConfig => {
  return [`${API_URL}/giftcard${buildUrlParams(params)}`];
};

export const restoreGiftcardAPI = ({ id }: { id: number }): ApiConfig => {
  return [
    `${API_URL}/giftcard/${id}/restore/`,
    {
      method: "POST",
    },
  ];
};

export const archiveGiftcardAPI = ({ id }: { id: number }): ApiConfig => {
  return [
    `${API_URL}/giftcard/${id}`,
    {
      method: "DELETE",
    },
  ];
};

export const duplicateGiftcardAPI = ({ id }: { id: number }): ApiConfig => {
  return [
    `${API_URL}/giftcard/${id}/copy/`,
    {
      method: "POST",
    },
  ];
};

// ----- GiftcardImageBackground APIs -----

export type FetchGiftcardImagesParams = {
  page: number;
  page_size: number;
  company: number;
};

export const fetchGiftcardImagesAPI = (
  params: FetchGiftcardImagesParams,
): ApiConfig => {
  return [`${API_URL}/giftcard_background_image${buildUrlParams(params)}`];
};

/** @note This endpoint does not exist yet */
export const restoreGiftcardImageAPI = ({ id }: { id: number }): ApiConfig => {
  return [
    `${API_URL}/giftcard_background_image/${id}/restore/`,
    {
      method: "POST",
    },
  ];
};

export const archiveGiftcardImageAPI = ({ id }: { id: number }): ApiConfig => {
  return [
    `${API_URL}/giftcard_background_image/${id}/archive/`,
    {
      method: "POST",
    },
  ];
};

export type UploadGiftcardImageParams = {
  file: File;
  signal: AbortSignal;
  onUploadProgress: (progressEvent: ProgressEvent) => void;
};

export const uploadGiftcardImageAPI = ({
  file,
  signal,
  onUploadProgress,
}: UploadGiftcardImageParams): XhrApiConfig => {
  const formData = new FormData();
  formData.append("image", file);

  return [
    `${API_URL}/giftcard_background_image/`,
    {
      method: "POST",
      formData,
      onUploadProgress,
      signal,
    },
  ];
};
