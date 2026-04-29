import { mutationOptions } from "@tanstack/react-query";

import { type Fetch } from "@bsport/store-base";

import { API_V1_URL } from "../constants";
import type { CompanyTheme, UpdateCompanyThemeParams } from "./types";

const API_URL = `${API_V1_URL}/company/theme`;

export const updateCompanyThemeAPI = async (
  fetch: Fetch<CompanyTheme>,
  { companyId, data }: UpdateCompanyThemeParams,
): Promise<CompanyTheme> => {
  const { data: response } = await fetch(`${API_URL}/${companyId}/`, {
    method: "PATCH",
    body: JSON.stringify(data),
  });

  return response;
};

export const updateCompanyThemeMutationOptions = (fetch: Fetch<CompanyTheme>) =>
  mutationOptions({
    mutationFn: (params: UpdateCompanyThemeParams) =>
      updateCompanyThemeAPI(fetch, params),
  });
