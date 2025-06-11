import { type ApiConfig, buildUrlParams } from "@bsport/store-base";

const API_URL = "core-data/v1/master-data";

export type FetchSportCategoryParams = {
  companyId: number;
};

export const fetchSportCategories = ({
  companyId,
}: FetchSportCategoryParams): ApiConfig => {
  return [`${API_URL}/sct/${buildUrlParams({ company_id: companyId })}`];
};
