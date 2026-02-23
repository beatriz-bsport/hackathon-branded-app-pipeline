import { type ApiConfig, Fetch, buildUrlParams } from "@bsport/store-base";

import { API_V1_URL } from "../constants";
import { FetchSportCategoryParams, SportCategory } from "./types";

const API_URL = `${API_V1_URL}/master-data`;

export const fetchSportCategoriesAPIConfig = ({
  companyId,
}: FetchSportCategoryParams): ApiConfig => {
  return [`${API_URL}/sct/${buildUrlParams({ company_id: companyId })}`];
};

export const fetchSportCategories = async (
  fetch: Fetch<SportCategory[]>,
  params: FetchSportCategoryParams,
): Promise<SportCategory[]> => {
  const [uri, init] = fetchSportCategoriesAPIConfig(params);
  const { data } = await fetch(uri, init);

  return data;
};
