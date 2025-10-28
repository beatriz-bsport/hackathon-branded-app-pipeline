import { type ApiConfig, buildUrlParams } from "@bsport/store-base";

import type { FetchSubstitutionRequestsParams } from "#src/types";

const API_URL = "book/v1/replacement_request";

export const fetchSubstitutionRequestsAPI = (
  params?: FetchSubstitutionRequestsParams,
): ApiConfig => {
  return [`${API_URL}/${buildUrlParams(params ?? {})}`];
};
