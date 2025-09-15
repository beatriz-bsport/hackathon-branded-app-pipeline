import { type ApiConfig, buildUrlParams } from "@bsport/store-base";

const API_URL = "buyable/v1/shop";

export const fetchWebshopItemsAPI = (params: {
  page: number;
  page_size: number;
}): ApiConfig => {
  return [`${API_URL}/item/${buildUrlParams(params)}`];
};

export const updateWebshopItemAPI = (params: { data: unknown }): ApiConfig => {
  return [
    `${API_URL}/item/`,
    {
      method: "PATCH",
      body: JSON.stringify(params),
    },
  ];
};
