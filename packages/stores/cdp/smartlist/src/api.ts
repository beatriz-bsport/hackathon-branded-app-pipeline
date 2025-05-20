import { type ApiConfig, buildUrlParams } from "@bsport/store-base";

const API_URL = "api/v1/smartlist";
const CDP_API_URL = "customer-data-platform/v1/smartlist";

export const fetchSmartlistsAPI = (): ApiConfig => {
  return [`${API_URL}/group/`];
};

export const fetchSearchSmartlistsAPI = (params: {
  search: string;
}): ApiConfig => {
  return [
    `${CDP_API_URL}/group/search${buildUrlParams({
      q: params.search,
    })}`,
  ];
};
