import { type ApiConfig } from "@bsport/store-base";

import { UpdateReferralProgramSettingsPayload } from "./types";

const API_URL = "customer-data-platform/v1";

export const fetchReferralProgramSettingsAPI = (): ApiConfig => {
  return [`${API_URL}/referral/referral-program/me/`];
};

export const updateReferralProgramSettingsAPI = (params: {
  data: UpdateReferralProgramSettingsPayload;
}): ApiConfig => {
  return [
    `${API_URL}/referral/referral-program/me/`,
    {
      method: "PATCH",
      body: JSON.stringify(params),
    },
  ];
};
