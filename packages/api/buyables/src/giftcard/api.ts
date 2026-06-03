import { type PaginatedResponse, buildUrlParams } from "@bsport/store-base";

import { createAPI, createXhrAPI } from "#src/shared";

import { API_V1_URL } from "../constants";
import type {
  ApplyGiftCardCodeParams,
  ConsumerGiftcard,
  FetchConsumerGiftcardsParams,
  FetchGiftcardImagesParams,
  FetchGiftcardsParams,
  Giftcard,
  GiftcardBackgroundListResponse,
  GiftcardImage,
  SendInvitationEmailParams,
  UploadGiftcardImageParams,
} from "./types";

const API_URL = `${API_V1_URL}/giftcard`;

export const giftcardKeys = {
  all: ["@api-buyables", "giftcard"] as const,
  consumerGiftcardsList: (params: Omit<FetchConsumerGiftcardsParams, "page">) =>
    [...giftcardKeys.all, "consumer-giftcards", "list", params] as const,
} as const;

// #region Giftcard

// ----------------------------------------------------------------------------

export const fetchGiftcardsAPI = createAPI<
  PaginatedResponse<Giftcard>,
  FetchGiftcardsParams
>((params) => [`${API_URL}/giftcard${buildUrlParams(params)}`]);

// ----------------------------------------------------------------------------

export const fetchGiftcardAPI = createAPI<Giftcard, { id: number }>(
  ({ id }) => [`${API_URL}/giftcard/${id}/`],
);

// ----------------------------------------------------------------------------

export const restoreGiftcardAPI = createAPI<Giftcard, { id: number }>(
  ({ id }) => [`${API_URL}/giftcard/${id}/restore/`, { method: "POST" }],
);

// ----------------------------------------------------------------------------

export const archiveGiftcardAPI = createAPI<Giftcard, { id: number }>(
  ({ id }) => [`${API_URL}/giftcard/${id}`, { method: "DELETE" }],
);

// ----------------------------------------------------------------------------

export const duplicateGiftcardAPI = createAPI<Giftcard, { id: number }>(
  ({ id }) => [`${API_URL}/giftcard/${id}/copy/`, { method: "POST" }],
);

// ----------------------------------------------------------------------------

export const createGiftcardAPI = createXhrAPI<Giftcard, FormData>((params) => [
  `${API_URL}/giftcard/`,
  { method: "POST", formData: params },
]);

// ----------------------------------------------------------------------------

export const updateGiftcardAPI = createXhrAPI<
  Giftcard,
  { id: number; data: FormData }
>(({ id, data }) => [
  `${API_URL}/giftcard/${id}/`,
  { method: "PATCH", formData: data },
]);

// #endregion

// ############################################################################

// region ConsumerGiftcard

export const fetchConsumerGiftcardsAPI = createAPI<
  PaginatedResponse<ConsumerGiftcard>,
  FetchConsumerGiftcardsParams
>((params) => [`${API_URL}/consumer_giftcard/${buildUrlParams(params)}`]);

// ----------------------------------------------------------------------------

export const fetchConsumerGiftcardAPI = createAPI<
  ConsumerGiftcard,
  { id: number }
>((params) => [`${API_URL}/consumer_giftcard/${params.id}/`]);

// ----------------------------------------------------------------------------

export const sendEmailInvitationAPI = createAPI<
  void,
  SendInvitationEmailParams
>((params) => [
  `${API_URL}/consumer_giftcard/${params.consumerGiftcardId}/send_email_invitation/`,
  {
    method: "POST",
    body: JSON.stringify({ email_sent_to: params.recipientEmails }),
  },
]);

// ----------------------------------------------------------------------------

export const applyGiftCardCodeAPI = createAPI<
  ConsumerGiftcard,
  ApplyGiftCardCodeParams
>((params) => [
  `${API_URL}/consumer_giftcard/attribute_by_printable_code/`,
  { method: "POST", body: JSON.stringify(params) },
]);

// #endregion

// ############################################################################

// region GiftcardImageBackground

export const fetchGiftcardBackgroundListAPI = createAPI<
  GiftcardBackgroundListResponse,
  number
>((params) => [`${API_URL}/giftcard_background_image/?company=${params}`]);

export const fetchGiftcardImagesAPI = createAPI<
  PaginatedResponse<GiftcardImage>,
  FetchGiftcardImagesParams
>((params) => [
  `${API_URL}/giftcard_background_image${buildUrlParams(params)}`,
]);

// ----------------------------------------------------------------------------

export const restoreGiftcardImageAPI = createAPI<GiftcardImage, { id: number }>(
  (params) => [
    `${API_URL}/giftcard_background_image/${params.id}/restore/`,
    { method: "POST" },
  ],
);

// ----------------------------------------------------------------------------

export const archiveGiftcardImageAPI = createAPI<GiftcardImage, { id: number }>(
  (params) => [
    `${API_URL}/giftcard_background_image/${params.id}/archive/`,
    { method: "POST" },
  ],
);

// ----------------------------------------------------------------------------

export const uploadGiftcardImageAPI = createXhrAPI<
  void,
  UploadGiftcardImageParams
>(({ file, signal, onUploadProgress }) => {
  const formData = new FormData();
  formData.append("image", file);

  return [
    `${API_URL}/giftcard_background_image/`,
    { method: "POST", formData, onUploadProgress, signal },
  ];
});

// #endregion
