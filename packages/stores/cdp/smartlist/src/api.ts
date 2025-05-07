import { type ApiConfig } from "@bsport/store-base";

const API_URL = "api/v1/smartlist";

export const fetchSmartlistsAPI = (): ApiConfig => {
  return [`${API_URL}/group/`];
};
