import { type ApiConfig, XhrApiConfig } from "@bsport/store-base";

import type { CreateSmartlistPopupParams } from "./types";

export const API_URL = "api/v1/mobile_app/manager/custom_popup_links/";
export const SMARTLIST_POPUP_API_URL =
  "api/v1/mobile_app/smartlist_popup_sending/send_smartlist_popup/";

export const fetchPopupsAPI = (): ApiConfig => {
  return [`${API_URL}/`];
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
