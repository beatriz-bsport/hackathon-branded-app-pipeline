import type { ApiConfig } from "@bsport/store-base";

export type LoginParams = {
  email: string;
  password: string;
};

export const login = ({ email, password }: LoginParams): ApiConfig => {
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
