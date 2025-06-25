import type { ApiConfig } from "@bsport/store-base";

const API_URL = "platform/v1";

export type LoginParams = {
  email: string;
  password: string;
};

export const loginAPI = ({ email, password }: LoginParams): ApiConfig => {
  return [
    `${API_URL}/authentication/signin/with-login/`,
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
  return [`${API_URL}/saas/access_level`];
};

export const fetchTemporaryPasswordAPI = (): ApiConfig => {
  return [`${API_URL}/authentication/temp-password/`];
};

export const generateTemporaryPasswordAPI = (): ApiConfig => {
  return [
    `${API_URL}/authentication/temp-password/generate/`,
    {
      method: "POST",
    },
  ];
};
