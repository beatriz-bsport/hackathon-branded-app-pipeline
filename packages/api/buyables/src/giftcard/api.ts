import {
  type ApiConfig,
  type Fetch,
  type PaginatedResponse,
  type Xhr,
  type XhrApiConfig,
  buildUrlParams,
} from "@bsport/store-base";

import type {
  FetchGiftcardImagesParams,
  FetchGiftcardsParams,
  Giftcard,
  GiftcardBackgroundListResponse,
  GiftcardImage,
  UploadGiftcardImageParams,
} from "./types";

const API_URL = "buyable/v1/giftcard";

// ----- Giftcard -----

export const fetchGiftcardsAPIConfig = (
  params: FetchGiftcardsParams,
): ApiConfig => {
  return [`${API_URL}/giftcard${buildUrlParams(params)}`];
};

export const fetchGiftcardsAPI = async (
  fetch: Fetch<PaginatedResponse<Giftcard>>,
  params: FetchGiftcardsParams,
): Promise<PaginatedResponse<Giftcard>> => {
  const [uri, init] = fetchGiftcardsAPIConfig(params);

  const { data } = await fetch(uri, init);

  return data;
};

export const restoreGiftcardAPIConfig = ({ id }: { id: number }): ApiConfig => {
  return [`${API_URL}/giftcard/${id}/restore/`, { method: "POST" }];
};

export const restoreGiftcardAPI = async (
  fetch: Fetch<Giftcard>,
  params: { id: number },
): Promise<Giftcard> => {
  const [uri, init] = restoreGiftcardAPIConfig(params);

  const { data } = await fetch(uri, init);

  return data;
};

export const archiveGiftcardAPIConfig = ({ id }: { id: number }): ApiConfig => {
  return [`${API_URL}/giftcard/${id}`, { method: "DELETE" }];
};

export const archiveGiftcardAPI = async (
  fetch: Fetch<Giftcard>,
  params: { id: number },
): Promise<Giftcard> => {
  const [uri, init] = archiveGiftcardAPIConfig(params);

  const { data } = await fetch(uri, init);

  return data;
};

export const duplicateGiftcardAPIConfig = ({
  id,
}: {
  id: number;
}): ApiConfig => {
  return [`${API_URL}/giftcard/${id}/copy/`, { method: "POST" }];
};

export const duplicateGiftcardAPI = async (
  fetch: Fetch<Giftcard>,
  params: { id: number },
): Promise<Giftcard> => {
  const [uri, init] = duplicateGiftcardAPIConfig(params);

  const { data } = await fetch(uri, init);

  return data;
};

// ----- GiftcardImageBackground -----

export const fetchGiftcardBackgroundListAPIConfig = (
  params: FetchGiftcardImagesParams | number,
): ApiConfig => {
  if (typeof params === "number") {
    return [`${API_URL}/giftcard_background_image/?company=${params}`];
  }
  return [`${API_URL}/giftcard_background_image${buildUrlParams(params)}`];
};

export const fetchGiftcardImagesAPI = async (
  fetch: Fetch<PaginatedResponse<GiftcardImage>>,
  params: FetchGiftcardImagesParams,
): Promise<PaginatedResponse<GiftcardImage>> => {
  const [uri, init] = fetchGiftcardBackgroundListAPIConfig(params);

  const { data } = await fetch(uri, init);

  return data;
};

/** @note This endpoint does not exist yet */
export const restoreGiftcardImageAPIConfig = ({
  id,
}: {
  id: number;
}): ApiConfig => {
  return [
    `${API_URL}/giftcard_background_image/${id}/restore/`,
    { method: "POST" },
  ];
};

export const restoreGiftcardImageAPI = async (
  fetch: Fetch<GiftcardImage>,
  params: { id: number },
): Promise<GiftcardImage> => {
  const [uri, init] = restoreGiftcardImageAPIConfig(params);

  const { data } = await fetch(uri, init);

  return data;
};

export const archiveGiftcardImageAPIConfig = ({
  id,
}: {
  id: number;
}): ApiConfig => {
  return [
    `${API_URL}/giftcard_background_image/${id}/archive/`,
    { method: "POST" },
  ];
};

export const archiveGiftcardImageAPI = async (
  fetch: Fetch<GiftcardImage>,
  params: { id: number },
): Promise<GiftcardImage> => {
  const [uri, init] = archiveGiftcardImageAPIConfig(params);

  const { data } = await fetch(uri, init);

  return data;
};

export const uploadGiftcardImageAPIConfig = ({
  file,
  signal,
  onUploadProgress,
}: UploadGiftcardImageParams): XhrApiConfig => {
  const formData = new FormData();
  formData.append("image", file);

  return [
    `${API_URL}/giftcard_background_image/`,
    { method: "POST", formData, onUploadProgress, signal },
  ];
};

export const uploadGiftcardImageAPI = async (
  xhr: Xhr<void>,
  params: UploadGiftcardImageParams,
): Promise<void> => {
  const [uri, init] = uploadGiftcardImageAPIConfig(params);

  await xhr(uri, init);
};

export const fetchGiftcardBackgroundListAPI = async (
  fetch: Fetch<GiftcardBackgroundListResponse>,
  companyId: number,
): Promise<GiftcardBackgroundListResponse> => {
  const [uri, init] = fetchGiftcardBackgroundListAPIConfig(companyId);

  const { data } = await fetch(uri, init);

  return data;
};
