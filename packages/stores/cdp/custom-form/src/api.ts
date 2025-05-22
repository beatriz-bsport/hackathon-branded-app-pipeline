import { type ApiConfig, buildUrlParams } from "@bsport/store-base";

import type { CustomForm } from "./types";

const API_URL = "customer-data-platform/v1/custom_form";

export const fetchCustomFormsAPI = (params: {
  page: number;
  page_size: number;
}): ApiConfig => {
  return [`${API_URL}/custom_form/${buildUrlParams(params)}`];
};

export const createCustomFormAPI = (params: {
  data: CustomForm;
}): ApiConfig => {
  return [
    `${API_URL}/custom_form`,
    {
      method: "POST",
      body: JSON.stringify(params),
    },
  ];
};
