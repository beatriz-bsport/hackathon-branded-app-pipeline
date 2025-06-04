import { type ApiConfig, buildUrlParams } from "@bsport/store-base";

const API_URL = "core-data/v1/master-data";

export type FetchSctParams = {
  companyId: number;
};

export const fetchScts = ({ companyId }: FetchSctParams): ApiConfig => {
  return [`${API_URL}/sct/${buildUrlParams({ company_id: companyId })}`];
};
