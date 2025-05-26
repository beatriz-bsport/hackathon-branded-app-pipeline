import type { ApiConfig } from "@bsport/store-base";

const API_URL = "core-data/v1/company/theme";

export const fetchCompanyThemeAPI = ({
  companyId,
}: {
  companyId?: number;
}): ApiConfig => {
  return [`${API_URL}/${companyId || "me"}/`];
};

export const updateCompanyThemeAPI = ({
  companyId,
  data,
}: {
  companyId: number;
  data: unknown;
}): ApiConfig => {
  return [
    `${API_URL}/${companyId}/`,
    {
      method: "PATCH",
      body: JSON.stringify(data),
    },
  ];
};
