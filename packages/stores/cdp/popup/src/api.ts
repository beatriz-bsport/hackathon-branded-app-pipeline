import { type ApiConfig, XhrApiConfig } from "@bsport/store-base";

import type { CreateSmartlistPopupParams, EditPopupParams } from "./types";

export const API_URL = "api/v1/mobile_app/manager/custom_popup_links/";
export const SMARTLIST_POPUP_API_URL =
  "api/v1/mobile_app/smartlist_popup_sending/send_smartlist_popup/";

export const fetchPopupsAPI = (): ApiConfig => {
  return [API_URL];
};

export const fetchPopupAPI = (id: number): ApiConfig => {
  return [`${API_URL}${id}/`];
};

export const createSmartlistPopupAPI = (
  params: CreateSmartlistPopupParams,
): XhrApiConfig => {
  const formData = new FormData();
  formData.append("name", params.name);
  formData.append("link", params.link);
  formData.append("image", params.image);
  formData.append("smartlist_id", params.smartlist_id.toString());

  return [
    SMARTLIST_POPUP_API_URL,
    {
      method: "POST",
      formData,
    },
  ];
};

export const editPopupAPI = (params: EditPopupParams): XhrApiConfig => {
  const formData = new FormData();
  if (params.name) {
    formData.append("name", params.name);
  }
  if (params.link) {
    formData.append("link", params.link);
  }
  if (params.image) {
    formData.append("image", params.image);
  }

  return [
    `${API_URL}${params.id}/`,
    {
      method: "PATCH",
      formData,
    },
  ];
};
