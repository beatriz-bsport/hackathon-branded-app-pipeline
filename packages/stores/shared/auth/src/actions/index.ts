import { Result } from "typescript-result";

import {
  removeAuthToken,
  setAuthToken,
} from "@bsport/local-storage-auth-token";
import { type Action, createErrorWithContext } from "@bsport/store-base";

import {
  type LoginParams,
  fetchTemporaryPasswordAPI,
  fetchUserAccessAPI,
  generateTemporaryPasswordAPI,
  loginAPI,
  toggleRevampedBackofficeAPI,
} from "#src/api";
import type { FeedbackData, TemporaryPassword, UserAccess } from "#src/types";

import {
  updateRevampedBackofficeEnabled,
  updateTemporaryPassword,
  updateUserAccess,
} from "./store";

/**
 * Try to log in with the provided email and password.
 * If the login is successful, the token is stored in localStorage.
 * @param email
 * @param password
 */
export const loginAction: Action<
  LoginParams,
  { token: string },
  Error,
  void
> = async (fetch, params) => {
  const [uri, init] = loginAPI(params);

  return Result.try(
    async () => {
      const { data } = await fetch(uri, init);

      setAuthToken(data.token);
    },
    (error) =>
      createErrorWithContext(error, {
        message: "Token not found in response.",
        params,
      }),
  );
};

/**
 * Remove the authentication token from localStorage
 * @param callback Function to call when the Token has been removed.
 * Expecting a Redirect callback using React router context.
 */
export const logoutAction = async (callback?: () => void) => {
  removeAuthToken();
  callback?.();
};

/**
 * Fetch access permissions of the current connected user.
 */
export const fetchUserAccessAction: Action<void, UserAccess> = async (
  fetch,
) => {
  const [uri, init] = fetchUserAccessAPI();

  return Result.try(
    async () => {
      const { data } = await fetch(uri, init);

      updateUserAccess(data);

      return data;
    },
    (error) =>
      createErrorWithContext(error, { message: "Failed to fetch user access" }),
  );
};

/**
 * Try to retrieve an active temporary password
 */
export const fetchTemporaryPasswordAction: Action<
  void,
  TemporaryPassword
> = async (fetch) => {
  const [uri, init] = fetchTemporaryPasswordAPI();

  return Result.try(
    async () => {
      const { data } = await fetch(uri, init);

      updateTemporaryPassword(data);

      return data;
    },
    (error) =>
      createErrorWithContext(error, {
        message: "Failed to fetch temporary password",
      }),
  );
};

/**
 * Toggle (on/off) the revamped_backoffice_enabled field in the user metadata.
 * If provided, push revamped feedback to the backend to store them.
 * @param data.additionalFeedback Text to provide more insights
 * @param data.selectedReasons List of selected reasons
 * @param data.sourceUrl URL location from which the endpoint has been called
 * @param version Current version of the frontend from which the request has been made
 * @param locale Current locale used by the user that calls the endpoint
 * @returns The new value of the field
 */
export const toggleRevampedBackofficeAction: Action<
  FeedbackData | void,
  { has_enabled_revamped_backoffice: boolean }
> = async (fetch, data) => {
  const [uri, init] = toggleRevampedBackofficeAPI(data);

  return Result.try(
    async () => {
      const { data } = await fetch(uri, init);

      updateRevampedBackofficeEnabled(data.has_enabled_revamped_backoffice);

      return data;
    },
    (error) =>
      createErrorWithContext(error, {
        message: "Failed to toggle revamped_backoffice_enabled",
      }),
  );
};

/**
 * Generate a temporary password for the current user
 */
export const generateTemporaryPasswordAction: Action<
  void,
  TemporaryPassword
> = async (fetch) => {
  const [uri, init] = generateTemporaryPasswordAPI();

  return Result.try(
    async () => {
      const { data } = await fetch(uri, init);

      updateTemporaryPassword(data);

      return data;
    },
    (error) =>
      createErrorWithContext(error, {
        message: "Failed to generate temporary password",
      }),
  );
};
