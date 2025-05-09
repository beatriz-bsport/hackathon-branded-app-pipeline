import { type ApiConfig, buildUrlParams } from "@bsport/store-base";

const API_URL = "buyable/v1/order";

export const fetchOrdersAPI = (params: {
  page: number;
  page_size: number;
}): ApiConfig => {
  return [`${API_URL}/path/to/get/${buildUrlParams(params)}`];
};

export const updateOrderAPI = (params: { data: unknown }): ApiConfig => {
  return [
    `${API_URL}/path/to/update/`,
    {
      method: "PATCH",
      body: JSON.stringify(params),
    },
  ];
};
