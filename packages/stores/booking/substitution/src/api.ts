import { type ApiConfig, buildUrlParams } from "@bsport/store-base";

const API_URL = "book/v1/replacement_request";

export const fetchSubstitutionRequestsAPI = (): ApiConfig => {
  return [`${API_URL}/${buildUrlParams({})}`];
};
