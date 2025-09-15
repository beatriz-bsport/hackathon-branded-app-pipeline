import { type ApiConfig, buildUrlParams } from "@bsport/store-base";

const API_URL = "buyable/v1/payment-pack";

export const fetchPassesAPI = (params: {
  page: number;
  page_size: number;
}): ApiConfig => {
  return [`${API_URL}/payment_pack/${buildUrlParams(params)}`];
};

export const updatePassesPI = (params: { data: unknown }): ApiConfig => {
  return [
    `${API_URL}/payment_pack/`,
    {
      method: "PATCH",
      body: JSON.stringify(params),
    },
  ];
};
