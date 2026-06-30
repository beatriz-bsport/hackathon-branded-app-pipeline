import { type Fetch } from "@bsport/store-base";

import { QUERY_KEY_MAIN } from "#src/constants";

import { API_V1_URL_MOBILE_APP_CUSTOM_POPUP_LINKS } from "./constants";
import type { Popup, PopupImageQueryOptionsParams } from "./types";

// ----------------------------------------------------------------------------

export const mobileAppKeys = {
  all: [QUERY_KEY_MAIN, "mobile-app"] as const,

  popupDetail: (popupId: number) =>
    [...mobileAppKeys.all, "popup", popupId] as const,
  popupImages: (params: PopupImageQueryOptionsParams) =>
    [
      ...mobileAppKeys.all,
      "popup-image",
      params.popupId,
      params.imageUrl,
    ] as const,
} as const;

// ----------------------------------------------------------------------------

export const fetchPopupDetailAPI = async (
  fetch: Fetch<Popup>,
  popupId: number,
): Promise<Popup> => {
  const { data } = await fetch(
    `${API_V1_URL_MOBILE_APP_CUSTOM_POPUP_LINKS}/${popupId}/`,
  );
  return data;
};

export const fetchPopupImageAPI = async (
  fetch: Fetch<Blob>,
  imageUrl: string,
): Promise<File> => {
  const url = new URL(imageUrl);
  const filename = url.pathname.split("/").pop() || "popup-image.jpg";
  const { data } = await fetch(imageUrl, {
    responseType: "buffer",
  });
  return new File([data], filename, { type: data.type });
};
