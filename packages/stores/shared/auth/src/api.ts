import type { ApiConfig } from "@bsport/store-base";

import type { FeedbackData } from "./types";

const API_URL_V0 = "platform/v0";
const API_URL = "platform/v1";

export type LoginParams = {
  email: string;
  password: string;
};

export const loginAPI = ({ email, password }: LoginParams): ApiConfig => {
  return [
    `${API_URL}/authentication/signin/with-jwt-login/`,
    {
      method: "POST",
      body: JSON.stringify({
        email,
        password,
      }),
    },
  ];
};

export const fetchUserAccessAPI = (): ApiConfig => {
  return [`${API_URL_V0}/saas/access_level`];
};

export const fetchTemporaryPasswordAPI = (): ApiConfig => {
  return [`${API_URL}/authentication/temp-password/`];
};

export const toggleRevampedBackofficeAPI = (
  params?: FeedbackData | void,
): ApiConfig => {
  return [
    `${API_URL}/authentication/toggle_revamped_backoffice/`,
    {
      method: "POST",
      body: JSON.stringify(params ?? {}),
    },
  ];
};

export const generateTemporaryPasswordAPI = (): ApiConfig => {
  return [
    `${API_URL}/authentication/temp-password/generate/`,
    {
      method: "POST",
    },
  ];
};
