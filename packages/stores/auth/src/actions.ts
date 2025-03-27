import { Result } from "typescript-result";

import {
  removeAuthToken,
  setAuthToken,
} from "@bsport/local-storage-auth-token";
import type { Action } from "@bsport/store-base";

import { type LoginParams, login as apiLogin } from "./api";
import { LOGIN_URL } from "./constants";

/**
 * Try to log in with the provided email and password.
 * If the login is successful, the token is stored in localStorage.
 * @param email
 * @param password
 */
export const login: Action<LoginParams, Result<void, Error>> = async (
  fetch,
  params,
) => {
  const [uri, init] = apiLogin(params);

  return Result.try(
    async () => {
      const token = (await fetch<{ token: string }>(uri, init)).data;
      setAuthToken(token.token);
      return;
    },
    (error) => new Error("Token not found in response.", { cause: error }),
  );
};

/**
 * Remove the authentication token from localStorage and redirect to the specified route.
 * @param redirectRoute [Optional] Route to redirect to after logout. If not provided, route to "/login".
 */
export const logout = async (redirectRoute?: string) => {
  removeAuthToken();
  window.location.href = redirectRoute ?? LOGIN_URL;
};
