import type { ApiConfig } from "@bsport/store-base";

export type LoginParams = {
  email: string;
  password: string;
};

export const loginAPI = ({ email, password }: LoginParams): ApiConfig => {
  return [
    "api/v1/authentication/signin/with-login/",
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
  return ["platform/v0/saas/access_level"];
};
